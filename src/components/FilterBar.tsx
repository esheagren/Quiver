import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from './ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { EDUCATION_TAGS } from '@/lib/constants'
import type { EducationTag } from '@/lib/constants'
import { X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

type FilterMode = 'or' | 'and'

interface FilterBarProps {
  selectedTags: EducationTag[]
  onTagsChange: (tags: EducationTag[]) => void
  filterMode?: FilterMode
  onFilterModeChange?: (mode: FilterMode) => void
}

export default function FilterBar({
  selectedTags,
  onTagsChange,
  filterMode = 'or',
  onFilterModeChange,
}: FilterBarProps) {
  const [open, setOpen] = useState(false)
  const [tempSelectedTags, setTempSelectedTags] = useState<EducationTag[]>(selectedTags)
  const [tempFilterMode, setTempFilterMode] = useState<FilterMode>(filterMode)

  // Initialize temp selections when drawer opens
  useEffect(() => {
    if (open) {
      setTempSelectedTags(selectedTags)
      setTempFilterMode(filterMode)
    }
  }, [open, selectedTags, filterMode])

  const toggleTag = (tag: EducationTag) => {
    if (tempSelectedTags.includes(tag)) {
      setTempSelectedTags(tempSelectedTags.filter((t) => t !== tag))
    } else {
      setTempSelectedTags([...tempSelectedTags, tag])
    }
  }

  const removeTag = (tag: EducationTag, e: React.MouseEvent) => {
    e.stopPropagation()
    setTempSelectedTags(tempSelectedTags.filter((t) => t !== tag))
  }

  const clearAll = () => {
    setTempSelectedTags([])
  }

  const applyFilters = () => {
    onTagsChange(tempSelectedTags)
    if (onFilterModeChange) {
      onFilterModeChange(tempFilterMode)
    }
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // When closing (clicking outside/backdrop), apply the temporary selections
      onTagsChange(tempSelectedTags)
      if (onFilterModeChange) {
        onFilterModeChange(tempFilterMode)
      }
    }
    setOpen(newOpen)
  }

  // Handle ESC key - applies filters when ESC is pressed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onTagsChange(tempSelectedTags)
        if (onFilterModeChange) {
          onFilterModeChange(tempFilterMode)
        }
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [open, tempSelectedTags, tempFilterMode, onTagsChange, onFilterModeChange])

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn(
            "h-12 w-12 border-2 transition-all rounded-xl font-medium bg-white shadow-sm flex items-center justify-center p-0 relative",
            selectedTags.length > 0
              ? "border-[#E8B970] bg-[#E8B970]/10 text-[#E8B970]" 
              : "border-[#5C606B] hover:border-[#E8B970]"
          )}
        >
          <Filter className="h-5 w-5" />
          {selectedTags.length > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#E8B970] text-white text-xs rounded-full min-w-[18px] flex items-center justify-center">
              {selectedTags.length}
            </span>
          )}
        </Button>

        {/* Show selected tags inline when drawer is closed */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="orange"
                className="px-2.5 py-1 text-xs font-semibold bg-[#E8B970] text-white border-0 cursor-pointer hover:bg-[#E8B970]/90 transition-colors flex items-center gap-1.5"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag, e)
                }}
              >
                {tag}
                <X className="h-3 w-3 opacity-80 hover:opacity-100" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-lg flex flex-col" hideCloseButton>
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl text-[#5C606B]">
                Filters
              </SheetTitle>
              {tempSelectedTags.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-[#5C606B] hover:text-[#E8B970] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6 flex-1 overflow-y-auto">
            {/* Tags Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#5C606B] mb-4">
                Tags {tempSelectedTags.length > 0 && `(${tempSelectedTags.length})`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {EDUCATION_TAGS.map((tag) => {
                  const isSelected = tempSelectedTags.includes(tag)
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "orange" : "outline"}
                      className={cn(
                        "px-3 py-1.5 text-sm font-semibold cursor-pointer transition-all duration-200",
                        isSelected
                          ? "bg-[#E8B970] text-white border-0 shadow-md hover:shadow-lg"
                          : "border-2 border-[#5C606B] text-[#5C606B] hover:border-[#E8B970] hover:text-[#E8B970]"
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {isSelected && (
                        <X 
                          className="ml-2 h-3.5 w-3.5 opacity-80 hover:opacity-100 transition-transform inline-block" 
                          onClick={(e) => {
                            e.stopPropagation()
                            removeTag(tag, e)
                          }}
                        />
                      )}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>

          <SheetFooter className="flex-col gap-3 pt-4 border-t border-[#D3D6DB]">
            {/* Filter Mode Toggle */}
            <div className="flex items-center justify-center gap-2 w-full">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={cn(
                      "text-xs font-semibold transition-colors cursor-help",
                      tempFilterMode === 'or' ? "text-[#E8B970]" : "text-[#5C606B]"
                    )}>
                      OR
                    </span>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    align="center"
                    sideOffset={8}
                    className="bg-white border border-[#D3D6DB] text-[#5C606B] px-3 py-2 rounded-lg shadow-sm text-center max-w-xs"
                  >
                    <p className="text-sm font-medium">Show prompts that match any selected tag</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setTempFilterMode(tempFilterMode === 'or' ? 'and' : 'or')}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8B970] focus:ring-offset-2",
                        tempFilterMode === 'or' ? "bg-[#E8B970]" : "bg-[#5C606B]"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          tempFilterMode === 'or' ? "translate-x-1" : "translate-x-6"
                        )}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    align="center"
                    sideOffset={8}
                    className="bg-white border border-[#D3D6DB] text-[#5C606B] px-3 py-2 rounded-lg shadow-sm text-center max-w-xs"
                  >
                    <p className="text-sm font-medium">
                      {tempFilterMode === 'or' 
                        ? 'Show prompts that match any selected tag'
                        : 'Show prompts that match all selected tags'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={cn(
                      "text-xs font-semibold transition-colors cursor-help",
                      tempFilterMode === 'and' ? "text-[#E8B970]" : "text-[#5C606B]"
                    )}>
                      AND
                    </span>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    align="center"
                    sideOffset={8}
                    className="bg-white border border-[#D3D6DB] text-[#5C606B] px-3 py-2 rounded-lg shadow-sm text-center max-w-xs"
                  >
                    <p className="text-sm font-medium">Show prompts that match all selected tags</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 sm:justify-end w-full">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setTempSelectedTags(selectedTags) // Reset to original
                  setTempFilterMode(filterMode) // Reset to original
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                className="rounded-xl"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

