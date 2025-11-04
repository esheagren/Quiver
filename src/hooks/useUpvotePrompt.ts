import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUserToken } from '@/hooks/useUserToken'
import { toast } from 'sonner'

export function useUpvotePrompt() {
  const queryClient = useQueryClient()
  const userToken = useUserToken()

  return useMutation({
    mutationFn: async ({ promptId, isUpvoted }: { promptId: string; isUpvoted: boolean }) => {
      if (!userToken) throw new Error('User token not available')

      if (isUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('prompt_upvotes')
          .delete()
          .eq('user_token', userToken)
          .eq('prompt_id', promptId)

        if (error) throw error
        return { promptId, isUpvoted: false }
      } else {
        // Add upvote
        const { error } = await supabase
          .from('prompt_upvotes')
          .insert({
            user_token: userToken,
            prompt_id: promptId,
          })

        if (error) throw error
        return { promptId, isUpvoted: true }
      }
    },
    onMutate: async ({ promptId, isUpvoted }) => {
      await queryClient.cancelQueries({ queryKey: ['prompts'] })

      const previousPrompts = queryClient.getQueryData(['prompts'])

      // Optimistically update
      queryClient.setQueriesData<unknown[]>({ queryKey: ['prompts'] }, (old) => {
        if (!old) return old
        return old.map((prompt: any) =>
          prompt.id === promptId
            ? {
                ...prompt,
                is_upvoted: !isUpvoted,
                upvotes: isUpvoted ? prompt.upvotes - 1 : prompt.upvotes + 1,
              }
            : prompt
        )
      })

      return { previousPrompts }
    },
    onError: (err, variables, context) => {
      if (context?.previousPrompts) {
        queryClient.setQueryData(['prompts'], context.previousPrompts)
      }
      toast.error('Failed to update upvote')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
    },
  })
}



