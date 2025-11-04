# Quiver - Product Requirements Document (PRD v1)

## Project Overview

**Quiver** is a streamlined educational AI prompt library that allows teachers to save, discover, and share CustomGPT prompts without authentication barriers. The app uses anonymous browser tokens to provide a frictionless experience where educators can instantly build their personal collection of AI prompts and discover prompts shared by the community.

### Vision
Create a simple, accessible tool for educators to curate and discover high-quality AI prompts for teaching tasks like lesson planning, assessments, differentiation, and parent communication.

### Target Users
- K-12 teachers
- Higher education instructors
- Educational coordinators
- Instructional designers

---

## Design System

### Color Palette
- **Primary**: Cream (#F5F5DC or similar warm neutral)
- **Secondary**: Slate (#64748B or similar cool gray)
- **Accent**: Warm Orange (#F97316 or similar)
- **Background**: Light cream/off-white
- **Text**: Slate for body, darker slate for headings

### Typography
- Clean, readable sans-serif font (Inter, SF Pro, or similar)
- Hierarchy: Large headings for pages, medium for sections, body text at 16px

### UI Style
- Minimal and clean
- Card-based layout for prompts
- Rounded corners (8-12px border radius)
- Subtle shadows for depth
- Responsive grid layouts
- Dark mode optional (Phase 2)

---

## Core Requirements

### 1. Authentication & User Management

**Anonymous Browser Tokens**
- Auto-generate UUID v4 token on first page load
- Store in `localStorage` under key `quiver_user_token`
- Token serves as persistent user identifier
- No traditional login/signup required
- Token is invisible to user (seamless background process)
- All user actions (saving, upvoting, adding prompts) tied to this token

**Optional User Profile**
- Brief profile page where users can optionally add:
  - Display name
  - Grade levels taught (K-2, 3-5, 6-8, 9-12, Higher Ed)
  - Subjects taught (Math, Science, ELA, Social Studies, etc.)
  - Bio/About (short text field)
- Profile data stored in backend tied to browser token

---

### 2. Database Schema (Supabase)

#### Tables

**prompts**
```sql
- id (uuid, primary key)
- url (text, required)              -- CustomGPT URL
- prompt_text (text, required)      -- The actual prompt content
- generated_name (text)             -- AI-generated title
- description (text)                -- AI-generated summary
- tags (text[])                     -- AI-generated array from predefined list
- user_token (uuid)                 -- Browser token of creator
- upvotes (integer, default 0)      -- Total upvote count
- created_at (timestamp)
- updated_at (timestamp)
```

**saved_prompts**
```sql
- id (uuid, primary key)
- user_token (uuid, required)       -- Who saved it
- prompt_id (uuid, references prompts)
- created_at (timestamp)
- UNIQUE (user_token, prompt_id)
```

**prompt_upvotes**
```sql
- id (uuid, primary key)
- user_token (uuid, required)
- prompt_id (uuid, references prompts)
- created_at (timestamp)
- UNIQUE (user_token, prompt_id)
```

**user_profiles**
```sql
- user_token (uuid, primary key)
- display_name (text, optional)
- grade_levels (text[], optional)
- subjects_taught (text[], optional)
- bio (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Row Level Security (RLS)
- All prompts are public (readable by anyone)
- Saved prompts filtered by user_token
- Upvotes filtered by user_token
- Users can only edit their own profile

---

### 3. Core Features

#### A. Add Prompt Flow

**User Input:**
1. CustomGPT URL (text input, required)
2. Prompt text (textarea, required)

**Backend Processing:**
1. Submit to Supabase Edge Function `generate-prompt-metadata`
2. Edge function calls OpenAI GPT-4o-mini API
3. AI generates:
   - **generated_name**: Concise, descriptive title (5-8 words)
   - **description**: 2-3 sentence summary of what the prompt does
   - **tags**: Array of relevant tags from predefined education tag list

**Auto-Save Behavior:**
- Prompt immediately saved to `prompts` table (public)
- Automatically added to user's saved collection (`saved_prompts`)
- User sees success toast: "Prompt added and saved to your bank!"

**UI Components:**
- Modal or dedicated page with simple form
- Loading state during AI processing
- Error handling with clear messages
- Form validation (both fields required)

---

#### B. My Bank (Home Page)

**Purpose:**
Personal collection of saved prompts - the user's curated library.

**Features:**
- Grid display of all saved prompts
- Search within saved prompts
- Filter by tags
- Quick actions on each card:
  - Unsave (remove from bank)
  - Upvote
  - View details
- Empty state for new users: "No saved prompts yet. Discover prompts to start building your bank!"
- Stats: "X saved prompts"

**Default View:**
This is the landing page when users first visit the app.

---

#### C. Discover Page

**Purpose:**
Browse all public prompts shared by the community.

**Features:**
- Grid display of all public prompts from database
- Tag filter bar (multi-select)
- Sort options:
  - Most Recent (default)
  - Most Upvoted
  - Alphabetical
- Quick actions on each card:
  - Save to bank
  - Upvote
  - View details
- Pagination or infinite scroll for large collections

**Tag Filtering:**
- Multi-select tag chips
- Show prompts matching ANY selected tag (OR logic)
- Clear all filters button

**Education Tags:**
- Lesson Planning
- Assessment Creation
- Differentiation
- Parent Communication
- Student Feedback
- Classroom Management
- Professional Development
- Content Explanation
- Curriculum Planning
- Writing Assistance
- Discussion Facilitation
- Grading & Rubrics

---

#### D. Prompt Card Component

**Display Elements:**
- Generated name (heading)
- Description (truncated to 2 lines with ellipsis)
- Up to 3 visible tags ("+X more" if additional tags)
- Upvote count with icon
- Bookmark icon (filled if saved, outline if not)

**Interaction:**
- Click card → Opens detail view
- Click bookmark → Toggle save/unsave
- Click upvote → Toggle upvote on/off
- Hover states for all interactive elements

**Visual Design:**
- Card with subtle shadow
- Rounded corners
- Padding: 16-20px
- Border in slate color when not hovered
- Accent color border on hover

---

#### E. Prompt Detail View

**Display Mode:**
Drawer/modal that slides in from right or appears as overlay.

**Content:**
- Generated name (large heading)
- All tags (as chips)
- Full description
- CustomGPT URL (as clickable link)
- Full prompt text (in scrollable code block or textarea)
- Upvote count
- Created date

**Actions:**
- Copy prompt text to clipboard (button with icon)
- Open CustomGPT (opens URL in new tab)
- Save/Unsave toggle (bookmark icon + text)
- Upvote toggle (heart or arrow icon + count)
- Close drawer button

**UX:**
- Click outside drawer to close
- ESC key to close
- Smooth slide-in animation

---

#### F. Saving Prompts

**Functionality:**
- Save any public prompt to personal "My Bank"
- Toggle save/unsave from any view (card, detail drawer)
- Optimistic UI updates (immediate visual feedback)
- Backend: Insert/delete row in `saved_prompts` table

**Visual Feedback:**
- Bookmark icon: Outline when not saved, filled when saved
- Success toast: "Saved to your bank!" or "Removed from bank"
- Icon color changes (cream when saved, slate when not)

---

#### G. Upvoting System

**Functionality:**
- Any user can upvote any prompt (tracked by browser token)
- Toggle upvote on/off (click again to remove upvote)
- Upvote count displayed on all prompts
- Backend: Insert/delete in `prompt_upvotes`, update `prompts.upvotes` count

**Visual Feedback:**
- Icon: Outline when not upvoted, filled when upvoted
- Count increments/decrements optimistically
- Icon color: Warm orange when upvoted, slate when not

**Sorting by Upvotes:**
- "Most Upvoted" sort option on Discover page
- Shows most popular/useful prompts first

---

### 4. Pages & Routes

#### Route Structure

```
/                    → My Bank (Home)
/discover            → Browse Public Prompts
/prompt/:id          → Prompt Detail View (as drawer/modal)
/profile             → User Profile (optional)
/add                 → Add Prompt (or as modal on home)
```

#### Page Descriptions

**/ (My Bank - Home)**
- Header: "My Bank" + "Add Prompt" button
- Saved prompts grid
- Search and filter controls
- Navigation link to Discover
- Empty state if no saved prompts

**/discover (Browse Public Prompts)**
- Header: "Discover Prompts"
- Tag filter bar (sticky at top)
- Sort dropdown
- Public prompts grid
- All prompts shown by default

**Prompt Detail View**
- Drawer/modal overlay (not a separate route, or use route with modal)
- Shows when user clicks any prompt card
- Can be opened from My Bank or Discover pages

**/profile (Optional User Profile)**
- Simple form for optional user info
- Fields: Display name, Grade levels (multi-select), Subjects (multi-select), Bio (textarea)
- Save button
- Minimal UI, no heavy configuration

---

### 5. Technical Implementation

#### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool & dev server)
- React Router v6
- Tailwind CSS
- shadcn/ui (component library built on Radix UI)
- TanStack Query (React Query for server state)
- React Hook Form + Zod (form validation)
- Sonner (toast notifications)
- lucide-react (icons)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Edge Functions (Deno)
- OpenAI API (GPT-4o-mini for metadata generation)

**State Management:**
- React Query for server state (prompts, saved prompts, upvotes)
- localStorage for browser token
- React Context (if needed for global UI state)

---

#### Project Structure

```
/Volumes/T7 Shield/Code/Quiver/
├── src/
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ...
│   │   ├── PromptCard.tsx           # Reusable prompt card
│   │   ├── PromptDetailDrawer.tsx   # Prompt detail view
│   │   ├── AddPromptForm.tsx        # Add prompt modal/form
│   │   ├── FilterBar.tsx            # Tag filter component
│   │   ├── Header.tsx               # App header/nav
│   │   └── Layout.tsx               # Page layout wrapper
│   ├── pages/
│   │   ├── HomePage.tsx             # My Bank
│   │   ├── DiscoverPage.tsx         # Browse public prompts
│   │   ├── ProfilePage.tsx          # User profile
│   │   └── NotFound.tsx             # 404 page
│   ├── hooks/
│   │   ├── useUserToken.ts          # Generate/get browser token
│   │   ├── usePrompts.ts            # Fetch prompts (all or saved)
│   │   ├── useSavePrompt.ts         # Save/unsave mutations
│   │   ├── useUpvotePrompt.ts       # Upvote mutations
│   │   └── useAddPrompt.ts          # Add prompt + AI generation
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client setup
│   │   ├── constants.ts             # Tag list, config
│   │   └── utils.ts                 # Helper functions
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles + Tailwind imports
├── supabase/
│   ├── functions/
│   │   └── generate-prompt-metadata/
│   │       └── index.ts             # OpenAI integration
│   └── migrations/
│       └── 001_initial_schema.sql   # Database setup
├── public/
│   └── logo.svg                     # Quiver logo (to be added)
├── .env                             # Environment variables
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── PRD.md                           # This document
```

---

#### Key Implementation Details

**Browser Token Hook (`useUserToken.ts`):**
```typescript
export function useUserToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let userToken = localStorage.getItem('quiver_user_token');

    if (!userToken) {
      userToken = crypto.randomUUID();
      localStorage.setItem('quiver_user_token', userToken);
    }

    setToken(userToken);
  }, []);

  return token;
}
```

**Supabase Edge Function (generate-prompt-metadata):**
```typescript
// Receives: { url: string, prompt_text: string }
// Calls OpenAI API with function calling
// Returns: { generated_name: string, description: string, tags: string[] }

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

