import { useState } from 'react'
import { usePrompts } from '@/hooks/usePrompts'
import PromptCard from '@/components/PromptCard'
import FilterBar from '@/components/FilterBar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PromptWithMetadata, SortOption, EducationTag } from '@/types'
import PromptDetailDrawer from '@/components/PromptDetailDrawer'
import { Search } from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<EducationTag[]>([])
  const [sort, setSort] = useState<SortOption>('recent')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithMetadata | null>(null)

  const { data: prompts, isLoading } = usePrompts({
    savedOnly: true,
    tags: selectedTags,
    sort,
    searchQuery,
  })

  console.log('[HomePage] Render:', { prompts, isLoading, promptsCount: prompts?.length, savedOnly: true })

  const hasPrompts = prompts && prompts.length > 0

  return (
    <div className="space-y-8">
      {/* Minimal Header */}
      <div>
        <p className="text-sm text-gray-500">
          {prompts?.length || 0} saved prompt{prompts?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & Filter Section */}
      {hasPrompts && (
        <div className="space-y-6">
          <div className="relative max-w-3xl">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search your saved prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 text-base border-2 border-gray-200 focus-visible:border-orange-400 rounded-2xl transition-all shadow-sm hover:shadow-md focus-visible:shadow-md bg-white"
            />
          </div>

          <FilterBar
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            sort={sort}
            onSortChange={setSort}
          />
        </div>
      )}

      {/* Content Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50 border border-gray-200"
            />
          ))}
        </div>
      ) : hasPrompts ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onViewDetails={setSelectedPrompt}
            />
          ))}
        </div>
      ) : null}

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

