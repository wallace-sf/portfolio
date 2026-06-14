# Task ID: 7

**Title:** Remove invalid ARIA attributes from Input and TextArea components

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Remove aria-placeholder and aria-disabled attributes from Input and TextArea components. Both attributes are invalid per ARIA 1.2 specification: aria-placeholder does not exist, and aria-disabled is redundant when the native disabled attribute is present.

**Details:**

**Current Issue:**
Two UI components in `packages/ui/src/Control/` pass invalid ARIA attributes that violate ARIA 1.2 specifications and create redundant accessibility information:

1. **Input component** (`packages/ui/src/Control/Input/index.tsx`, lines 17-18):
   - `aria-disabled={props.disabled}` - redundant with native `disabled` attribute
   - `aria-placeholder={props.placeholder}` - not a valid ARIA attribute

2. **TextArea.Base component** (`packages/ui/src/Control/TextArea/Base/index.tsx`, lines 32-33):
   - `aria-disabled={props.disabled}` - redundant with native `disabled` attribute
   - `aria-placeholder={props.placeholder}` - not a valid ARIA attribute

**Root Cause:**
- `aria-placeholder` does not exist in the ARIA 1.2 specification. Browsers and assistive technologies either ignore it or handle it as undefined behavior.
- `aria-disabled` is redundant when the native HTML `disabled` attribute is already present (which both components spread via `{...props}`). The accessibility tree automatically exposes the disabled state from the native attribute.

**Implementation Steps:**

1. **Edit Input component** (`packages/ui/src/Control/Input/index.tsx`):
   - Remove lines 17-18 (`aria-disabled` and `aria-placeholder`)
   - Keep the native `disabled` and `placeholder` attributes (they're spread via `{...props}`)
   - The corrected component should look like:
   ```tsx
   const Component: ForwardRefRenderFunction<
     HTMLInputElement | null,
     InputProps
   > = ({ ...props }, ref) => {
     return (
       <input
         {...props}
         ref={ref}
         onChange={props.disabled ? undefined : props.onChange}
         onBlur={props.disabled ? undefined : props.onBlur}
       />
     );
   };
   ```

2. **Edit TextArea.Base component** (`packages/ui/src/Control/TextArea/Base/index.tsx`):
   - Remove lines 32-33 (`aria-disabled` and `aria-placeholder`)
   - Keep the native `disabled` and `placeholder` attributes (they're spread via `{...props}`)
   - The corrected component should look like:
   ```tsx
   return (
     <textarea
       {...props}
       ref={ref}
       onChange={props.disabled ? undefined : props.onChange}
       onBlur={props.disabled ? undefined : props.onBlur}
       className={classNames(
         // ... existing className logic
       )}
     />
   );
   ```

3. **Verify no other components use these invalid attributes:**
   - The Grep search confirms only Input and TextArea components use `aria-placeholder` and `aria-disabled`
   - No further changes needed in other components

**ARIA 1.2 Specification References:**
- Valid ARIA attributes: https://www.w3.org/TR/wai-aria-1.2/#state_prop_def
- `aria-placeholder` is not listed in the specification
- `aria-disabled` should only be used on roles that don't have a native disabled state (e.g., custom widgets); native form controls should use the HTML `disabled` attribute

**Test Strategy:**

**Automated Testing:**

1. **Pa11y Accessibility Audit:**
   - Ensure dev server is running: `pnpm dev` (defaults to port 3000)
   - Run Pa11y CI: `pa11y-ci` (uses `.pa11yci.json` configuration with 21 URLs across 3 locales)
   - **Expected result:** 0 violations related to invalid ARIA attributes or redundant ARIA properties
   - Verify no new accessibility violations are introduced

2. **Unit Tests (if existing):**
   - Run UI package tests: `pnpm --filter @repo/ui test`
   - Verify Input and TextArea components still pass existing tests
   - **Expected result:** All existing tests continue to pass

**Manual Testing:**

1. **Inspect rendered HTML:**
   - Start dev server: `pnpm dev`
   - Open browser DevTools on any page with forms
   - Inspect `<input>` and `<textarea>` elements
   - **Expected result:** 
     - No `aria-placeholder` attribute present
     - No `aria-disabled` attribute present
     - Native `disabled` and `placeholder` attributes still present when props are passed

2. **Screen Reader Testing (optional but recommended):**
   - Test with NVDA (Windows) or VoiceOver (macOS)
   - Navigate to form fields with `disabled` and `placeholder` attributes
   - **Expected result:**
     - Screen reader announces placeholder text correctly (from native `placeholder`)
     - Screen reader announces disabled state correctly (from native `disabled`)
     - No duplicate or conflicting announcements

3. **Browser Accessibility Tree Inspection:**
   - Open DevTools → Accessibility panel
   - Inspect Input and TextArea elements
   - **Expected result:**
     - Disabled state properly reflected in accessibility tree
     - Placeholder description properly exposed
     - No invalid or redundant ARIA properties listed

**Regression Testing:**

1. Run full test suite: `pnpm test`
2. Verify no TypeScript errors: `pnpm types`
3. Verify linting passes: `pnpm lint:check`
4. **Expected result:** All checks pass with no errors
