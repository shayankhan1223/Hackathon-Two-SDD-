# Implementation Plan: UI/UX Upgradation — 004-ai-chat-todo

**Branch**: `004-ai-chat-todo` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification — UI/UX Upgradation section (US-11 through US-15, FR-030 through FR-058)

## Summary

Upgrade the Dashboard, Interactive Sidebar, Login, and Sign Up pages of the AI Chat-Driven Todo application to enterprise-grade UI/UX. This plan focuses exclusively on the **frontend** (`phase-03-ai-chat/frontend/`) — no backend changes required. The existing component library (11 atomic components), design token system, and page structure provide a solid foundation; upgrades are incremental enhancements to existing components and pages.

## Technical Context

**Language/Version**: TypeScript 5.9.3 (Next.js 16, React 19)
**Primary Dependencies**: Tailwind CSS 4.1.18, Lucide React 0.563, clsx, react-hook-form, zod
**Storage**: N/A (frontend only — consumes existing backend APIs)
**Testing**: Vitest + React Testing Library (to be configured)
**Target Platform**: Modern web browsers (desktop 1200px+, tablet 768px-1199px, mobile <768px)
**Project Type**: Web application (frontend layer only)
**Performance Goals**: 60fps animations, <100ms interaction response, Lighthouse Accessibility 90+
**Constraints**: No new major dependencies; extend existing component library; maintain backward compatibility
**Scale/Scope**: 4 pages (Dashboard, Login, Sign Up, Sidebar layout), ~15 component files modified/created

## Constitution Check

*GATE: Constitution is template (not customized) — no specific gates to enforce. Proceeding with standard SDD practices.*

- Smallest viable diff: YES — incremental enhancements to existing components
- No hardcoded secrets: YES — no secrets involved (frontend-only changes)
- Test coverage: REQUIRED — TR-013 through TR-021 per spec

## Project Structure

### Documentation (this feature)

```text
specs/004-ai-chat-todo/
├── plan.md              # This file
├── research.md          # Phase 0 output (R-001 through R-022)
├── data-model.md        # Phase 1 output (existing, no UI/UX changes needed)
├── quickstart.md        # Phase 1 output (existing)
├── contracts/           # Phase 1 output (existing)
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (frontend only)

```text
phase-03-ai-chat/frontend/src/
├── app/
│   ├── globals.css                    # MODIFY: Add floating label styles, strength meter styles
│   ├── layout.tsx                     # MODIFY: Add dark mode initialization script
│   ├── (auth)/
│   │   ├── sign-in/page.tsx           # MODIFY: Floating labels, strength meter, remove social login
│   │   └── sign-up/page.tsx           # MODIFY: Floating labels, strength meter, remove social login
│   └── (dashboard)/
│       ├── layout.tsx                 # MODIFY: Sidebar persistence, dark mode toggle migration
│       └── page.tsx                   # MODIFY: AI Insights panel, quick-add, drag-and-drop
├── components/
│   ├── ui/
│   │   ├── Input.tsx                  # MODIFY: Add floatingLabel prop
│   │   ├── Button.tsx                 # VERIFY: Click/press animations (already has transition-all)
│   │   ├── PasswordStrengthMeter.tsx  # CREATE: New component
│   │   └── index.ts                   # MODIFY: Export new component
│   ├── layout/
│   │   ├── Sidebar.tsx                # MODIFY: Tooltip, persistence, dark mode toggle, collapsible sections
│   │   └── Header.tsx                 # MODIFY: Remove dark mode toggle (moved to sidebar)
│   ├── dashboard/
│   │   ├── AIInsightsPanel.tsx        # CREATE: Productivity score, trends display
│   │   ├── QuickAddInput.tsx          # CREATE: Autocomplete task creation
│   │   ├── DraggableTaskList.tsx      # CREATE: Drag-and-drop task reordering
│   │   ├── TaskCardWithActions.tsx    # CREATE: Task card with hover quick-actions
│   │   └── StatCard.tsx               # VERIFY: Existing component — may need minor styling updates
│   └── tasks/
│       └── TaskCard.tsx               # MODIFY: Add hover quick-action buttons
└── lib/
    ├── password-strength.ts           # CREATE: Password strength calculation utility
    └── utils.ts                       # VERIFY: cn() utility already exists
