export const EDUCATION_TAGS = [
  'AI Literacy',
  'AP History',
  'AP Science',
  'AP Seminar',
  'Assessment',
  'College & Career',
  'Communications',
  'Curriculum Alignment',
  'Data & Intervention',
  'Debate',
  'Development & Grants',
  'Differentiation & SPED',
  'ELA',
  'Elementary (3-5)',
  'Engineering',
  'Events & Meetings',
  'Feedback & Coaching',
  'HR & Talent',
  'High School (9-12)',
  'IT & Tech Support',
  'Inquiry-Based',
  'Intellectual Prep',
  'Leadership & Strategy',
  'Lesson Planning',
  'Math',
  'Middle School (6-8)',
  'Multi-Grade',
  'NYS Test Prep',
  'Other',
  'Personal/Non-Work',
  'PreK-2',
  'Primary Sources',
  'Science',
  'Social Studies',
  'Student Services',
] as const

export type EducationTag = typeof EDUCATION_TAGS[number]

// Category groupings for sidebar navigation
export const TAG_CATEGORIES = {
  'Teaching & Learning': [
    'Lesson Planning',
    'Assessment',
    'Differentiation & SPED',
    'Curriculum Alignment',
    'Intellectual Prep',
    'Data & Intervention',
    'Feedback & Coaching',
    'NYS Test Prep',
    'Inquiry-Based',
  ],
  'Subjects & Grades': [
    'ELA',
    'Math',
    'Science',
    'Social Studies',
    'Engineering',
    'Primary Sources',
    'AP History',
    'AP Science',
    'AP Seminar',
    'Debate',
    'PreK-2',
    'Elementary (3-5)',
    'Middle School (6-8)',
    'High School (9-12)',
    'Multi-Grade',
  ],
  'Operations & Support': [
    'IT & Tech Support',
    'HR & Talent',
    'Communications',
    'Events & Meetings',
    'Leadership & Strategy',
    'Development & Grants',
    'Student Services',
    'College & Career',
    'AI Literacy',
    'Other',
    'Personal/Non-Work',
  ],
} as const

export type TagCategory = keyof typeof TAG_CATEGORIES

export const QUIVER_USER_TOKEN_KEY = 'quiver_user_token'




