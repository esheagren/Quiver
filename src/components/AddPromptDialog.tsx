import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useAddPrompt } from '@/hooks/useAddPrompt'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const addPromptSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  prompt_text: z.string().min(10, 'Prompt text must be at least 10 characters'),
})

type AddPromptFormData = z.infer<typeof addPromptSchema>

interface AddPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddPromptDialog({ open, onOpenChange }: AddPromptDialogProps) {
  const addPromptMutation = useAddPrompt()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPromptFormData>({
    resolver: zodResolver(addPromptSchema),
  })

  const onSubmit = async (data: AddPromptFormData) => {
    try {
      await addPromptMutation.mutateAsync(data)
      reset()
      onOpenChange(false)
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Prompt</DialogTitle>
          <DialogDescription>
            Enter the CustomGPT URL and prompt text. We'll generate metadata
            automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">CustomGPT URL</Label>
              <Input
                id="url"
                placeholder="https://chatgpt.com/g/..."
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt_text">Prompt Text</Label>
              <Textarea
                id="prompt_text"
                placeholder="Enter the prompt text here..."
                rows={8}
                {...register('prompt_text')}
              />
              {errors.prompt_text && (
                <p className="text-sm text-destructive">
                  {errors.prompt_text.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addPromptMutation.isPending}>
              {addPromptMutation.isPending ? 'Generating...' : 'Generate & Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

