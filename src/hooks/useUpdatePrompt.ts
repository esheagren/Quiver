import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { EducationTag } from '@/lib/constants'

interface UpdatePromptData {
  id: string
  generated_name?: string | null
  description?: string | null
  prompt_text?: string
  tags?: EducationTag[]
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdatePromptData) => {
      const { id, ...updateData } = data
      
      const { data: updatedPrompt, error } = await supabase
        .from('prompts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedPrompt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      toast.success('Prompt updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update prompt')
    },
  })
}


