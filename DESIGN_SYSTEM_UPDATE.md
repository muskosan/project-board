# Design System Update - Practical UI Inspired

This document outlines the comprehensive design system update applied to StudioBoard, inspired by modern practical UI design principles.

## Color Palette Updates

### Background Colors
- **Primary**: `#FFFFFF` - Pure white for main backgrounds
- **Secondary**: `#FAFBFC` - Subtle gray for secondary surfaces
- **Elevated**: `#FFFFFF` - White for elevated surfaces like cards
- **Overlay**: `rgba(0, 0, 0, 0.05)` - Light overlay for modals

### Text Colors
- **Primary**: `#0F172A` - Rich dark slate for primary text
- **Secondary**: `#475569` - Medium slate for secondary text
- **Muted**: `#94A3B8` - Light slate for muted text
- **Inverse**: `#FFFFFF` - White text for dark backgrounds

### Interactive Colors
- **Primary**: `#2563EB` - Professional blue for primary actions
- **Primary Hover**: `#1D4ED8` - Darker blue for hover states
- **Primary Active**: `#1E40AF` - Even darker blue for active states
- **Secondary**: `#F8FAFC` - Light background for secondary buttons
- **Secondary Hover**: `#F1F5F9` - Slightly darker for hover
- **Secondary Active**: `#E2E8F0` - Darker for active states

### Status Colors
- **Success**: `#059669` - Emerald green
- **Warning**: `#D97706` - Amber orange
- **Error**: `#DC2626` - Red
- **Info**: `#0284C7` - Sky blue

### Border Colors
- **Light**: `#F1F5F9` - Very light slate for subtle borders
- **Medium**: `#E2E8F0` - Light slate for standard borders
- **Dark**: `#CBD5E1` - Medium slate for prominent borders
- **Focus**: `#2563EB` - Blue for focus states

## Typography Improvements

### Font Stack
- **Primary**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
- **Heading**: Same as primary for consistency
- **Mono**: `"JetBrains Mono", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace`

### Font Weights
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800
- **Black**: 900

### Line Heights
- **None**: 1
- **Tight**: 1.25
- **Snug**: 1.375
- **Normal**: 1.5
- **Relaxed**: 1.625
- **Loose**: 2

### Letter Spacing
- **Tighter**: -0.05em
- **Tight**: -0.025em
- **Normal**: 0em
- **Wide**: 0.025em
- **Wider**: 0.05em
- **Widest**: 0.1em

## Spacing System

### Numeric Scale (New)
- **0**: 0
- **px**: 1px
- **0.5**: 0.125rem (2px)
- **1**: 0.25rem (4px)
- **1.5**: 0.375rem (6px)
- **2**: 0.5rem (8px)
- **2.5**: 0.625rem (10px)
- **3**: 0.75rem (12px)
- **3.5**: 0.875rem (14px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **7**: 1.75rem (28px)
- **8**: 2rem (32px)
- **9**: 2.25rem (36px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)
- **32**: 8rem (128px)

### Legacy Scale (Backward Compatibility)
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## Border Radius Updates

- **None**: 0
- **sm**: 0.125rem (2px)
- **base**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **3xl**: 1.5rem (24px)
- **full**: 9999px

## Shadow System

- **None**: none
- **xs**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **sm**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **base**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
- **2xl**: `0 25px 50px -12px rgb(0 0 0 / 0.25)`
- **inner**: `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)`
- **focus**: `0 0 0 3px rgb(37 99 235 / 0.1)`

## Transition System

- **None**: none
- **All**: `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Fast**: `150ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Normal**: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Slow**: `500ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Colors**: `color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Opacity**: `opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Shadow**: `box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Transform**: `transform 150ms cubic-bezier(0.4, 0, 0.2, 1)`

## Component Updates

### Button Component
- Added support for `title` and `style` props
- Improved focus states with proper focus rings
- Better touch targets for mobile
- Loading states with spinner animation
- Consistent hover and active states

### Badge Component
- Added support for `onClick` and `active` props
- Interactive states for clickable badges
- Better color variants
- Improved accessibility

### Card Component
- Enhanced shadow system
- Better hover effects
- Improved border styling
- Added CardHeader, CardContent, and CardFooter components

### Input Component
- Updated to use new color system
- Better focus states
- Improved error handling
- Enhanced mobile experience

### Layout Components
- Header: Updated with new colors and spacing
- Sidebar: Improved navigation styling
- Better responsive behavior
- Enhanced focus management

## Global Styles

### Scrollbar Styling
- Custom scrollbar design
- Consistent with design system colors
- Better visual hierarchy

### Selection Styling
- Custom text selection colors
- Consistent with brand colors

### Focus Management
- Consistent focus rings across all interactive elements
- Better accessibility compliance
- Keyboard navigation improvements

## Accessibility Improvements

- Enhanced focus management
- Better color contrast ratios
- Improved touch targets for mobile
- Consistent keyboard navigation
- Screen reader friendly markup

## Performance Optimizations

- Optimized transition timing
- Reduced animation complexity
- Better CSS organization
- Improved build output

## Migration Notes

The design system maintains backward compatibility with the legacy spacing system while introducing the new numeric scale. Components can use either system during the transition period.

### Breaking Changes
- None - all changes are backward compatible

### Recommended Updates
- Gradually migrate to the new numeric spacing scale
- Update custom components to use the new color palette
- Adopt the new shadow system for consistency

## Future Considerations

- Dark mode support using the new color system
- Additional component variants
- Enhanced animation system
- Improved responsive utilities