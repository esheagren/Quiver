import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { EDUCATION_TAGS } from '@/lib/constants'
import type { EducationTag } from '@/lib/constants'
import type { SortOption } from '@/types'
import { X } from 'lucide-react'

interface FilterBarProps {
  selectedTags: EducationTag[]
  onTagsChange: (tags: EducationTag[]) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function FilterBar({
  selectedTags,
  onTagsChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  const toggleTag = (tag: EducationTag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onTagsChange([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {EDUCATION_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            className={`cursor-pointer px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              selectedTags.includes(tag)
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md hover:shadow-lg scale-105'
                : 'border-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600 hover:scale-105 hover:shadow-sm'
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full font-medium"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {selectedTags.length > 0 && (
            <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full font-semibold">
              Filtering by {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[200px] h-12 border-2 border-gray-300 hover:border-orange-400 transition-all rounded-xl font-medium bg-white shadow-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="upvoted">Most Upvoted</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

