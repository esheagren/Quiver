import { useState } from 'react'
import { usePrompts } from '@/hooks/usePrompts'
import PromptCard from '@/components/PromptCard'
import FilterSidebar from '@/components/FilterSidebar'
import type { PromptWithMetadata, SortOption } from '@/types'
import type { EducationTag } from '@/lib/constants'
import PromptDetailDrawer from '@/components/PromptDetailDrawer'
import { Compass, AlertTriangle, X } from 'lucide-react'

export default function DiscoverPage() {
  const [selectedTags, setSelectedTags] = useState<EducationTag[]>([])
  const [filterMode, setFilterMode] = useState<'or' | 'and'>('or')
  const [sort, setSort] = useState<SortOption>('most-used')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithMetadata | null>(null)
  const [showBanner, setShowBanner] = useState(true)

  const { data: prompts, isLoading } = usePrompts({
    savedOnly: false,
    tags: selectedTags,
    filterMode,
    sort,
    searchQuery: '',
  })

  const promptsArray: PromptWithMetadata[] = (prompts as PromptWithMetadata[]) || []
  console.log('[DiscoverPage] Render:', { prompts, isLoading, promptsCount: promptsArray.length })

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Fixed */}
      <FilterSidebar
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        filterMode={filterMode}
        onFilterModeChange={setFilterMode}
      />

      {/* Right Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="w-full px-6 py-6">
          {/* Broken GPT Info Banner */}
          {showBanner && (
            <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-amber-900 mb-1">
                    Found a Broken GPT?
                  </h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    If you see a red card or a GPT that won't load, it may not be set to public.
                    If you're the creator, click the warning icon, open the GPT in ChatGPT, go to
                    settings, and make sure it's set to <span className="font-semibold">"Anyone with the link"</span>.
                    Then click the warning icon again to mark it as working.
                  </p>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="h-6 w-6 shrink-0 flex items-center justify-center hover:bg-amber-200 rounded-full transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4 text-amber-700" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#5C606B] mb-1">
              Discover GPTs
            </h1>
            <p className="text-sm text-[#5C606B]/70">
              {promptsArray.length} {promptsArray.length === 1 ? 'GPT' : 'GPTs'} available
            </p>
          </div>

          {/* Feed Section */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50 border border-gray-200"
                />
              ))}
            </div>
          ) : promptsArray.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E8B970]/10 mb-6">
                <Compass className="h-10 w-10 text-[#E8B970]" />
              </div>
              <p className="mb-3 text-2xl font-semibold text-[#5C606B]">
                No GPTs found
              </p>
              <p className="text-lg text-[#5C606B]/70 max-w-md mx-auto">
                Try adjusting your filters or clearing all filters to see more GPTs.
              </p>
            </div>
          )}
        </div>
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

