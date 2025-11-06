import type { EducationTag } from '@/lib/constants'
export type { EducationTag }

export interface Prompt {
  id: string
  url: string
  prompt_text: string
  generated_name: string | null
  description: string | null
  tags: EducationTag[]
  user_token: string
  upvotes: number
  uses: number
  is_broken: boolean
  created_at: string
  updated_at: string
}

export interface SavedPrompt {
  id: string
  user_token: string
  prompt_id: string
  created_at: string
  prompt?: Prompt
}

export interface PromptUpvote {
  id: string
  user_token: string
  prompt_id: string
  created_at: string
}

export interface UserProfile {
  user_token: string
  display_name: string | null
  grade_levels: string[]
  subjects_taught: string[]
  bio: string | null
  created_at: string
  updated_at: string
}

export interface PromptWithMetadata extends Prompt {
  is_saved?: boolean
  is_upvoted?: boolean
  saved_count?: number
}

export type SortOption = 'recent' | 'upvoted' | 'most-used' | 'alphabetical'

export interface AddPromptData {
  url: string
  prompt_text: string
}

export interface PromptMetadata {
  generated_name: string
  description: string
  tags: string[]
}

