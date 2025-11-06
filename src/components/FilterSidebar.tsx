import { useState } from 'react'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { TAG_CATEGORIES, type EducationTag, type TagCategory } from '@/lib/constants'
import { Badge } from './ui/badge'

interface FilterSidebarProps {
  selectedTags: EducationTag[]
  onTagsChange: (tags: EducationTag[]) => void
  filterMode: 'or' | 'and'
  onFilterModeChange?: (mode: 'or' | 'and') => void
}

export default function FilterSidebar({
  selectedTags,
  onTagsChange,
  filterMode,
  onFilterModeChange,
}: FilterSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<TagCategory>>(
    new Set()
  )

  const toggleCategory = (category: TagCategory) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleTag = (tag: EducationTag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearAllTags = () => {
    onTagsChange([])
  }

  const getCategoryTagCount = (category: TagCategory) => {
    const categoryTags = TAG_CATEGORIES[category] as readonly EducationTag[]
    const categoryTagSet = new Set<EducationTag>(categoryTags)
    return selectedTags.filter((tag) => categoryTagSet.has(tag)).length
  }

  return (
    <div className="w-64 bg-white border-r border-[#D3D6DB] h-screen overflow-y-auto sticky top-0">
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#5C606B] mb-0.5">Filter GPTs</h2>
          <p className="text-xs text-[#5C606B]/70">
            Browse by category
          </p>
        </div>

        {/* Selected Tags Summary */}
        {selectedTags.length > 0 && (
          <div className="mb-3 p-2.5 bg-[#E8B970]/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#5C606B]">
                {selectedTags.length} active
              </span>
              <button
                onClick={clearAllTags}
                className="text-xs text-[#E8B970] hover:text-[#E8B970]/80 font-semibold"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="orange"
                  className="text-xs px-1.5 py-0.5 font-semibold rounded-full bg-[#E8B970] text-white border-0 cursor-pointer hover:bg-[#E8B970]/90"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  <X className="ml-0.5 h-2.5 w-2.5 inline" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filter Mode Toggle */}
        {selectedTags.length > 1 && onFilterModeChange && (
          <div className="mb-3 p-2.5 border border-[#D3D6DB] rounded-lg">
            <p className="text-xs font-semibold text-[#5C606B] mb-1.5">Match:</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => onFilterModeChange('or')}
                className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filterMode === 'or'
                    ? 'bg-[#E8B970] text-white'
                    : 'bg-gray-100 text-[#5C606B] hover:bg-gray-200'
                }`}
              >
                Any
              </button>
              <button
                onClick={() => onFilterModeChange('and')}
                className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filterMode === 'and'
                    ? 'bg-[#E8B970] text-white'
                    : 'bg-gray-100 text-[#5C606B] hover:bg-gray-200'
                }`}
              >
                All
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-1.5">
          {(Object.keys(TAG_CATEGORIES) as TagCategory[]).map((category) => {
            const isExpanded = expandedCategories.has(category)
            const tagCount = getCategoryTagCount(category)
            const tags = TAG_CATEGORIES[category] as readonly EducationTag[]

            return (
              <div key={category} className="border border-[#D3D6DB] rounded-lg overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-[#5C606B]" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-[#5C606B]" />
                    )}
                    <span className="font-semibold text-sm text-[#5C606B] text-left">{category}</span>
                  </div>
                  {tagCount > 0 && (
                    <Badge
                      variant="orange"
                      className="text-xs px-1.5 py-0 font-semibold rounded-full bg-[#E8B970] text-white border-0"
                    >
                      {tagCount}
                    </Badge>
                  )}
                </button>

                {/* Category Tags */}
                {isExpanded && (
                  <div className="px-2.5 pb-2.5 space-y-0.5">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all ${
                            isSelected
                              ? 'bg-[#E8B970] text-white font-semibold'
                              : 'text-[#5C606B] hover:bg-gray-100'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
