# Design System Guide

## 🎨 Color System

### Role-Based Color Scheme

#### Admin Role
```
Primary: Purple (#9333ea) → Pink (#ec4899) → Red (#dc2626)
Badge: Purple (#9333ea)
Icon Background: Purple to Pink gradient
Usage: Admin dashboard, admin users, admin navigation
```

#### Manager Role
```
Primary: Blue (#3b82f6) → Cyan (#06b6d4) → Teal (#14b8a6)
Badge: Blue (#3b82f6)
Icon Background: Blue to Cyan gradient
Usage: Manager dashboard, manager users, team management
```

#### Employee Role
```
Primary: Green (#10b981) → Emerald (#059669) → Teal (#14b8a6)
Badge: Green (#10b981)
Icon Background: Green to Emerald gradient
Usage: Employee dashboard, employee users, work tracking
```

### Status Colors

#### Active/Success
```
Background: Green 100 (#dcfce7)
Text: Green 800 (#166534)
Indicator: Green 500 (#22c55e)
```

#### Inactive/Neutral
```
Background: Gray 100 (#f3f4f6)
Text: Gray 800 (#1f2937)
Indicator: Gray 500 (#6b7280)
```

#### Warning
```
Background: Yellow 100 (#fef3c7)
Text: Yellow 800 (#854d0e)
Indicator: Yellow 500 (#eab308)
```

#### Danger/Error
```
Background: Red 100 (#fee2e2)
Text: Red 800 (#991b1b)
Indicator: Red 500 (#ef4444)
```

## 🎭 Component Styles

### Buttons

#### Primary Button
```css
background: gradient(blue-600 → indigo-600)
padding: 1.5rem 1.5rem
border-radius: 0.75rem
font-weight: 600
transition: all 300ms
hover: scale(1.05) + shadow-lg
```

#### Danger Button
```css
background: gradient(red-600 → pink-600)
padding: 1.5rem 1.5rem
border-radius: 0.75rem
font-weight: 600
transition: all 300ms
hover: scale(1.05) + shadow-lg
```

#### Success Button
```css
background: gradient(green-600 → emerald-600)
padding: 1.5rem 1.5rem
border-radius: 0.75rem
font-weight: 600
transition: all 300ms
hover: scale(1.05) + shadow-lg
```

### Cards

#### Standard Card
```css
background: white
border-radius: 1rem
padding: 1.5rem
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
border: 1px solid gray-100
transition: all 300ms
hover: shadow-2xl
```

#### Gradient Card (Headers)
```css
background: gradient(role-color)
border-radius: 1rem
padding: 1.5rem
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
color: white
transition: all 300ms
hover: shadow-2xl + translate-y(-4px)
```

### Input Fields

#### Text Input
```css
width: 100%
padding: 0.75rem 1rem
border: 2px solid gray-300
border-radius: 0.75rem
background: white
transition: all 200ms
focus: ring-4 ring-blue-500 ring-opacity-30 + border-blue-500
hover: border-blue-400
```

### Badges

#### Role Badge
```css
padding: 0.25rem 0.75rem
font-size: 0.75rem
font-weight: 700
border-radius: 9999px
text-transform: uppercase
letter-spacing: 0.025em
background: role-color-100
color: role-color-800
```

#### Status Badge
```css
padding: 0.25rem 0.75rem
font-size: 0.75rem
font-weight: 700
border-radius: 9999px
background: status-color-100
color: status-color-800
```

## ✨ Animations

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
duration: 500ms
timing: ease-in
```

### Slide Up
```css
@keyframes slideUp {
  from { 
    transform: translateY(20px)
    opacity: 0
  }
  to { 
    transform: translateY(0)
    opacity: 1
  }
}
duration: 500ms
timing: ease-out
```

### Scale In
```css
@keyframes scaleIn {
  from { 
    transform: scale(0.9)
    opacity: 0
  }
  to { 
    transform: scale(1)
    opacity: 1
  }
}
duration: 300ms
timing: ease-out
```

### Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1 }
  50% { opacity: 0.5 }
}
duration: 2s
timing: cubic-bezier(0.4, 0, 0.6, 1)
repeat: infinite
```

### Hover Transform
```css
transition: all 300ms
hover: scale(1.05)
active: scale(0.95)
```

## 📐 Spacing System

