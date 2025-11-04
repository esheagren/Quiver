import { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Bookmark, Heart, Copy, ExternalLink } from 'lucide-react'
import type { PromptWithMetadata } from '@/types'
import { formatDate } from '@/lib/utils'
import { useSavePrompt } from '@/hooks/useSavePrompt'
import { useUpvotePrompt } from '@/hooks/useUpvotePrompt'
import { toast } from 'sonner'

interface PromptDetailDrawerProps {
  prompt: PromptWithMetadata
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PromptDetailDrawer({
  prompt,
  open,
  onOpenChange,
}: PromptDetailDrawerProps) {
  const saveMutation = useSavePrompt()
  const upvoteMutation = useUpvotePrompt()

  const handleSave = () => {
    saveMutation.mutate({
      promptId: prompt.id,
      isSaved: prompt.is_saved || false,
    })
  }

  const handleUpvote = () => {
    upvoteMutation.mutate({
      promptId: prompt.id,
      isUpvoted: prompt.is_upvoted || false,
    })
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.prompt_text)
    toast.success('Copied to clipboard!')
  }

  const handleOpenCustomGPT = () => {
    window.open(prompt.url, '_blank')
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
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {prompt.generated_name || 'Untitled Prompt'}
          </SheetTitle>
          <SheetDescription>
            {prompt.description || 'No description available.'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Tags */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} variant="outline" className="gap-2">
              <Bookmark
                className={`h-4 w-4 ${
                  prompt.is_saved ? 'fill-accent text-accent' : ''
                }`}
              />
              {prompt.is_saved ? 'Saved' : 'Save'}
            </Button>
            <Button onClick={handleUpvote} variant="outline" className="gap-2">
              {prompt.is_upvoted ? (
                <Heart className="h-4 w-4 fill-accent text-accent" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              {prompt.upvotes} {prompt.upvotes === 1 ? 'Upvote' : 'Upvotes'}
            </Button>
            <Button onClick={handleCopyPrompt} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Prompt
            </Button>
            <Button onClick={handleOpenCustomGPT} variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open CustomGPT
            </Button>
          </div>

          {/* URL */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">CustomGPT URL</h3>
            <a
              href={prompt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              {prompt.url}
            </a>
          </div>

          {/* Prompt Text */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Prompt Text</h3>
            <pre className="max-h-96 overflow-auto rounded-md border bg-muted p-4 text-sm">
              {prompt.prompt_text}
            </pre>
          </div>

          {/* Created Date */}
          <div className="text-sm text-muted-foreground">
            Created {formatDate(prompt.created_at)}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

