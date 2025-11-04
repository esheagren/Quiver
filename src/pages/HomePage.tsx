import { useState } from 'react'
import { usePrompts } from '@/hooks/usePrompts'
import PromptCard from '@/components/PromptCard'
import FilterBar from '@/components/FilterBar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PromptWithMetadata, SortOption, EducationTag } from '@/types'
import PromptDetailDrawer from '@/components/PromptDetailDrawer'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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
      {/* Streamlined Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            My Quiver
          </h1>
          <p className="text-base text-gray-600">
            {prompts?.length || 0} saved prompt{prompts?.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {!hasPrompts && (
          <Link to="/discover">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-200 font-semibold group"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Discover Prompts
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
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
      ) : (
        <div className="py-24 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-orange-200/40 rounded-full blur-2xl" />
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-200/50">
                <Sparkles className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Your prompt bank is empty
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Start building your collection by discovering prompts created by educators like you.
              </p>
            </div>

            <Link to="/discover">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 text-base px-8 py-6 h-auto group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Explore Prompt Library
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
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

