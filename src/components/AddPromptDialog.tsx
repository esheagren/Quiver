import { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './ui/sheet'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useAddPrompt } from '@/hooks/useAddPrompt'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { PromptWithMetadata } from '@/types'

const addPromptSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  prompt_text: z.string().min(10, 'Prompt text must be at least 10 characters'),
  isPublic: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that you have made this GPT public',
  }),
})

type AddPromptFormData = z.infer<typeof addPromptSchema>

interface AddPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPromptAdded?: (prompt: PromptWithMetadata) => void
}

export default function AddPromptDialog({ open, onOpenChange, onPromptAdded }: AddPromptDialogProps) {
  const addPromptMutation = useAddPrompt()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPromptFormData>({
    resolver: zodResolver(addPromptSchema),
    defaultValues: {
      isPublic: false,
    },
  })

  const onSubmit = async (data: AddPromptFormData) => {
    try {
      const prompt = await addPromptMutation.mutateAsync(data)
      reset({ isPublic: false })
      onOpenChange(false)
      
      // Show success toast with optional "View prompt" action
      if (prompt) {
        const toastOptions: Parameters<typeof toast.success>[1] = {
          duration: 5000,
        }
        
        // Only show "View prompt" action if callback is provided
        if (onPromptAdded) {
          toastOptions.action = {
            label: 'View prompt',
            onClick: () => {
              onPromptAdded(prompt as PromptWithMetadata)
            },
          }
        }
        
        toast.success('Prompt added successfully!', toastOptions)
      }
    } catch {
      // Error handled by mutation
    }
  }

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [open, onOpenChange])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg" hideCloseButton>
        <SheetHeader>
          <SheetTitle className="text-2xl text-[#5C606B]">
            Add New Prompt
          </SheetTitle>
          <SheetDescription className="text-[#5C606B]">
            Enter the CustomGPT URL and prompt text. We'll generate metadata automatically.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-semibold text-[#5C606B]">
              CustomGPT URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://chatgpt.com/g/abc123..."
              className="border-2 border-[#D3D6DB] focus:border-[#E8B970] rounded-xl"
              {...register('url')}
            />
            <p className="text-xs text-[#5C606B]/70 mt-1">
              Example: https://chatgpt.com/g/abc123def456
            </p>
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt_text" className="text-sm font-semibold text-[#5C606B]">
              Prompt Text
            </Label>
            <Textarea
              id="prompt_text"
              placeholder="Paste the full prompt text from your CustomGPT here. This will be used to generate metadata like tags, description, and name..."
              rows={12}
              className="border-2 border-[#D3D6DB] focus:border-[#E8B970] rounded-xl resize-none"
              {...register('prompt_text')}
            />
            {errors.prompt_text && (
              <p className="text-sm text-red-500">
                {errors.prompt_text.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                className="h-5 w-5 rounded border-2 border-[#D3D6DB] focus:border-[#E8B970] focus:ring-2 focus:ring-[#E8B970]/20 cursor-pointer accent-[#E8B970]"
                {...register('isPublic')}
              />
              <Label htmlFor="isPublic" className="text-sm font-medium text-[#5C606B] cursor-pointer">
                I have made this GPT public
              </Label>
            </div>
            {errors.isPublic && (
              <p className="text-sm text-red-500 ml-8">
                {errors.isPublic.message}
              </p>
            )}
          </div>

          <SheetFooter className="flex-row gap-3 sm:justify-end">
            <Button
              type="submit"
              variant="default"
              disabled={addPromptMutation.isPending}
              className="rounded-xl w-full sm:w-auto"
            >
              {addPromptMutation.isPending ? 'Generating...' : 'Add'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

