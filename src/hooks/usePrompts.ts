import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PromptWithMetadata, SortOption, EducationTag } from '@/types'
import { useUserToken } from '@/hooks/useUserToken'

type FilterMode = 'or' | 'and'

interface UsePromptsOptions {
  savedOnly?: boolean
  tags?: EducationTag[]
  filterMode?: FilterMode
  sort?: SortOption
  searchQuery?: string
}

export function usePrompts(options: UsePromptsOptions = {}) {
  const { savedOnly = false, tags = [], filterMode = 'or', sort = 'recent', searchQuery = '' } = options
  const userToken = useUserToken()

  console.log('[usePrompts] Hook called with:', {
    savedOnly,
    tags,
    filterMode,
    sort,
    searchQuery,
    userToken,
  })

  return useQuery({
    queryKey: ['prompts', savedOnly, tags, filterMode, sort, searchQuery, userToken],
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

      // Filter by tags (AND or OR logic)
      if (tags.length > 0) {
        console.log('[usePrompts] Filtering by tags:', tags, 'mode:', filterMode)
        if (filterMode === 'and') {
          // AND logic: prompt must have ALL selected tags
          // For AND logic, we'll filter in JavaScript after fetching
          // First get prompts that have at least one of the tags (to reduce dataset)
          query = query.overlaps('tags', tags)
        } else {
          // OR logic: prompt can have ANY of the selected tags
          // Use overlap operator for array matching
          query = query.overlaps('tags', tags)
        }
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

      // Apply AND logic filtering if needed (must be done after fetching)
      let filteredData = data || []
      if (filterMode === 'and' && tags.length > 0 && filteredData.length > 0) {
        console.log('[usePrompts] Applying AND logic filter to', filteredData.length, 'prompts')
        filteredData = filteredData.filter((prompt) => {
          const promptTags = prompt.tags || []
          // Check if prompt has ALL selected tags
          return tags.every((tag) => promptTags.includes(tag))
        })
        console.log('[usePrompts] After AND filter:', filteredData.length, 'prompts remain')
      }

      // Get saved and upvoted status for each prompt, and saved counts
      if (userToken && filteredData) {
        const promptIds = filteredData.map((p) => p.id)
        console.log('[usePrompts] Fetching saved/upvoted status for prompts:', promptIds)

        const [savedResponse, upvotedResponse, savedCountsResponse] = await Promise.all([
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
          supabase
            .from('saved_prompts')
            .select('prompt_id')
            .in('prompt_id', promptIds),
        ])

        console.log('[usePrompts] Saved/upvoted responses:', { savedResponse, upvotedResponse, savedCountsResponse })

        const savedIds = new Set(savedResponse.data?.map((s) => s.prompt_id) || [])
        const upvotedIds = new Set(upvotedResponse.data?.map((u) => u.prompt_id) || [])
        
        // Count saved occurrences for each prompt
        const savedCountsMap = new Map<string, number>()
        savedCountsResponse.data?.forEach((s) => {
          const count = savedCountsMap.get(s.prompt_id) || 0
          savedCountsMap.set(s.prompt_id, count + 1)
        })

        const promptsWithMetadata: PromptWithMetadata[] = filteredData.map((prompt) => ({
          ...prompt,
          is_saved: savedIds.has(prompt.id),
          is_upvoted: upvotedIds.has(prompt.id),
          saved_count: savedCountsMap.get(prompt.id) || 0,
        }))

        // Sort prompts
        let sortedPrompts = [...promptsWithMetadata]
        if (sort === 'upvoted') {
          sortedPrompts.sort((a, b) => b.upvotes - a.upvotes)
        } else if (sort === 'most-used') {
          sortedPrompts.sort((a, b) => b.uses - a.uses)
        } else if (sort === 'alphabetical') {
          sortedPrompts.sort((a, b) =>
            (a.generated_name || '').localeCompare(b.generated_name || '')
          )
        }
        // 'recent' is already sorted by created_at DESC

        console.log('[usePrompts] Returning prompts with metadata:', sortedPrompts.length, 'prompts')
        return sortedPrompts
      }

      // Get saved counts for prompts (even without user token)
      const promptIds = filteredData.map((p) => p.id)
      const { data: savedCountsData } = await supabase
        .from('saved_prompts')
        .select('prompt_id')
        .in('prompt_id', promptIds)
      
      const savedCountsMap = new Map<string, number>()
      savedCountsData?.forEach((s) => {
        const count = savedCountsMap.get(s.prompt_id) || 0
        savedCountsMap.set(s.prompt_id, count + 1)
      })

      // Sort prompts
      let sortedPrompts = [...filteredData]
      if (sort === 'upvoted') {
        sortedPrompts.sort((a, b) => b.upvotes - a.upvotes)
      } else if (sort === 'most-used') {
        sortedPrompts.sort((a, b) => b.uses - a.uses)
      } else if (sort === 'alphabetical') {
        sortedPrompts.sort((a, b) =>
          (a.generated_name || '').localeCompare(b.generated_name || '')
        )
      }

      const result = sortedPrompts.map((p) => ({ 
        ...p, 
        is_saved: false, 
        is_upvoted: false,
        saved_count: savedCountsMap.get(p.id) || 0,
      }))
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

