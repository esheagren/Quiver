# Quiver - Visual Design Style Guide

## Overview

Quiver is a prompt management application with a warm, approachable aesthetic that balances modern minimalism with playful illustration. The design draws inspiration from archery and exploration themes, emphasizing clarity, utility, and a touch of whimsy.

---

## Brand Identity

### Theme
**"The Modern Archer's Toolkit"**

The application uses archery as its core metaphor—prompts are arrows in your quiver, ready to be deployed. The visual language reflects this through:
- Arrow and quiver iconography
- A sense of precision and readiness
- Exploration and discovery (telescope imagery)
- A warm, inviting color palette that feels both professional and creative

---

## Color Palette

### Primary Colors

#### Warm Grays & Slate
- **Charcoal Slate**: `#4A5568` (rgb: 74, 85, 104)
  - Used for: Icon outlines, dark borders, primary text
  - Appearance: Deep blue-gray with a modern, professional feel
  - A softer alternative to pure black that maintains readability

#### Vibrant Oranges & Ambers
- **Warm Amber**: `#F7B955` (rgb: 247, 185, 85)
  - Used for: Accent details, interactive highlights, energy points
  - Appearance: Rich, golden-yellow with warmth
  - Conveys creativity, energy, and invitation to action

- **Sunset Orange**: `#F97316` (rgb: 249, 115, 22)
  - Used for: Primary actions, hover states, focus states
  - Tailwind: `orange-500` to `orange-600`
  - Appearance: Bold, saturated orange
  - Creates visual hierarchy and draws attention

- **Deep Red-Orange**: `#DC2626` (rgb: 220, 38, 38)
  - Used for: Primary CTAs, important actions
  - Tailwind: `red-600`
  - Appearance: Confident, warm red
  - Used in gradients with orange for high-impact buttons

#### Supporting Colors
- **Soft Cyan/Turquoise**: `#4FD1C5` (rgb: 79, 209, 197)
  - Used for: Occasional accents in illustrations
  - Provides cool contrast to warm palette
  - Adds visual interest without overwhelming

- **Bright Yellow**: `#F6E05E` (rgb: 246, 224, 94)
  - Used for: Highlighting, bright accent details
  - Adds energy and optimism
  - Used sparingly in illustrations

### Neutral Colors

#### Backgrounds
- **Warm Cream**: `rgb(250, 248, 245)` / `hsl(250 248 245)`
  - Primary background color
  - Creates a softer, warmer alternative to pure white
  - Reduces eye strain and adds sophistication

- **Pure White**: `#FFFFFF`
  - Card backgrounds
  - High-contrast elements
  - Popover and modal backgrounds

- **Light Gray**: `rgb(245, 243, 239)`
  - Muted backgrounds
  - Subtle section dividers
  - Inactive states

#### Dark Backgrounds
- **Charcoal Black**: `#1F2937` (rgb: 31, 41, 55)
  - Tailwind: `gray-800` / `gray-900`
  - Used for: Content containers, high-contrast sections
  - Creates dramatic contrast with light cards

#### Text Colors
- **Primary Text**: `#1F2937` (gray-800)
- **Secondary Text**: `#6B7280` (gray-500)
- **Muted Text**: `#9CA3AF` (gray-400)

#### Borders
- **Subtle Border**: `rgb(229, 231, 235)` / `#E5E7EB`
  - Tailwind: `gray-200`
  - Creates gentle separation without harsh lines
  - Used on cards, inputs, and dividers

---

## Icon Design Language

### Visual Style

#### Geometric & Rounded
All icons follow a consistent geometric style:
- **Thick, rounded strokes**: Approximately 12-16px stroke width
- **Generous corner radius**: 8-12px for rounded rectangles
- **Consistent padding**: Icons maintain internal spacing of 15-20% of total size
- **Centered composition**: Elements are balanced and centered

