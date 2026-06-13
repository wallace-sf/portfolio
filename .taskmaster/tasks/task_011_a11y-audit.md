# Task ID: 11

**Title:** Add aria-controls to Accordion Header button

**Status:** pending

**Dependencies:** None

**Priority:** low

**Description:** Add aria-controls attribute to the Accordion Header button (line 19) that references the associated Body panel's id, and add the corresponding id to the Body element, per WAI-ARIA Authoring Practices for the Accordion Pattern.

**Details:**

**Current Issue:**
The Accordion Header button (`packages/ui/src/Control/Accordion/Header/index.tsx:17-27`) has `aria-expanded={expanded}` but is missing `aria-controls`, which violates WAI-ARIA Authoring Practices for the Accordion Pattern. According to the specification, the accordion header button must have `aria-controls` pointing to the id of the region element it controls so screen readers can programmatically associate the button with its panel.

**Root Cause Analysis:**

1. **Missing aria-controls** (Header/index.tsx:19): The `<button>` has `aria-expanded` but no `aria-controls` attribute. Screen readers cannot identify which panel the button controls.

2. **Missing id on Body** (Body/index.tsx:25): The Body's container `<div>` has no `id` attribute that the Header's `aria-controls` could reference.

3. **No id management in context** (context.ts): The `IAccordionContext` only tracks `expanded: boolean` and `toggle?: () => void`. There's no mechanism to generate or share a stable id between Header and Body components.

**Implementation Plan:**

**Step 1: Update AccordionContext to include panelId**

File: `packages/ui/src/Control/Accordion/context.ts`

```typescript
export interface IAccordionContext {
  expanded: boolean;
  toggle?: () => void;
  panelId: string; // Add this line
}

export const AccordionContext = createContext<IAccordionContext>({
  expanded: false,
  panelId: '', // Add default value
});
```

**Step 2: Generate panelId in Accordion Root**

File: `packages/ui/src/Control/Accordion/Root/index.tsx`

```typescript
import { FC, ReactNode, useMemo, useId } from 'react'; // Add useId import

export const Root: FC<IAccordionRootProps> = ({ children }) => {
  const [expanded, toggle] = useToggle(false);
  const panelId = useId(); // Generate stable unique id

  const value = useMemo(
    () => ({ expanded, toggle, panelId }), // Add panelId
    [expanded, toggle, panelId]
  );

  return (
    <AccordionProvider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AccordionProvider>
  );
};
```

**Step 3: Add aria-controls to Header button**

File: `packages/ui/src/Control/Accordion/Header/index.tsx`

```typescript
export const Header: FC<IHeaderProps> = ({ children, className }) => {
  const { expanded, toggle, panelId } = useAccordion(); // Add panelId

  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={panelId} // Add this line
      className={classNames(
        'flex flex-row justify-between items-center w-full',
        className,
      )}
      onClick={toggle}
    >
      {children}
    </button>
  );
};
```

**Step 4: Add id to Body container**

File: `packages/ui/src/Control/Accordion/Body/index.tsx`

```typescript
export const Body: FC<IBodyProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { expanded, panelId } = useAccordion(); // Add panelId

  const style = useMemo(
    () => ({
      maxHeight: expanded ? `${ref.current?.scrollHeight ?? 0}px` : '0px',
    }),
    [expanded],
  );

  return (
    <div
      id={panelId} // Add this line
      ref={ref}
      style={style}
      className={classNames(
        'overflow-hidden transition-all duration-300 ease-in-out',
        className,
      )}
    >
      {children}
    </div>
  );
};
```

**Why React.useId():**
- Generates stable, unique ids across server and client renders (SSR-safe)
- No id collisions when multiple Accordion instances exist on the same page
- No manual id prop management required by consumers (e.g., SkillAccordion.tsx doesn't need to pass an id)

**Files Modified:**
1. `packages/ui/src/Control/Accordion/context.ts` - Add `panelId: string` to interface
2. `packages/ui/src/Control/Accordion/Root/index.tsx` - Generate `panelId` with `useId()`
3. `packages/ui/src/Control/Accordion/Header/index.tsx` - Add `aria-controls={panelId}`
4. `packages/ui/src/Control/Accordion/Body/index.tsx` - Add `id={panelId}`

**Test Strategy:**

**Automated Testing:**

1. **Pa11y/Axe Accessibility Audit:**
   - Ensure dev server is running: `pnpm dev` (port 3000)
   - Run Pa11y CI: `pnpm run pa11y` or `pa11y-ci`
   - **Expected result:** 0 violations related to accordion ARIA requirements on About page URLs:
     - `http://localhost:3000/en-US/about`
     - `http://localhost:3000/pt-BR/sobre`
     - `http://localhost:3000/es/acerca-de`

2. **Unit Tests (create if needed):**
   - File: `packages/ui/src/Control/Accordion/__tests__/Accordion.test.tsx`
   - Test 1: "Header button should have aria-controls matching Body panel id"
     ```typescript
     const { getByRole } = render(
       <Accordion.Root>
         <Accordion.Header>Toggle</Accordion.Header>
         <Accordion.Body>Content</Accordion.Body>
       </Accordion.Root>
     );
     const button = getByRole('button');
     const panelId = button.getAttribute('aria-controls');
     expect(panelId).toBeTruthy();
     const panel = document.getElementById(panelId!);
     expect(panel).toBeInTheDocument();
     ```
   - Test 2: "Each Accordion instance should have unique panel ids"
     ```typescript
     const { getAllByRole } = render(
       <>
         <Accordion.Root><Accordion.Header>A</Accordion.Header><Accordion.Body>A</Accordion.Body></Accordion.Root>
         <Accordion.Root><Accordion.Header>B</Accordion.Header><Accordion.Body>B</Accordion.Body></Accordion.Root>
       </>
     );
     const buttons = getAllByRole('button');
     const id1 = buttons[0].getAttribute('aria-controls');
     const id2 = buttons[1].getAttribute('aria-controls');
     expect(id1).not.toBe(id2);
     ```

**Manual Testing:**

1. **Screen Reader Testing (NVDA/JAWS on Windows, VoiceOver on macOS):**
   - Navigate to `http://localhost:3000/en-US/about` (About page)
   - Scroll to "Professional Experience" section
   - Tab to the first experience card's "Skills" accordion toggle button
   - **Expected announcement:** "Skills, button, collapsed, controls [panel-id]" (exact wording varies by screen reader)
   - Activate the button (Space/Enter)
   - **Expected announcement:** "Skills, button, expanded, controls [panel-id]"
   - Verify screen reader announces the association between button and panel

2. **Visual Regression:**
   - Visit About page in all 3 locales: `/en-US/about`, `/pt-BR/sobre`, `/es/acerca-de`
   - Expand and collapse multiple experience accordions
   - **Expected:** No visual changes; accordions function identically to pre-fix behavior

3. **Inspect DOM (Browser DevTools):**
   - Inspect the first SkillAccordion on About page
   - Verify Header `<button>` has `aria-controls="[some-unique-id]"`
   - Verify Body container `<div>` has matching `id="[same-unique-id]"`
   - Repeat for multiple experience cards to confirm unique ids

**Acceptance Criteria:**
- ✅ Header button has `aria-controls` attribute
- ✅ `aria-controls` value matches Body panel's `id`
- ✅ Each Accordion instance generates unique panel ids (no collisions)
- ✅ Pa11y reports 0 ARIA violations on About page
- ✅ Screen readers announce button-panel association correctly
- ✅ No visual or functional regressions
