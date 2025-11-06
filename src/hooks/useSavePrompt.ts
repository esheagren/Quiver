import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUserToken } from '@/hooks/useUserToken'
import { toast } from 'sonner'

export function useSavePrompt() {
  const queryClient = useQueryClient()
  const userToken = useUserToken()

  return useMutation({
    mutationFn: async ({ promptId, isSaved }: { promptId: string; isSaved: boolean }) => {
      if (!userToken) throw new Error('User token not available')

      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_prompts')
          .delete()
          .eq('user_token', userToken)
          .eq('prompt_id', promptId)

        if (error) throw error
        return { promptId, isSaved: false }
      } else {
        // Save
        const { error } = await supabase
          .from('saved_prompts')
          .insert({
            user_token: userToken,
            prompt_id: promptId,
          })

        if (error) throw error
        return { promptId, isSaved: true }
      }
    },
    onMutate: async ({ promptId, isSaved }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['prompts'] })

      // Snapshot previous value
      const previousPrompts = queryClient.getQueryData(['prompts'])

      // Optimistically update
      queryClient.setQueriesData<unknown[]>({ queryKey: ['prompts'] }, (old) => {
        if (!old) return old
        return old.map((prompt: any) =>
          prompt.id === promptId ? { ...prompt, is_saved: !isSaved } : prompt
        )
      })

      return { previousPrompts }
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousPrompts) {
        queryClient.setQueryData(['prompts'], context.previousPrompts)
      }
      toast.error('Failed to update saved status')
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      toast.success(data.isSaved ? 'Saved to your bank!' : 'Removed from bank')
    },
  })
}




