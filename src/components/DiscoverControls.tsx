import FilterBar from './FilterBar'
import type { EducationTag } from '@/lib/constants'

interface DiscoverControlsProps {
  selectedTags: EducationTag[]
  onTagsChange: (tags: EducationTag[]) => void
  filterMode?: 'or' | 'and'
  onFilterModeChange?: (mode: 'or' | 'and') => void
  hasPrompts: boolean
}

export default function DiscoverControls({
  selectedTags,
  onTagsChange,
  filterMode = 'or',
  onFilterModeChange,
  hasPrompts,
}: DiscoverControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Filter Section */}
      {hasPrompts && (
        <FilterBar
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
          filterMode={filterMode}
          onFilterModeChange={onFilterModeChange}
        />
      )}
    </div>
  )
}

