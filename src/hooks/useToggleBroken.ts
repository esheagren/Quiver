import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface ToggleBrokenParams {
  promptId: string
  isBroken: boolean
}

export function useToggleBroken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ promptId, isBroken }: ToggleBrokenParams) => {
      const { error } = await supabase
        .from('prompts')
        .update({ is_broken: !isBroken })
        .eq('id', promptId)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      // Invalidate all prompt queries to refetch with updated broken status
      queryClient.invalidateQueries({ queryKey: ['prompts'] })

      if (!variables.isBroken) {
        toast.success('GPT marked as broken')
      } else {
        toast.success('GPT marked as working')
      }
    },
    onError: (error) => {
      console.error('Error toggling broken status:', error)
      toast.error('Failed to update GPT status')
    },
  })
}
