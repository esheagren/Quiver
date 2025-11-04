import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Bookmark, Heart } from 'lucide-react'
import type { PromptWithMetadata } from '@/types'
import { truncateText } from '@/lib/utils'
import { useSavePrompt } from '@/hooks/useSavePrompt'
import { useUpvotePrompt } from '@/hooks/useUpvotePrompt'

interface PromptCardProps {
  prompt: PromptWithMetadata
  onViewDetails: (prompt: PromptWithMetadata) => void
}

export default function PromptCard({ prompt, onViewDetails }: PromptCardProps) {
  const saveMutation = useSavePrompt()
  const upvoteMutation = useUpvotePrompt()

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    saveMutation.mutate({
      promptId: prompt.id,
      isSaved: prompt.is_saved || false,
    })
  }

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation()
    upvoteMutation.mutate({
      promptId: prompt.id,
      isUpvoted: prompt.is_upvoted || false,
    })
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-gray-200 hover:border-orange-300 bg-white overflow-hidden"
      onClick={() => onViewDetails(prompt)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-transparent to-red-50/0 group-hover:from-orange-50/50 group-hover:to-red-50/50 transition-all duration-300" />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-orange-600 transition-colors">
            {prompt.generated_name || 'Untitled Prompt'}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="h-9 w-9 shrink-0 hover:bg-orange-100 transition-all rounded-full"
            aria-label={prompt.is_saved ? 'Unsave prompt' : 'Save prompt'}
          >
            <Bookmark
              className={`h-5 w-5 transition-all ${
                prompt.is_saved 
                  ? 'fill-orange-600 text-orange-600 scale-110' 
                  : 'text-gray-400 group-hover:text-orange-600'
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-5 relative">
        <p className="line-clamp-3 text-sm text-gray-600 leading-relaxed">
          {truncateText(prompt.description || '', 150)}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={tag} 
              variant={index % 2 === 0 ? 'orange' : 'amber'}
              className="text-xs px-3 py-1 font-medium"
            >
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-3 py-1 border-gray-300 text-gray-600">
              +{prompt.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUpvote}
            className={`gap-2 transition-all hover:bg-orange-50 rounded-full ${
              prompt.is_upvoted 
                ? 'text-orange-600' 
                : 'text-gray-500 hover:text-orange-600'
            }`}
            aria-label={`Upvote prompt (${prompt.upvotes} upvotes)`}
          >
            {prompt.is_upvoted ? (
              <Heart className="h-5 w-5 fill-orange-600 text-orange-600 transition-all scale-110" />
            ) : (
              <Heart className="h-5 w-5 transition-all group-hover:scale-110" />
            )}
            <span className="font-semibold">{prompt.upvotes}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

