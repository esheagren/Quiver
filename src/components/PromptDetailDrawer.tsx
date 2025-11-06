import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Bookmark, Copy, ExternalLink, X, Plus } from 'lucide-react'
import type { PromptWithMetadata } from '@/types'
import { formatDate } from '@/lib/utils'
import { useSavePrompt } from '@/hooks/useSavePrompt'
import { useUpdatePrompt } from '@/hooks/useUpdatePrompt'
import { toast } from 'sonner'
import { EDUCATION_TAGS, type EducationTag } from '@/lib/constants'

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
  const updateMutation = useUpdatePrompt()
  
  const [editedName, setEditedName] = useState(prompt.generated_name || '')
  const [editedDescription, setEditedDescription] = useState(prompt.description || '')
  const [editedPromptText, setEditedPromptText] = useState(prompt.prompt_text)
  const [editedTags, setEditedTags] = useState<EducationTag[]>(prompt.tags || [])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<{
    generated_name?: string | null
    description?: string | null
    prompt_text?: string
    tags?: EducationTag[]
  } | null>(null)

  // Reset edited values when prompt changes
  useEffect(() => {
    if (open) {
      setEditedName(prompt.generated_name || '')
      setEditedDescription(prompt.description || '')
      setEditedPromptText(prompt.prompt_text)
      setEditedTags(prompt.tags || [])
      setPendingChanges(null)
    }
  }, [prompt, open])

  const hasChanges = () => {
    return (
      editedName !== (prompt.generated_name || '') ||
      editedDescription !== (prompt.description || '') ||
      editedPromptText !== prompt.prompt_text ||
      JSON.stringify(editedTags.sort()) !== JSON.stringify([...prompt.tags].sort())
    )
  }

  const handleSaveBookmark = () => {
    saveMutation.mutate({
      promptId: prompt.id,
      isSaved: prompt.is_saved || false,
    })
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(editedPromptText)
    toast.success('Copied to clipboard!')
  }

  const handleOpenCustomGPT = () => {
    window.open(prompt.url, '_blank')
  }

  const handleSaveChanges = () => {
    if (!hasChanges()) return

    const changes: {
      generated_name?: string | null
      description?: string | null
      prompt_text?: string
      tags?: EducationTag[]
    } = {}

    if (editedName !== (prompt.generated_name || '')) {
      changes.generated_name = editedName || null
    }
    if (editedDescription !== (prompt.description || '')) {
      changes.description = editedDescription || null
    }
    if (editedPromptText !== prompt.prompt_text) {
      changes.prompt_text = editedPromptText
    }
    if (JSON.stringify(editedTags.sort()) !== JSON.stringify([...prompt.tags].sort())) {
      changes.tags = editedTags
    }

    setPendingChanges(changes)
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = async () => {
    if (!pendingChanges) return

    try {
      await updateMutation.mutateAsync({
        id: prompt.id,
        ...pendingChanges,
      })
      setShowConfirmDialog(false)
      setPendingChanges(null)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleRemoveTag = (tagToRemove: EducationTag) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove))
  }

  const availableTags = EDUCATION_TAGS.filter(tag => !editedTags.includes(tag))

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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-4xl" hideCloseButton>
          <SheetHeader>
            <div className="flex items-center justify-end gap-2 mb-4">
              <button
                onClick={handleSaveBookmark}
                className="h-9 w-9 shrink-0 flex items-center justify-center hover:bg-[#E8B970]/20 transition-all duration-200 rounded-full p-0 border-0 bg-transparent cursor-pointer"
                aria-label={prompt.is_saved ? 'Unsave prompt' : 'Save prompt'}
              >
                <Bookmark
                  className={`h-5 w-5 transition-all ${
                    prompt.is_saved 
                      ? 'fill-[#E8B970] text-[#E8B970]' 
                      : 'text-[#5C606B] hover:text-[#E8B970]'
                  }`}
                />
              </button>
              <button
                onClick={handleOpenCustomGPT}
                className="h-9 w-9 shrink-0 flex items-center justify-center bg-[#E8B970] hover:bg-[#E8B970]/90 transition-all duration-200 rounded-full p-0 border-0 cursor-pointer"
                aria-label="Open CustomGPT"
              >
                <ExternalLink className="h-5 w-5 text-white" />
              </button>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-[#5C606B]">
                Title
              </Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-semibold text-[#5C606B] border-2 border-[#D3D6DB] focus:border-[#E8B970] rounded-xl"
                placeholder="Enter title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-[#5C606B]">
                Description
              </Label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-[#5C606B] border-2 border-[#D3D6DB] focus:border-[#E8B970] rounded-xl resize-none"
                placeholder="Enter description..."
                rows={3}
              />
            </div>
            {/* Prompt Text Box with Copy Button */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="prompt_text" className="text-sm font-semibold text-[#5C606B]">
                  Prompt Text
                </Label>
                <Button onClick={handleCopyPrompt} variant="outline" className="gap-2 h-8">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
              <Textarea
                id="prompt_text"
                value={editedPromptText}
                onChange={(e) => setEditedPromptText(e.target.value)}
                className="border-2 border-[#D3D6DB] focus:border-[#E8B970] rounded-xl resize-none font-mono text-sm"
                rows={12}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#5C606B]">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {editedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="orange"
                    className="text-xs px-2.5 py-1 font-semibold rounded-full bg-[#E8B970] text-white border-0 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {availableTags.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-7 w-7 flex items-center justify-center rounded-full bg-[#E8B970] hover:bg-[#E8B970]/90 transition-all border-0 cursor-pointer">
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <DropdownMenuItem
                          key={tag}
                          onClick={() => {
                            setEditedTags([...editedTags, tag])
                          }}
                          className="cursor-pointer"
                        >
                          {tag}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-[#D3D6DB]">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#5C606B] mb-1">Users</p>
                  <p className="text-2xl font-bold text-[#5C606B]">{prompt.upvotes || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5C606B] mb-1">Uses</p>
                  <p className="text-2xl font-bold text-[#5C606B]">{prompt.uses || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5C606B] mb-1">Saved by</p>
                  <p className="text-2xl font-bold text-[#5C606B]">{prompt.saved_count || 0}</p>
                </div>
              </div>
            </div>

            {/* Save Changes Button */}
            {hasChanges() && (
              <div className="pt-4 border-t border-[#D3D6DB]">
                <Button
                  onClick={handleSaveChanges}
                  variant="default"
                  className="w-full rounded-xl"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#5C606B]">Confirm Changes</DialogTitle>
            <DialogDescription className="text-[#5C606B]">
              Are you sure you want to save these changes? The prompt will be updated for all users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false)
                setPendingChanges(null)
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              variant="default"
              className="rounded-xl"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Confirm Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