### Padding Scale
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 2.5rem (40px)

### Margin Scale
Same as padding scale

### Gap Scale (Grid/Flex)
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 5: 1.25rem (20px)
- 6: 1.5rem (24px)

## 📝 Typography

### Font Sizes
- xs: 0.75rem (12px) - Captions, small labels
- sm: 0.875rem (14px) - Secondary text
- base: 1rem (16px) - Body text
- lg: 1.125rem (18px) - Subheadings
- xl: 1.25rem (20px) - Card titles
- 2xl: 1.5rem (24px) - Section headers
- 3xl: 1.875rem (30px) - Page titles
- 4xl: 2.25rem (36px) - Hero text
- 5xl: 3rem (48px) - Large hero text

### Font Weights
- medium: 500 - Body text
- semibold: 600 - Subheadings
- bold: 700 - Headings
- extrabold: 800 - Hero text

### Line Heights
- tight: 1.25
- normal: 1.5
- relaxed: 1.625
- loose: 2

## 🌈 Gradient Patterns

### Background Gradients
```css
/* Page backgrounds */
gradient: from-gray-50 via-blue-50 to-indigo-50

/* Card gradients */
gradient: from-white to-gray-50
```

### Button Gradients
```css
/* Primary */
gradient: from-blue-600 to-indigo-600
hover: from-blue-700 to-indigo-700

/* Danger */
gradient: from-red-600 to-pink-600
hover: from-red-700 to-pink-700

/* Success */
gradient: from-green-600 to-emerald-600
hover: from-green-700 to-emerald-700
```

### Header Gradients
```css
/* Admin */
gradient: from-purple-500 via-pink-500 to-red-600

/* Manager */
gradient: from-blue-500 via-cyan-500 to-teal-600

/* Employee */
gradient: from-green-500 via-emerald-500 to-teal-600
```

## 🎯 Usage Examples

### Dashboard Header
```jsx
<div className="card-gradient from-purple-500 via-pink-500 to-red-600">
  <div className="flex items-center space-x-4">
    <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
      <Icon size={40} />
    </div>
    <div>
      <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
      <p className="text-purple-100 text-lg font-medium">Subtitle</p>
    </div>
  </div>
</div>
```

### Stat Card
```jsx
<div className="card hover:scale-105 transition-transform duration-300">
  <div className="flex items-center justify-between mb-3">
    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
      <Icon size={24} className="text-blue-600" />
    </div>
    <span className="badge badge-primary">Today</span>
  </div>
  <h3 className="text-gray-600 text-sm font-semibold mb-1">Label</h3>
  <p className="text-3xl font-extrabold text-gray-900">Value</p>
</div>
```

### User Card
```jsx
<div className="card hover:scale-105 transition-all duration-300">
  <div className="flex items-center space-x-3 mb-3">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      A
    </div>
    <div>
      <h3 className="font-bold text-lg text-gray-900">Name</h3>
      <p className="text-sm text-gray-600">email@example.com</p>
    </div>
  </div>
  <span className="badge badge-primary">Role</span>
</div>
```

## 🔧 Customization

### Adding New Role Colors
1. Define gradient in role-specific components
2. Add badge color variant
3. Update avatar/icon backgrounds
4. Ensure contrast ratios meet WCAG standards

### Creating New Card Variants
1. Use base `.card` class
2. Add gradient or background modifications
3. Include hover effects
4. Test responsiveness

### Extending Animation Library
1. Define keyframes in `index.css`
2. Add utility class in `@layer utilities`
3. Test performance across devices
4. Document usage

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layouts
- Full-width cards
- Collapsible navigation
- Larger touch targets (min 44px)

### Tablet (768px - 1024px)
- Two-column layouts
- Card grids (2 columns)
- Horizontal navigation
- Balanced spacing

### Desktop (> 1024px)
- Multi-column layouts
- Card grids (3-4 columns)
- Enhanced hover effects
- Optimized spacing

## ✅ Best Practices

1. **Consistency**: Use predefined classes and patterns
2. **Accessibility**: Maintain contrast ratios, use semantic HTML
3. **Performance**: Prefer CSS over JavaScript animations
4. **Responsiveness**: Test on multiple screen sizes
5. **Maintainability**: Follow naming conventions
6. **User Experience**: Provide visual feedback for all interactions
