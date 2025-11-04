import type { EducationTag } from '@/lib/constants'

export interface Prompt {
  id: string
  url: string
  prompt_text: string
  generated_name: string | null
  description: string | null
  tags: EducationTag[]
  user_token: string
  upvotes: number
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
}

export type SortOption = 'recent' | 'upvoted' | 'alphabetical'

export interface AddPromptData {
  url: string
  prompt_text: string
}

export interface PromptMetadata {
  generated_name: string
  description: string
  tags: string[]
}

