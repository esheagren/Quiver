import { Badge } from './ui/badge'
import { Bookmark, ExternalLink, AlertTriangle } from 'lucide-react'
import type { PromptWithMetadata } from '@/types'
import { truncateText } from '@/lib/utils'
import { useSavePrompt } from '@/hooks/useSavePrompt'
import { useToggleBroken } from '@/hooks/useToggleBroken'

interface PromptCardProps {
  prompt: PromptWithMetadata
  onViewDetails: (prompt: PromptWithMetadata) => void
}

export default function PromptCard({ prompt, onViewDetails }: PromptCardProps) {
  const saveMutation = useSavePrompt()
  const toggleBrokenMutation = useToggleBroken()

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    saveMutation.mutate({
      promptId: prompt.id,
      isSaved: prompt.is_saved || false,
    })
  }

  const handleOpenCustomGPT = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(prompt.url, '_blank')
  }

  const handleToggleBroken = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBrokenMutation.mutate({
      promptId: prompt.id,
      isBroken: prompt.is_broken || false,
    })
  }

  return (
    <div
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg rounded-xl p-4 overflow-hidden ${
        prompt.is_broken
          ? 'bg-red-50 border-2 border-red-300'
          : 'bg-white border border-[#D3D6DB]'
      }`}
      onClick={() => onViewDetails(prompt)}
    >
      {/* Header with bookmark and title */}
      <div className="flex items-start gap-2 mb-2">
        <button
          onClick={handleSave}
          className="h-7 w-7 shrink-0 flex items-center justify-center hover:bg-[#E8B970]/20 transition-all duration-200 rounded-full p-0 border-0 bg-transparent cursor-pointer"
          aria-label={prompt.is_saved ? 'Unsave prompt' : 'Save prompt'}
        >
          <Bookmark
            className={`h-4 w-4 transition-all ${
              prompt.is_saved
                ? 'fill-[#E8B970] text-[#E8B970]'
                : 'text-[#5C606B] group-hover:text-[#E8B970]'
            }`}
          />
        </button>
        <h2 className="text-base font-bold leading-tight text-[#5C606B] flex-1 line-clamp-2">
          {prompt.generated_name || 'Untitled Prompt'}
        </h2>
        <button
          onClick={handleToggleBroken}
          className={`h-7 w-7 shrink-0 flex items-center justify-center transition-all duration-200 rounded-full p-0 border-0 cursor-pointer ${
            prompt.is_broken
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-transparent hover:bg-red-100'
          }`}
          aria-label={prompt.is_broken ? 'Mark as working' : 'Mark as broken'}
          title={prompt.is_broken ? 'Click to mark as working' : 'Click if GPT is not accessible'}
        >
          <AlertTriangle
            className={`h-4 w-4 transition-all ${
              prompt.is_broken ? 'text-white' : 'text-red-500'
            }`}
          />
        </button>
        <button
          onClick={handleOpenCustomGPT}
          className="h-7 w-7 shrink-0 flex items-center justify-center hover:bg-[#E8B970]/20 transition-all duration-200 rounded-full p-0 border-0 bg-transparent cursor-pointer"
          aria-label="Open CustomGPT"
        >
          <ExternalLink className="h-4 w-4 text-[#5C606B] group-hover:text-[#E8B970] transition-all" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-[#5C606B]/80 leading-snug mb-3 line-clamp-2">
        {truncateText(prompt.description || '', 120)}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {prompt.tags.slice(0, 2).map((tag) => (
          <Badge
            key={tag}
            variant="orange"
            className="text-xs px-2 py-0.5 font-semibold rounded-full bg-[#E8B970] text-white border-0"
          >
            {tag}
          </Badge>
        ))}
        {prompt.tags.length > 2 && (
          <Badge variant="outline" className="text-xs px-2 py-0.5 border-[#5C606B] text-[#5C606B] rounded-full">
            +{prompt.tags.length - 2}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="pt-2 border-t border-[#D3D6DB] flex items-center gap-3 text-xs text-[#5C606B]">
        <span>
          <span className="font-semibold">{prompt.upvotes || 0}</span> users
        </span>
        <span>
          <span className="font-semibold">{prompt.uses || 0}</span> uses
        </span>
        <span className="ml-auto text-[#5C606B]/60">
          Saved {prompt.saved_count || 0}x
        </span>
      </div>
    </div>
  )
}

