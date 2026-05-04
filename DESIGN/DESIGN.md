---
name: Liquid Glass
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#5a4136'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfde'
  on-secondary-container: '#636262'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#989999'
  on-tertiary-container: '#2f3132'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c7c6c5'
  on-secondary-fixed: '#1b1c1b'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-xl:
    fontFamily: Heebo
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Heebo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Heebo
    fontSize: 24px
    fontWeight: '300'
    lineHeight: 32px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Heebo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Heebo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Heebo
    fontSize: 14px
    fontWeight: '800'
    lineHeight: 20px
    letterSpacing: 0.08em
  label-light:
    fontFamily: Heebo
    fontSize: 14px
    fontWeight: '300'
    lineHeight: 20px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  margin-page: 24px
  gutter-bento: 16px
  padding-card: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built on the concept of "Liquid Glass"—an advanced visual language that merges high-tech precision with organic serenity. The aesthetic targets a sophisticated user base that values both predictive intelligence and aesthetic tranquility. 

The style is characterized by **Extreme Glassmorphism**, where the UI doesn't just sit on top of the background but feels physically fused with it through heavy refraction and light-bending properties. The emotional response is one of "Technical Zen": a calm, organized environment that feels light to the touch yet computationally powerful. The interface prioritizes depth, clarity, and tactile responsiveness to create a premium, tactile experience.

## Colors

The palette revolves around a pristine, warm environment. 
- **Pearl White (#FBF9F8)** acts as the canvas, providing a soft, beige-tinted foundation that feels more organic than pure white.
- **Innovative Orange (#FF6B00)** is used sparingly for high-action items, notifications, and critical data points, creating a high-energy contrast against the serene background.
- **Glass Surfaces** utilize varying opacities of white (20%-40%) to create layers of refraction. 
- **Internal Glows** are achieved using subtle radial gradients of #FFFFFF at 60% opacity near the edges of components to simulate light trapped within a glass pane.

## Typography

This design system employs **Heebo** to achieve an architectural, structured feel. The hierarchy relies on extreme weight variance:
- **Extra-Bold (800)** is reserved for primary headlines and data visualizations to anchor the layout.
- **Light (300)** is used for secondary information and descriptive text to maintain the "airy" quality of the glass aesthetic.
- Avoid medium weights where possible to keep the contrast high and the intent clear. 
- Tracking (letter spacing) should be tightened for large headings and opened up significantly for light labels to ensure legibility against blurred backgrounds.

## Layout & Spacing

The layout follows a **Bento-style organization**, where content is encapsulated in distinct, modular containers of varying sizes. 
- **Grid:** A 4-column fluid mobile grid with 24px side margins.
- **Rhythm:** Elements should snap to a 8px baseline grid to ensure mathematical harmony.
- **Bento Modules:** Use varying heights for containers to create a dynamic, masonry-like feel. Every module must share the same corner radius for consistency.
- **Negative Space:** Use generous internal padding (24px+) within containers to allow the "liquid" background effects to be visible around the content.

## Elevation & Depth

Depth is not communicated through traditional black shadows, but through **Refraction and Light-Catching Edges**:
- **Backdrop Blur:** All glass surfaces must apply a `backdrop-filter: blur(32px)`. Primary interaction layers increase this to 40px.
- **Outer Glow:** Instead of a shadow, use a very soft white glow (`box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.15)`).
- **Inner Border:** Apply a 1.5px solid top-and-left border in a lighter white (50% opacity) and a bottom-and-right border in a darker translucent shade to simulate light hitting the edge of a glass pane.
- **Layering:** When elements stack, the "lower" element decreases in opacity (20%) while the "higher" element increases (40%), creating a natural sense of proximity.

## Shapes

The shape language is ultra-soft and organic. 
- **Base Radius:** All main containers and Bento modules use a **32px to 40px** corner radius.
- **Secondary Elements:** Buttons and input fields use a fully pill-shaped radius (rounding proportional to height).
- **Icons:** Icons should feature rounded terminals and a consistent 2px stroke weight to match the architectural feel of the Heebo typeface.
- **Interactive States:** On press, elements should visually "compress" (scale to 96%) to mimic the tactile resistance of a physical object.

## Components

### Buttons
- **Primary:** Innovative Orange (#FF6B00) with a slight inner white glow at the top edge. 
- **Glass Button:** Transparent base with a 40px blur and a 1.5px white stroke (30% opacity). Use Extra-Bold Heebo for the label.

### Bento Cards
- Standard containers for data. Must include the `Liquid Glass` texture: a subtle, moving mesh gradient behind the glass layer that creates a sense of "living" software.

### Input Fields
- Fully translucent with only a bottom stroke or a faint background blur. Floating labels use Heebo Light (300) and transition to Label-Bold (800) on focus.

### Tactile Feedback & Motion
- **Frame Motion:** All screen transitions move as a single unit ("Frame Motion") rather than individual elements sliding in.
- **Haptics:** Light "tap" feedback on every glass interaction.
- **Hover/Active:** When touched, the glass surface increases in opacity and the backdrop blur intensifies, simulating the surface being pressed closer to the background.

### Liquid Toggles
- Switches that look like a bead of liquid moving inside a glass tube, using Innovative Orange for the "active" fluid state.