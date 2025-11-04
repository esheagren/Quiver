import { useState } from 'react'
import { usePrompts } from '@/hooks/usePrompts'
import PromptCard from '@/components/PromptCard'
import FilterBar from '@/components/FilterBar'
import type { PromptWithMetadata, SortOption } from '@/types'
import type { EducationTag } from '@/lib/constants'
import PromptDetailDrawer from '@/components/PromptDetailDrawer'
import { Compass } from 'lucide-react'

export default function DiscoverPage() {
  const [selectedTags, setSelectedTags] = useState<EducationTag[]>([])
  const [sort, setSort] = useState<SortOption>('recent')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithMetadata | null>(null)

  const { data: prompts, isLoading } = usePrompts({
    savedOnly: false,
    tags: selectedTags,
    sort,
  })

  const promptsArray: PromptWithMetadata[] = (prompts as PromptWithMetadata[]) || []
  console.log('[DiscoverPage] Render:', { prompts, isLoading, promptsCount: promptsArray.length })

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-3 text-foreground">Discover Prompts</h1>
        <p className="text-lg text-muted-foreground font-medium">
          Browse prompts shared by the community
        </p>
      </div>

      <FilterBar
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        sort={sort}
        onSortChange={setSort}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-lg border-2 border-border bg-gradient-to-br from-card via-card to-muted/30"
            />
          ))}
        </div>
      ) : promptsArray.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
            <Compass className="h-10 w-10 text-accent" />
          </div>
          <p className="mb-3 text-2xl font-semibold text-foreground">
            No prompts found.
          </p>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Try adjusting your filters to discover more prompts.
          </p>
        </div>
      )}

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