```

**Structure Decision**: Frontend-only modifications within the existing Next.js App Router structure. No new pages — all upgrades happen within existing page components and the component library.

## Complexity Tracking

No violations — all changes are incremental to existing structure.

---

## Architecture: Component Upgrade Strategy

### Phase A: Foundation Layer (Design System & Shared Components)

These changes underpin all subsequent page upgrades and must be completed first.

#### A1. Floating Label Input Enhancement

**File**: `src/components/ui/Input.tsx` (modify)
**Spec refs**: FR-041, FR-046

**Current state**: Static label above input field (lines 55-62).

**Target state**: New `floatingLabel?: boolean` prop. When true:
- Label is positioned absolutely inside the input field
- On focus or when input has content, label animates to top-left with smaller font
- Uses Tailwind `peer` utility for CSS-only animation

**Technical approach**:
```
Input.tsx:
  if (floatingLabel) {
    - Render <input> with `peer` class and `placeholder=" "` (space placeholder)
    - Render <label> with position: absolute, pointer-events-none
    - Apply peer-focus:translate-y-[-100%] peer-focus:scale-75
    - Apply peer-[:not(:placeholder-shown)]:translate-y-[-100%] peer-[:not(:placeholder-shown)]:scale-75
    - Transition: transform 200ms ease-out
  } else {
    - Existing behavior unchanged
  }
```

**Files touched**: `Input.tsx`, `globals.css` (for peer-placeholder-shown support if needed)

#### A2. Password Strength Meter

**File**: `src/components/ui/PasswordStrengthMeter.tsx` (create)
**Spec refs**: FR-043, FR-047
**Utility**: `src/lib/password-strength.ts` (create)

**Algorithm** (from R-018):
- Character type detection: uppercase, lowercase, digit, symbol
- Strength thresholds: Weak (<6 or 1 type), Fair (>=6, 2+ types), Good (>=8, 3+ types), Strong (>=10, 4 types)

**Component structure**:
```
PasswordStrengthMeter:
  Props: { password: string }
  Renders:
    - 4-segment bar (colored segments fill based on level)
    - Text label: "Weak" | "Fair" | "Good" | "Strong"
    - Colors from design tokens: error, warning, #84CC16, success
