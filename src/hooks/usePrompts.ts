import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PromptWithMetadata, SortOption, EducationTag } from '@/types'
import { useUserToken } from '@/hooks/useUserToken'

interface UsePromptsOptions {
  savedOnly?: boolean
  tags?: EducationTag[]
  sort?: SortOption
  searchQuery?: string
}

export function usePrompts(options: UsePromptsOptions = {}) {
  const { savedOnly = false, tags = [], sort = 'recent', searchQuery = '' } = options
  const userToken = useUserToken()

  console.log('[usePrompts] Hook called with:', {
    savedOnly,
    tags,
    sort,
    searchQuery,
    userToken,
  })

  return useQuery({
    queryKey: ['prompts', savedOnly, tags, sort, searchQuery, userToken],
    queryFn: async () => {
      console.log('[usePrompts] ✅ Query function EXECUTING')
      console.log('[usePrompts] Starting query function')
      console.log('[usePrompts] Query enabled check:', { 
        hasUserToken: !!userToken, 
        savedOnly, 
        enabled: !!userToken || !savedOnly 
      })
      
      if (savedOnly && !userToken) {
        console.log('[usePrompts] savedOnly=true but no userToken, returning empty array')
        return []
      }

      let query = supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('[usePrompts] Base query created, savedOnly:', savedOnly)

      // If fetching saved prompts, join with saved_prompts
      if (savedOnly && userToken) {
        console.log('[usePrompts] Fetching saved prompts for user:', userToken)
        const { data: savedData, error: savedError } = await supabase
          .from('saved_prompts')
          .select('prompt_id')
          .eq('user_token', userToken)

        console.log('[usePrompts] Saved prompts query result:', { savedData, savedError })

        if (savedError) {
          console.error('[usePrompts] Error fetching saved prompts:', savedError)
          throw savedError
        }

        const promptIds = savedData?.map((s) => s.prompt_id) || []
        console.log('[usePrompts] Found saved prompt IDs:', promptIds)
        
        if (promptIds.length === 0) {
          console.log('[usePrompts] No saved prompts found, returning empty array')
          return []
        }

        query = query.in('id', promptIds)
        console.log('[usePrompts] Filtering prompts by saved IDs')
      } else {
        console.log('[usePrompts] Fetching all prompts (not savedOnly)')
      }

      // Filter by tags (OR logic - any matching tag)
      if (tags.length > 0) {
        console.log('[usePrompts] Filtering by tags:', tags)
        // Use overlap operator for array matching (OR logic)
        query = query.overlaps('tags', tags)
      }

      // Search by name or description
      if (searchQuery) {
        console.log('[usePrompts] Searching with query:', searchQuery)
        query = query.or(
          `generated_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        )
      }

      console.log('[usePrompts] Executing Supabase query...')
      const { data, error } = await query

      console.log('[usePrompts] Query result:', { 
        dataCount: data?.length || 0, 
        data: data,
        error 
      })

      if (error) {
        console.error('[usePrompts] Query error:', error)
        throw error
      }

      // Get saved and upvoted status for each prompt
      if (userToken && data) {
        const promptIds = data.map((p) => p.id)
        console.log('[usePrompts] Fetching saved/upvoted status for prompts:', promptIds)

        const [savedResponse, upvotedResponse] = await Promise.all([
          supabase
            .from('saved_prompts')
            .select('prompt_id')
            .eq('user_token', userToken)
            .in('prompt_id', promptIds),
          supabase
            .from('prompt_upvotes')
            .select('prompt_id')
            .eq('user_token', userToken)
            .in('prompt_id', promptIds),
        ])

        console.log('[usePrompts] Saved/upvoted responses:', { savedResponse, upvotedResponse })

        const savedIds = new Set(savedResponse.data?.map((s) => s.prompt_id) || [])
        const upvotedIds = new Set(upvotedResponse.data?.map((u) => u.prompt_id) || [])

        const promptsWithMetadata: PromptWithMetadata[] = data.map((prompt) => ({
          ...prompt,
          is_saved: savedIds.has(prompt.id),
          is_upvoted: upvotedIds.has(prompt.id),
        }))

        // Sort prompts
        let sortedPrompts = [...promptsWithMetadata]
        if (sort === 'upvoted') {
          sortedPrompts.sort((a, b) => b.upvotes - a.upvotes)
        } else if (sort === 'alphabetical') {
          sortedPrompts.sort((a, b) =>
            (a.generated_name || '').localeCompare(b.generated_name || '')
          )
        }
        // 'recent' is already sorted by created_at DESC

        console.log('[usePrompts] Returning prompts with metadata:', sortedPrompts.length, 'prompts')
        return sortedPrompts
      }

      // Sort prompts
      let sortedPrompts = [...(data || [])]
      if (sort === 'upvoted') {
        sortedPrompts.sort((a, b) => b.upvotes - a.upvotes)
      } else if (sort === 'alphabetical') {
        sortedPrompts.sort((a, b) =>
          (a.generated_name || '').localeCompare(b.generated_name || '')
        )
      }

      const result = sortedPrompts.map((p) => ({ ...p, is_saved: false, is_upvoted: false }))
      console.log('[usePrompts] Returning prompts (no user token):', result.length, 'prompts')
      return result
    },
    enabled: !!userToken || !savedOnly,
    onError: (error) => {
      console.error('[usePrompts] React Query error:', error)
    },
    onSuccess: (data) => {
      console.log('[usePrompts] React Query success:', data?.length, 'prompts')
    },
  })
}