#### Duotone Approach
Icons use a sophisticated two-tone color system:
- **Primary structure**: Charcoal slate (#4A5568) for main outlines and shapes
- **Accent highlights**: Warm amber (#F7B955) for interactive parts or focal points
- **Background fill**: Light gray or off-white for internal areas
- **Contrast**: High contrast between outline and fill for clarity

### Icon Specifications

#### Quiver Icon (Home/Brand)
- **Shape**: Triangular arrowhead pointing upward and right
- **Details**:
  - Solid slate outer border with rounded edges
  - Light gray inner fill with subtle white highlight stripe
  - Two amber motion lines trailing behind (suggesting speed/action)
- **Symbolism**: Ready to launch, action, collection of tools

#### Telescope Icon (Explore/Discover)
- **Shape**: Traditional telescope on tripod mount
- **Details**:
  - Slate structure with geometric tripod legs
  - Amber accents on adjustment knobs and eyepiece
  - Light gray lens surface
  - Technical, precise line work
- **Symbolism**: Discovery, exploration, looking ahead

#### Add Button Icon (Create/Add)
- **Shape**: Rounded square with centered plus symbol
- **Details**:
  - Slate outer border with significant corner radius
  - Warm amber-to-gold gradient fill
  - White plus symbol, bold and centered
  - Contained within white border frame
- **Symbolism**: Addition, creation, opportunity

#### Question Mark Icon (Help/About)
- **Shape**: Rounded square containing question mark
- **Details**:
  - Slate border and question mark shape
  - Off-white/cream background fill
  - Amber accent arc on upper portion of question mark
  - Centered composition with ample breathing room
- **Symbolism**: Help, information, learning

---

## Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Characteristics
- **Modern sans-serif**: Clean, geometric, highly legible
- **Variable font support**: Allows precise weight adjustments
- **Excellent web rendering**: Optimized for screen display
- **Professional yet approachable**: Balances formality with friendliness

### Typography Scale

#### Headings
- **H1**: `text-4xl md:text-5xl` (36px/48px)
  - Font weight: Bold (700)
  - Letter spacing: `-0.025em` (tight)
  - Line height: `1.15`
  - Use: Page titles, major section headers

- **H2**: `text-3xl md:text-4xl` (30px/36px)
  - Font weight: Bold (700)
  - Letter spacing: `-0.025em` (tight)
  - Line height: `1.25`
  - Use: Section headers, card titles

- **H3**: `text-2xl md:text-3xl` (24px/30px)
  - Font weight: Bold (700)
  - Letter spacing: `-0.025em` (tight)
  - Line height: `1.35`
  - Use: Subsection headers, prominent labels

#### Body Text
- **Base size**: `16px` (1rem)
- **Letter spacing**: `-0.01em` (slightly tight for improved readability)
- **Line height**: `1.7` (comfortable reading)
- **Weight**: Regular (400) for body, Medium (500) for emphasis

### Best Practices
- Use tight letter spacing on large text for a modern, polished look
- Maintain generous line height for body text (1.7)
- Bold weights for all headings to create clear hierarchy
- Use font smoothing for crisp rendering:
  ```css
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  ```

---

## Spacing & Layout

### Container Spacing
- **Page padding**: `px-6 py-4` (24px horizontal, 16px vertical)
- **Section spacing**: `space-y-8` (32px vertical gaps)
- **Card padding**: `p-8` (32px all sides)
- **Max width**: `1400px` for 2xl screens

### Component Spacing
- **Icon size**: `h-7 w-7` (28px × 28px) for navigation
- **Button size**: `h-14 w-14` (56px × 56px) for icon buttons
- **Gap between nav items**: `gap-3` (12px)

### Border Radius
- **Large**: `12px` - Cards, major containers
- **Medium**: `8px` - Buttons, inputs
- **Small**: `4px` - Tags, badges
- **Extra large**: `rounded-2xl` (16px) - Feature sections

---

## Interactive Elements

### Buttons

#### Primary Action Button
```tsx
className="h-14 w-14 bg-gradient-to-r from-orange-500 to-red-500
           hover:from-orange-600 hover:to-red-600
           shadow-md hover:shadow-lg
           transition-all duration-200"
```
- Vibrant orange-to-red gradient
- Elevated shadow that grows on hover
- Smooth color transition
- Used for: Add prompt, primary CTAs

#### Ghost Button (Navigation)
```tsx
className="h-14 w-14 hover:bg-orange-100 transition-all"
```
- Transparent default state
- Soft orange tint on hover
- Minimal, clean appearance
- Used for: Navigation icons, secondary actions

#### Active State
```tsx
className="bg-orange-100"
```
- Persistent soft orange background
- Indicates current page/selection
- Subtle but clear visual feedback

### Hover Effects
- **Smooth transitions**: `transition-all duration-200`
- **Subtle scale**: Not used—maintains stability
- **Color shifts**: Background lightens or warms
- **Shadow elevation**: Grows slightly for buttons
- **Background opacity**: 10-20% for hover states

---

## Animation & Motion

### Transition Principles
- **Duration**: 200ms for most interactions (fast but perceptible)
- **Easing**: Default ease for natural feel
- **Property**: `transition-all` for comprehensive smoothness

### Specific Animations
```css
animation: "accordion-down 0.2s ease-out"
animation: "accordion-up 0.2s ease-out"
```

### Loading States
```tsx
className="animate-pulse bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50"
```
- Pulsing animation for skeleton screens
- Gradient hints at final content appearance
- Maintains brand color integration

---

## Surface Treatments

### Elevation & Depth

#### Level 1 - Page Background
- Color: Warm cream `rgb(250, 248, 245)`
- Flat, no shadow
- Provides canvas for all content

#### Level 2 - Cards & Content Areas
- Color: Pure white `#FFFFFF`
- Border: `border border-gray-200`
- Subtle separation from background
- Contains primary content

#### Level 3 - Elevated Elements
- Shadow: `shadow-md` (medium shadow)
- Used for: Active buttons, dropdowns, popovers
- Creates sense of floating above content

#### Level 4 - Highest Elevation
- Shadow: `shadow-lg` (large shadow)
- Used for: Hover states on primary actions, modals
- Maximum attention and hierarchy

### Glass Morphism
```tsx
className="bg-white/80 backdrop-blur-xl"
```
- Semi-transparent white (80% opacity)
- Backdrop blur for depth
- Used in: Header navigation
- Creates modern, layered effect

### Dark Containers
```tsx
className="bg-gray-900 rounded-2xl p-8"
```
- Deep charcoal background
- Large border radius for softness
- Generous padding
- Used for: Main content sections, galleries
- Creates dramatic contrast with light cards inside

---

## Illustration Style

### Characteristics (from 1.png - Arrow Quiver Logo)
- **Flat design with dimension**: Uses color blocks to suggest 3D form
- **Geometric shapes**: Arrows constructed from triangular segments
- **Vibrant color blocking**: Red, orange, yellow, cyan accents
- **Dark background**: Creates pop and energy for illustrations
- **Circular composition**: Contained within round frame
- **Stylized and iconic**: Simplified shapes that are instantly recognizable
- **Fletching details**: Small geometric patterns add texture and authenticity
- **Crossed/bundled arrangement**: Suggests collection, preparedness, arsenal

### Color Usage in Illustrations
- Primary arrows: Red (`#E53E3E`) and orange (`#F97316`)
- Accent elements: Yellow (`#F6E05E`) and cyan (`#4FD1C5`)
- Shaft/structure: Tan/beige (`#D4A574`)
- Background: Dark brown/charcoal (`#2D2420`)

---

## Design Principles

### 1. Warm Minimalism
- Clean layouts with breathing room
- Warm color palette prevents sterility
- Generous whitespace and padding
- Purposeful use of color for guidance

### 2. Approachable Professionalism
- Playful icons without sacrificing clarity
- Warm tones make interface inviting
- Clear hierarchy and organization
- Balance between friendly and capable

### 3. Consistency in Interaction
- Predictable hover states across all buttons
- Uniform spacing and sizing for similar elements
- Consistent icon style and coloring
- Reliable visual feedback for all actions

### 4. Clarity Through Contrast
- Dark containers with light cards
- Bold text on light backgrounds
- High-contrast icons against any background
- Clear visual hierarchy through size and weight

### 5. Subtle Sophistication
- Cream background over stark white
- Gradient fills over flat colors
- Rounded corners over sharp edges
- Soft shadows over harsh borders
- Glass morphism over solid blocks

---

## Usage Guidelines

### Do's ✓
- Use warm amber (#F7B955) for interactive highlights and accents
- Maintain generous padding and spacing (minimum 12px gaps)
- Apply rounded corners consistently (12px for large, 8px for medium)
- Use the slate-amber duotone approach for all custom icons
- Implement smooth transitions (200ms) on interactive elements
- Create visual hierarchy with typography scale and weight
- Use dark containers to frame light content cards
- Apply glass morphism effects for floating UI elements

### Don'ts ✗
- Don't use pure black (#000000) for text—use charcoal slate instead
- Don't use harsh drop shadows—keep them soft and subtle
- Don't mix icon styles—maintain geometric, rounded aesthetic
- Don't use pure white backgrounds everywhere—use warm cream
- Don't animate excessively—keep motion purposeful and brief
- Don't use small, cramped layouts—embrace whitespace
- Don't use cool grays—stick to warm neutrals
- Don't use thin icon strokes—maintain 12-16px thickness

---

## Component Examples

### Navigation Icon Button
```tsx
<Link
  to="/"
  className="h-14 w-14 flex items-center justify-center
             p-0 bg-transparent border-0 cursor-pointer
             hover:bg-orange-100 transition-all"
>
  <img src={icon} alt="Label" className="h-7 w-7 object-contain" />
</Link>
```

### Primary Action Button
```tsx
<button
  className="h-14 w-14 flex items-center justify-center
             bg-gradient-to-r from-orange-500 to-red-500
             hover:from-orange-600 hover:to-red-600
             shadow-md hover:shadow-lg
             transition-all duration-200 rounded-md"
>
  <img src={icon} alt="Add" className="h-7 w-7 object-contain" />
</button>
```

### Content Card Container
```tsx
<div className="bg-white border border-gray-200 rounded-2xl p-8
                hover:shadow-md transition-all">
  {/* Card content */}
</div>
```

### Dark Section Container
```tsx
<div className="bg-gray-900 rounded-2xl p-8">
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Light cards inside */}
  </div>
</div>
```

---

## Accessibility Notes

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Icon colors provide sufficient contrast against backgrounds
- Hover states maintain contrast ratios
- Focus states use high-visibility orange ring

### Interactive Elements
- Minimum touch target: 44px × 44px (we use 56px × 56px)
- Clear focus indicators on all interactive elements
- Tooltips provide context for icon-only buttons
- Semantic HTML for proper screen reader support

### Motion
- Animations are brief and purposeful (200ms)
- No auto-playing motion without user initiation
- Respect `prefers-reduced-motion` media query where implemented

---

## Brand Voice (Visual)

**Confident**: Bold colors and clear hierarchy show decisiveness
**Warm**: Amber accents and cream backgrounds feel welcoming
**Modern**: Clean typography and minimalist layouts feel current
**Playful**: Illustrated icons and rounded corners add personality
**Professional**: Consistent spacing and thoughtful details show care
**Exploratory**: Telescope and arrow metaphors encourage discovery

---

*This style guide ensures consistency across Quiver and maintains the unique warm, modern, and approachable aesthetic that defines the application.*