```

#### A3. Button Animation Verification

**File**: `src/components/ui/Button.tsx` (verify/minor modify)
**Spec refs**: FR-044, FR-051

**Current state**: Has `transition-all duration-150 ease-out`, hover states, and `active:bg-*` classes.

**Gap**: Missing explicit `active:scale-[0.98]` for click/press animation per FR-044.

**Change**: Add `active:scale-[0.98]` to the base styles for a subtle press effect.

### Phase B: Login Page Upgrade (US-13)

**File**: `src/app/(auth)/sign-in/page.tsx` (modify)
**Spec refs**: FR-041, FR-042, FR-043, FR-044, FR-045

**Current state analysis** (sign-in/page.tsx:0-196):
- Uses `Input` with static labels (label prop)
- Has show/hide password toggle
- Has "Remember me" and "Forgot password" links
- Has Google/GitHub social login buttons (lines 171-192) — TO BE REMOVED
- Has basic form validation (email regex, password required)
- Error display via Input `error` prop

**Upgrade plan**:

1. **Switch to floating labels**: Replace `label="Email address"` with `floatingLabel` prop
2. **Add real-time email validation**: On `onChange`, provide hint below field for format issues (FR-042)
3. **Add password strength meter**: Render `PasswordStrengthMeter` below password input (FR-043)
4. **Remove social login section**: Delete lines 171-192 (Google/GitHub buttons and "Or continue with" divider) per R-022
5. **Add success state**: Brief green checkmark/text before redirect on successful login (FR-045)
6. **Button animation**: Verify `active:scale-[0.98]` propagates from Button component (FR-044)

### Phase C: Sign Up Page Upgrade (US-14)

**File**: `src/app/(auth)/sign-up/page.tsx` (modify)
**Spec refs**: FR-046, FR-047, FR-048, FR-049

**Current state analysis** (sign-up/page.tsx:0-199):
- Three fields: email, password, confirm password
- Has show/hide toggles on both password fields
- Has Google/GitHub buttons (lines 175-195) — TO BE REMOVED
- Basic validation (email regex, password length >=8, confirm match)
- Uses `PageLoader` for loading state (replaces entire form)

**Upgrade plan**:

1. **Switch to floating labels**: Apply `floatingLabel` prop to all three inputs
2. **Add password strength meter**: Below password input (FR-047)
3. **Add email-taken detection**: Display error with "Sign in instead" link when 409 returned (FR-048)
4. **Add inline loading state**: Replace full-page loader with `isLoading` prop on Button (FR-049). The Button component already supports `isLoading`.
5. **Remove social login section**: Delete Google/GitHub buttons and divider per R-022

### Phase D: Dashboard Upgrade (US-11)

**File**: `src/app/(dashboard)/page.tsx` (modify)
**New files**: `AIInsightsPanel.tsx`, `QuickAddInput.tsx`, `DraggableTaskList.tsx`, `TaskCardWithActions.tsx`
**Spec refs**: FR-030 through FR-034

**Current state analysis** (page.tsx:0-162):
- Mock data with 4 tasks
- WelcomeBanner, QuickActions, StatCard grid, RecentTasks, Upcoming Events
- No AI Insights, no drag-and-drop, no quick-add autocomplete, no hover quick-actions

**Upgrade plan**:

1. **AI Insights Panel** (`AIInsightsPanel.tsx`):
   - Compute from task data: completed count, overdue count, 7-day productivity score
   - Display as a card with mini bar/circle chart for productivity percentage
   - Empty state: onboarding message when no tasks exist (edge case)
   - Position: Top of dashboard, full-width, alongside or replacing existing StatCard grid

2. **Quick-Add Input** (`QuickAddInput.tsx`):
   - Text input at top of dashboard with submit on Enter
   - Autocomplete dropdown filtered from existing task titles
   - Keyboard navigation: ArrowUp/Down to select, Enter to confirm, Escape to close
   - On submit: calls task create API and optimistically adds to list

3. **Draggable Task List** (`DraggableTaskList.tsx`):
   - Wraps task cards with HTML5 DnD API
   - `draggable` attribute on each card
   - `onDragStart`, `onDragOver`, `onDrop` handlers for reorder
   - Touch fallback: move-up/move-down buttons visible on mobile
   - Persists order via API call on drop

4. **Task Card with Quick Actions** (`TaskCardWithActions.tsx`):
   - Extends existing `TaskCard` pattern
   - On hover: fade-in overlay with edit, delete, mark-complete buttons
   - On mobile: always-visible action buttons (no hover)
   - Smooth fade-in animation (150ms ease-out)

### Phase E: Sidebar Enhancement (US-12)

**File**: `src/components/layout/Sidebar.tsx` (modify)
**Spec refs**: FR-035 through FR-040

**Current state analysis** (Sidebar.tsx:0-200):
- Already has collapse/expand, active item highlighting, mobile overlay
- Nav items: Dashboard, Tasks, Calendar, Chat (main) + Settings (bottom)
- User section with avatar and sign-out
- Smooth transitions on collapse

**Upgrade plan**:

1. **Add tooltips on collapsed state**: When `isCollapsed`, add `title` attribute to nav links showing the label (FR-036). Consider using a `data-tooltip` with CSS for styled tooltips.

2. **Dark mode toggle migration**: Move dark mode toggle from `Header.tsx` to sidebar bottom section (above user section) (FR-039). Remove from Header.

3. **Sidebar state persistence**: Store `isCollapsed` in localStorage. Read on initial render. Update on toggle (FR-058).

4. **Collapsible subsections**: The spec mentions "collapsible sections: Dashboard, Projects, AI Insights, Settings" (FR-035). The current nav has flat items. Add section headers that can be expanded/collapsed:
   - **Main**: Dashboard, Tasks, Calendar, Chat
   - **Tools**: AI Insights (link to chat with analytics prompt)
   - **System**: Settings

5. **Responsive icon-only collapse**: Already implemented for `lg:` breakpoint. Verify `768px` tablet behavior (FR-040).

### Phase F: Design System Consistency (US-15)

**Spec refs**: FR-050 through FR-055

**Approach**: Audit pass across all modified pages to ensure:

1. **Color palette consistency** (FR-050): All pages use design tokens from `globals.css` `:root` — no hardcoded hex values in components.

2. **Interactive states** (FR-051): Every button, link, input, and sidebar item has visible hover, active/click, and focus states. Audit each component.

3. **Animation timing** (FR-052): All transitions use `--transition-fast` (150ms), `--transition-normal` (200ms), or `--transition-slow` (300ms). No arbitrary durations.

4. **Responsive breakpoints** (FR-053): Verify layout at 1200px+, 768px-1199px, <768px per US-15 scenarios.

5. **Keyboard navigation** (FR-054): Tab through all interactive elements on each page. Ensure visible focus rings.

6. **Contrast ratios** (FR-055): Run axe-core or Lighthouse accessibility audit. Fix any contrast failures.

### Phase G: Dark Mode Persistence & FOUC Prevention

**Files**: `src/app/layout.tsx` (modify), sidebar (already in Phase E)
**Spec refs**: FR-057

**Approach**:
1. Add inline `<script>` in `layout.tsx` `<head>` that reads `localStorage.getItem('theme')` and applies `dark` class before React hydration.
2. This prevents flash of wrong theme (FOUC) on page load.
3. Dark mode toggle (moved to sidebar in Phase E) writes to localStorage.

---

## Dependency Order

```
Phase A (Foundation) → Phase B (Login) ─┐
                     → Phase C (Sign Up) ├─→ Phase F (Design Audit) → Phase G (Dark Mode Persistence)
                     → Phase D (Dashboard)┘
                     → Phase E (Sidebar) ─┘