Deno.serve(async (req) => {
  const { url, prompt_text } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Generate metadata for an educational AI prompt...'
      },
      {
        role: 'user',
        content: `URL: ${url}\n\nPrompt: ${prompt_text}`
      }
    ],
    functions: [
      {
        name: 'generate_metadata',
        parameters: {
          type: 'object',
          properties: {
            generated_name: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    ],
    function_call: { name: 'generate_metadata' }
  });

  const metadata = JSON.parse(
    completion.choices[0].message.function_call.arguments
  );

  return new Response(JSON.stringify(metadata), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

### 6. User Flows

#### First-Time User Flow

1. User visits Quiver URL
2. UUID token auto-generated and stored in localStorage (silent)
3. User lands on "My Bank" (empty state)
4. Empty state shows: "No saved prompts yet" + "Discover Prompts" button
5. User clicks "Discover Prompts"
6. Browses public prompt library
7. Clicks bookmark icon on a prompt card
8. Success toast: "Saved to your bank!"
9. Navigates back to "My Bank" to see saved prompt

#### Adding a Prompt

1. User clicks "Add Prompt" button (in header)
2. Modal/form opens
3. User enters:
   - CustomGPT URL (e.g., https://chatgpt.com/g/...)
   - Prompt text (copy/paste from CustomGPT)
4. User clicks "Generate & Save"
5. Loading spinner appears
6. Backend calls OpenAI API for metadata
7. Prompt saved to database + auto-added to user's bank
8. Success toast: "Prompt added and saved!"
9. Modal closes, user sees new prompt in "My Bank"

#### Browsing & Filtering

1. User navigates to "Discover" page
2. Sees grid of all public prompts (sorted by recent)
3. Clicks tags in filter bar (e.g., "Lesson Planning", "Assessment")
4. Prompts filtered to show only matching tags
5. User changes sort to "Most Upvoted"
6. Prompts re-sorted by upvote count
7. User clicks prompt card to view details

#### Viewing Prompt Details

1. User clicks any prompt card
2. Drawer slides in from right
3. Shows full prompt details:
   - Name, tags, description
   - CustomGPT URL (clickable)
   - Full prompt text
   - Upvote count, save status
4. User clicks "Copy Prompt Text"
5. Text copied to clipboard
6. Toast: "Copied to clipboard!"
7. User clicks "Open CustomGPT"
8. New tab opens with CustomGPT URL
9. User closes drawer (click outside or ESC key)

#### Upvoting

1. User clicks upvote icon on prompt card
2. Icon fills with warm orange color
3. Count increments by 1
4. Backend records upvote in database
5. User clicks upvote icon again
6. Icon returns to outline style
7. Count decrements by 1
8. Backend removes upvote record

#### Optional Profile Setup

1. User clicks profile icon/link in header
2. Profile page loads
3. User fills optional fields:
   - Display name: "Ms. Johnson"
   - Grade levels: [3-5, 6-8]
   - Subjects: [Math, Science]
   - Bio: "Middle school STEM teacher in Brooklyn"
4. User clicks "Save Profile"
5. Profile saved to database
6. Toast: "Profile updated!"
7. Display name appears when user adds prompts (future feature)

---

### 7. Removed Features

The following features are intentionally excluded to keep the app streamlined:

- ❌ Traditional authentication (email/password, magic links)
- ❌ Forced profile setup on first visit
- ❌ Multi-step prompt improvement workflows
- ❌ PROMPT method structuring (Purpose, Roles, Outputs, Materials, Parameters, Targeted Questions)
- ❌ AI-generated clarification questions
- ❌ Private/public toggle (all prompts are public)
- ❌ Comments system
- ❌ "My Prompts" view (prompts I created)
- ❌ Extensive profile fields (school name, location, technology, standards)
- ❌ About page
- ❌ Token export/import (Phase 2 feature)

---

### 8. Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

**Note:** OpenAI API key is used in Supabase Edge Function (server-side), not exposed to frontend.

---

### 9. Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Deploy Supabase Edge Function
supabase functions deploy generate-prompt-metadata
```

---

### 10. Implementation Phases

#### Phase 1: Core MVP (Week 1-2)

1. Project setup & Supabase configuration
   - Initialize Supabase project
   - Create database tables with RLS policies
   - Set up environment variables

2. Browser token system
   - Implement `useUserToken` hook
   - Test localStorage persistence

3. Add Prompt functionality
   - Build form UI with validation
   - Create Supabase Edge Function
   - Integrate OpenAI API
   - Test metadata generation

4. My Bank page
   - Fetch saved prompts by user_token
   - Display prompt cards in grid
   - Implement empty state

5. Discover page
   - Fetch all public prompts
   - Display in grid layout
   - Basic tag filtering

6. Save/Unsave functionality
   - Implement optimistic UI updates
   - Backend mutations with React Query

7. Upvoting system
   - Upvote toggle UI
   - Backend upvote tracking

8. Prompt detail drawer
   - Build drawer component
   - Display full prompt details
   - Copy to clipboard feature

#### Phase 2: Polish & Enhancement (Week 3)

9. Profile page
   - Build profile form
   - Save profile data to Supabase

10. Advanced filtering
    - Multi-tag filtering (OR logic)
    - Sort options (recent, most upvoted)

11. Search functionality
    - Search within My Bank
    - Search in Discover page

12. Responsive design
    - Mobile optimization
    - Tablet breakpoints
    - Touch interactions

13. Loading & error states
    - Skeleton loaders
    - Error boundaries
    - Retry mechanisms

14. Performance optimization
    - Query caching
    - Pagination or infinite scroll
    - Image optimization

#### Phase 3: Future Enhancements

15. Token export/import
    - Display token to user
    - Import token on new device

16. Dark mode
    - Theme toggle
    - Persist preference

17. Analytics
    - Track prompt usage
    - Popular tags
    - User engagement metrics

18. Advanced features
    - Prompt collections/folders
    - Duplicate prompt detection
    - Prompt versioning
    - Share individual prompts via link

---

### 11. Success Criteria

**MVP Success Metrics:**
- ✅ User can visit site and immediately start saving prompts (no signup barrier)
- ✅ Adding a prompt with URL + text generates accurate metadata
- ✅ Prompts can be saved/unsaved instantly
- ✅ Upvoting works correctly (toggle on/off)
- ✅ My Bank shows only user's saved prompts
- ✅ Discover page shows all public prompts
- ✅ Tag filtering reduces prompt list correctly
- ✅ Prompt details display in drawer with all info
- ✅ Copy prompt text works reliably
- ✅ App is fully responsive (mobile, tablet, desktop)
- ✅ No console errors or broken functionality

**User Experience Goals:**
- New user can save their first prompt within 30 seconds
- Adding a prompt takes < 15 seconds (including AI generation)
- UI feels fast and responsive (optimistic updates)
- Design is clean, minimal, and professional
- App works smoothly on phones and tablets

---

### 12. Technical Considerations

#### Performance
- Use React Query for intelligent caching
- Implement pagination or infinite scroll for large prompt lists
- Optimize images and assets
- Code splitting with React.lazy()

#### Security
- RLS policies on all Supabase tables
- Validate user_token on all mutations
- Sanitize user input (prompt text, profile fields)
- Rate limiting on Edge Functions

#### Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals/drawers
- Sufficient color contrast (WCAG AA)

#### Error Handling
- Graceful degradation if AI generation fails
- Retry logic for network failures
- User-friendly error messages
- Fallback UI for missing data

#### Data Validation
- Zod schemas for all forms
- Validate URLs (must be valid CustomGPT links)
- Trim whitespace from inputs
- Limit text field lengths

---

### 13. Deployment

**Frontend Hosting:**
- Vercel or Netlify (recommended for Vite apps)
- Environment variables configured in platform

**Backend:**
- Supabase (managed PostgreSQL + Edge Functions)
- Deploy migrations via Supabase CLI

**Domain:**
- Custom domain (e.g., quiver.app)
- SSL certificate (auto via Vercel/Netlify)

**CI/CD:**
- GitHub Actions for automated deployment
- Run linting and type checking on PRs
- Automatic preview deployments for branches

---

### 14. Open Questions & Decisions Needed

1. **Logo Design:**
   - Need final Quiver logo for branding
   - Logo should inform exact color values for design system

2. **CustomGPT URL Validation:**
   - Should we validate that URL is a valid ChatGPT custom GPT link?
   - Or allow any URL?

3. **Prompt Text Length Limits:**
   - Maximum character count for prompt text?
   - Suggested: 5000 characters

4. **Tag Selection:**
   - Should we allow AI to generate tags outside the predefined list?
   - Or strictly limit to predefined education tags?

5. **Profile Display:**
   - Where should user's display name appear?
   - Show on prompts they created? In future "created by" section?

---

## Appendix

### A. Predefined Education Tags

```typescript
export const EDUCATION_TAGS = [
  'Lesson Planning',
  'Assessment Creation',
  'Differentiation',
  'Parent Communication',
  'Student Feedback',
  'Classroom Management',
  'Professional Development',
  'Content Explanation',
  'Curriculum Planning',
  'Writing Assistance',
  'Discussion Facilitation',
  'Grading & Rubrics',
] as const;
```

### B. Database Indexes

For optimal query performance:

```sql
-- Prompts indexes
CREATE INDEX idx_prompts_user_token ON prompts(user_token);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_upvotes ON prompts(upvotes DESC);
CREATE INDEX idx_prompts_tags ON prompts USING GIN(tags);

-- Saved prompts indexes
CREATE INDEX idx_saved_prompts_user_token ON saved_prompts(user_token);
CREATE INDEX idx_saved_prompts_prompt_id ON saved_prompts(prompt_id);

-- Upvotes indexes
CREATE INDEX idx_upvotes_user_token ON prompt_upvotes(user_token);
CREATE INDEX idx_upvotes_prompt_id ON prompt_upvotes(prompt_id);
```

### C. Sample OpenAI Prompt for Metadata Generation

```
You are an AI that generates metadata for educational CustomGPT prompts.

Given a CustomGPT URL and prompt text, generate:
1. generated_name: A concise, descriptive title (5-8 words) that captures the purpose
2. description: A 2-3 sentence summary explaining what this prompt helps teachers accomplish
3. tags: An array of 2-5 relevant tags from this list:
   - Lesson Planning
   - Assessment Creation
   - Differentiation
   - Parent Communication
   - Student Feedback
   - Classroom Management
   - Professional Development
   - Content Explanation
   - Curriculum Planning
   - Writing Assistance
   - Discussion Facilitation
   - Grading & Rubrics

Focus on clarity and accuracy. Tags should reflect the primary use cases.
```

---

## Document History

- **v1.0** - Initial PRD (November 3, 2025)
  - Core features defined
  - Tech stack selected
  - Design system specified
  - Implementation phases outlined

---

**End of PRD**
