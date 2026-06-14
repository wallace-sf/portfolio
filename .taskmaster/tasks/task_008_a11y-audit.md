# Task ID: 8

**Title:** Add fieldset and legend to RadioGroup component for semantic grouping

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Update RadioGroup component to render a fieldset element with a required legend prop to provide semantic grouping for radio buttons per WAI-ARIA Radio Group Pattern requirements. This ensures screen readers announce the group context for each radio option.

**Details:**

**Current Issue:**
The RadioGroup component (`packages/ui/src/Control/RadioGroup/index.tsx`) currently renders a generic container element (default: `div`) with no semantic grouping. According to WAI-ARIA Authoring Practices for the Radio Group Pattern, a group of radio buttons must be identified by a group label so screen readers can announce the group context for each option.

**Root Cause Analysis:**

1. **Default container element** (line 11): `containerElementType = 'div'` renders a non-semantic container
2. **Missing group label**: No `legend` or `aria-labelledby` attribute to identify the group
3. **Current usage**: Both `LanguageSelector` (`apps/site/src/components/Layout/SideNavigation/LanguageSelector.tsx:58-66`) and `ThemeToggle` (`apps/site/src/components/Layout/SideNavigation/ThemeToggle.tsx:58-66`) pass `containerElementType="ul"` which also lacks semantic grouping for form controls

**Implementation Approach:**

**Option 1: Default to fieldset with required legend (Recommended)**

1. Update `RadioGroupProps` interface in `packages/ui/src/Control/RadioGroup/types.ts`:
   - Change `containerElementType` default from `'div'` to `'fieldset'`
   - Add a required `legend` prop of type `string | ReactNode`
   - Keep `containerElementType` optional to maintain backwards compatibility

2. Update `RadioGroup` component in `packages/ui/src/Control/RadioGroup/index.tsx`:
   - When `containerElementType` is `'fieldset'`, render a `<legend>` element as the first child with the `legend` prop content
   - When `containerElementType` is not `'fieldset'`, add `role='group'` and `aria-label` or `aria-labelledby` attribute

3. Update existing usage sites:
   - `LanguageSelector.tsx:58-66`: Remove `containerElementType="ul"` or add `legend` prop with value from `t('language')`
   - `ThemeToggle.tsx:58-66`: Remove `containerElementType="ul"` or add `legend` prop with value from `t('theme')`

**Option 2: Add role='group' with aria-labelledby**

1. Update `RadioGroupProps` interface to add optional `groupLabel` or `aria-labelledby` prop
2. When `containerElementType` is not `'fieldset'`, add `role='group'` and `aria-label={groupLabel}` or `aria-labelledby` attribute
3. This approach is less semantically correct for form controls but maintains current HTML structure

**Recommended Solution: Option 1**

```typescript
// packages/ui/src/Control/RadioGroup/types.ts
export interface RadioGroupProps {
  containerElementType?: keyof ReactHTML;
  legend: string | ReactNode;  // NEW: required for semantic grouping
  children: RadioGroupChildrenFn | null;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// packages/ui/src/Control/RadioGroup/index.tsx
export const RadioGroup: FC<RadioGroupProps> = ({
  className,
  name,
  value,
  containerElementType = 'fieldset',  // Changed default
  legend,
  onChange,
  children,
}) => {
  const isFieldset = containerElementType === 'fieldset';
  
  return createElement(
    containerElementType,
    { 
      className,
      ...(isFieldset ? {} : { role: 'group', 'aria-label': typeof legend === 'string' ? legend : undefined })
    },
    <>
      {isFieldset && <legend className="sr-only">{legend}</legend>}
      {children instanceof Function ? children({ name, value, onChange }) : children}
    </>
  );
};
```

**Files to Modify:**

1. `packages/ui/src/Control/RadioGroup/types.ts` - Add `legend` prop to interface
2. `packages/ui/src/Control/RadioGroup/index.tsx` - Update component logic to render `fieldset` with `legend` or add `role='group'`
3. `apps/site/src/components/Layout/SideNavigation/LanguageSelector.tsx:58-66` - Add `legend={t('language')}` prop or remove `containerElementType="ul"`
4. `apps/site/src/components/Layout/SideNavigation/ThemeToggle.tsx:58-66` - Add `legend={t('theme')}` prop or remove `containerElementType="ul"`

**Note:** TechnologiesModal does not currently use RadioGroup, so no changes needed there. The task description's mention of TechnologiesModal may be outdated or a future integration point.

**Test Strategy:**

**Automated Testing:**

1. **Pa11y/Axe Accessibility Audit:**
   - Ensure dev server is running: `pnpm dev` (port 3000)
   - Run Pa11y CI against all 21 URLs in `.pa11yci.json`: `pnpm run pa11y` or `pa11y-ci`
   - **Expected result:** 0 violations related to missing form labels or group context
   - Verify that axe runner reports no issues with radio group labeling

2. **Screen Reader Testing (Manual):**
   - Open `/en-US` page in browser with screen reader enabled (NVDA, JAWS, or VoiceOver)
   - Navigate to SideNavigation and expand "Language" or "Theme" sections
   - **Expected behavior:** Screen reader announces the group name ("Language" or "Theme") before announcing each radio option
   - Example: "Language group, English radio button, checked" instead of just "English radio button, checked"

3. **Visual Regression Testing:**
   - Verify that `fieldset` and `legend` do not introduce unwanted visual changes
   - If `legend` is visible, add CSS class `sr-only` or equivalent to visually hide it while keeping it accessible to screen readers
   - Test both light and dark themes to ensure no layout breaks

4. **Unit Tests:**
   - Add test cases in `packages/ui/src/Control/RadioGroup/RadioGroup.test.tsx` (create if missing):
     - Test that `fieldset` element is rendered when `containerElementType` is `'fieldset'` (default)
     - Test that `legend` element contains the correct text/content
     - Test that `role='group'` and `aria-label` are applied when `containerElementType` is not `'fieldset'`
     - Test backwards compatibility when `containerElementType="ul"` is used

5. **Integration Tests:**
   - Update tests in `apps/site/tests/components/View/SideNavigation/LanguageSelector.test.tsx` and `ThemeToggle.test.tsx`:
     - Verify that `legend` prop is passed correctly
     - Verify that screen readers can access the group label via `getByRole('group', { name: 'Language' })`

**Manual Verification Checklist:**

- [ ] `/en-US` page: LanguageSelector renders fieldset with legend "Language"
- [ ] `/en-US` page: ThemeToggle renders fieldset with legend "Theme"
- [ ] Screen reader announces group context for each radio option
- [ ] No visual layout changes or breaks
- [ ] Pa11y CI passes with 0 violations
- [ ] All existing RadioGroup usage sites updated and tested
