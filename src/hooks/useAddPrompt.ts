import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUserToken } from '@/hooks/useUserToken'
import { toast } from 'sonner'
import type { AddPromptData, PromptMetadata } from '@/types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export function useAddPrompt() {
  const queryClient = useQueryClient()
  const userToken = useUserToken()

  return useMutation({
    mutationFn: async (data: AddPromptData) => {
      if (!userToken) throw new Error('User token not available')

      // Call Edge Function to generate metadata
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-prompt-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          url: data.url,
          prompt_text: data.prompt_text,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to generate metadata')
      }

      const metadata: PromptMetadata = await response.json()

      // Insert prompt into database
      const { data: prompt, error: promptError } = await supabase
        .from('prompts')
        .insert({
          url: data.url,
          prompt_text: data.prompt_text,
          generated_name: metadata.generated_name,
          description: metadata.description,
          tags: metadata.tags,
          user_token: userToken,
        })
        .select()
        .single()

      if (promptError) throw promptError

      // Auto-save to user's collection
      const { error: saveError } = await supabase
        .from('saved_prompts')
        .insert({
          user_token: userToken,
          prompt_id: prompt.id,
        })

      if (saveError) throw saveError

      // Return prompt with metadata flags
      return {
        ...prompt,
        is_saved: true,
        is_upvoted: false,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      // Toast is handled in AddPromptDialog with action button
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add prompt')
    },
  })
}