```

- **Phase A** must complete first (shared components used by B, C, D)
- **Phases B, C, D, E** can proceed in parallel after A
- **Phase F** is an audit pass after all pages are upgraded
- **Phase G** is the final polish

---

## Key Decisions Summary

| Decision | Choice | Rationale | Research Ref |
|----------|--------|-----------|--------------|
| Floating labels | Tailwind `peer` CSS-only | No new dependency | R-017 |
| Password strength | Custom client-side algorithm | Avoids ~350KB zxcvbn | R-018 |
| Productivity score | Frontend-computed 7-day ratio | No backend change needed | R-019 |
| Drag-and-drop | HTML5 DnD API | Lightweight, single-list | R-020 |
| Quick-add autocomplete | Custom filtered dropdown | Client-side, instant | R-021 |
| Social login | Deferred (removed) | No backend OAuth support | R-022 |
| Dark mode persistence | localStorage + head script | Prevents FOUC | R-014 |
| Sidebar tooltips | Native `title` attr / CSS tooltip | No dependency | R-013 |

---

## Risk Analysis

1. **HTML5 DnD on touch devices**: Mitigation — move-up/move-down button fallback on mobile (spec edge case).
2. **Floating label accessibility**: Risk that screen readers may not announce the label correctly when it's positioned absolutely. Mitigation — keep `aria-label` on the input and ensure the `<label>` has proper `htmlFor` association.
3. **Performance of 60fps animations**: Mitigation — use only `transform` and `opacity` properties for animations (GPU-composited). Avoid animating `width`, `height`, `margin`, or `padding`.

---

## Files Changed Summary

| File | Action | Phase |
|------|--------|-------|
| `components/ui/Input.tsx` | Modify | A |
| `components/ui/PasswordStrengthMeter.tsx` | Create | A |
| `components/ui/Button.tsx` | Minor modify | A |
| `components/ui/index.ts` | Modify | A |
| `lib/password-strength.ts` | Create | A |
| `app/globals.css` | Modify | A |
| `app/(auth)/sign-in/page.tsx` | Modify | B |
| `app/(auth)/sign-up/page.tsx` | Modify | C |
| `app/(dashboard)/page.tsx` | Modify | D |
| `components/dashboard/AIInsightsPanel.tsx` | Create | D |
| `components/dashboard/QuickAddInput.tsx` | Create | D |
| `components/dashboard/DraggableTaskList.tsx` | Create | D |
| `components/dashboard/TaskCardWithActions.tsx` | Create | D |
| `components/layout/Sidebar.tsx` | Modify | E |
| `components/layout/Header.tsx` | Modify | E |
| `app/(dashboard)/layout.tsx` | Modify | E, G |
| `app/layout.tsx` | Modify | G |
