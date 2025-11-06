import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrompts } from '@/hooks/usePrompts'
import PromptCard from '@/components/PromptCard'
import FilterBar from '@/components/FilterBar'
import type { PromptWithMetadata, SortOption } from '@/types'
import type { EducationTag } from '@/lib/constants'
import PromptDetailDrawer from '@/components/PromptDetailDrawer'
import { Button } from '@/components/ui/button'
import quiverIcon from '@/assets/images/quiver.png'

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedTags, setSelectedTags] = useState<EducationTag[]>([])
  const [filterMode, setFilterMode] = useState<'or' | 'and'>('or')
  const [sort] = useState<SortOption>('recent')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithMetadata | null>(null)

  const { data: prompts, isLoading } = usePrompts({
    savedOnly: true,
    tags: selectedTags,
    filterMode,
    sort,
    searchQuery: '',
  })

  const promptsArray: PromptWithMetadata[] = (prompts as PromptWithMetadata[]) || []
  console.log('[HomePage] Render:', { prompts, isLoading, promptsCount: promptsArray.length, savedOnly: true })

  const hasPrompts = promptsArray.length > 0

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      {hasPrompts && (
        <FilterBar
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          filterMode={filterMode}
          onFilterModeChange={setFilterMode}
        />
      )}

      {/* Content Section */}
      <div className="bg-gray-900 rounded-2xl px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50 border border-gray-200"
              />
            ))}
          </div>
        ) : hasPrompts ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {promptsArray.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onViewDetails={setSelectedPrompt}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#E8B970]/10 mb-6">
              <img src={quiverIcon} alt="My Quiver" className="h-14 w-14 object-contain" />
            </div>
            <p className="mb-3 text-2xl font-semibold text-white">
              Your Quiver is empty
            </p>
            <p className="mb-6 text-lg text-gray-400 max-w-md mx-auto">
              Start building your collection by discovering prompts from the community.
            </p>
            <Button
              onClick={() => navigate('/discover')}
              variant="default"
              className="rounded-xl px-8 py-6 text-base"
            >
              Discover GPTs
            </Button>
          </div>
        )}
      </div>

      {selectedPrompt && (
        <PromptDetailDrawer
          prompt={selectedPrompt}
          open={!!selectedPrompt}
          onOpenChange={(open) => !open && setSelectedPrompt(null)}
        />
      )}
    </div>
  )
}

