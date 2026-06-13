# Task ID: 12

**Title:** Add fieldset and legend to ContactForm for semantic field grouping

**Status:** pending

**Dependencies:** None

**Priority:** medium

**Description:** Wrap the three field groups (name, email, message) in a fieldset element and convert the paragraph title into a legend element per WCAG Technique H71 to provide screen readers with accessible group context for form fields.

**Details:**

**Current Issue:**
The ContactForm component (`apps/site/src/features/contact/ContactForm/index.tsx`) renders a visual title as a `<p>` element (line 47) followed by three field groups wrapped in a generic `<div className="flex flex-col gap-y-6">` (line 51). According to WCAG Technique H71 and WAI/W3C form structure guidelines, when a form contains a logical grouping of related fields, wrapping them in a `<fieldset>` element with a `<legend>` provides an accessible group name that screen readers announce before each field, improving context and navigation for assistive technology users.

**Root Cause Analysis:**

1. **Paragraph as visual title** (line 47): `<p className="text-xl font-bold text-content-primary mb-6">{tForm('title')}</p>` provides visual hierarchy but no semantic grouping for screen readers.

2. **Generic div wrapper** (line 51): `<div className="flex flex-col gap-y-6">` contains three field groups but lacks semantic meaning. Screen reader users hear each label (name, email, message) without the context that these fields belong to a "Contact" or "Contact Information" group.

3. **Missing fieldset/legend pattern**: No `<fieldset>` or `<legend>` elements are used, despite this being a recommended pattern for grouping related form controls per WCAG H71 and ARIA form practices.

**Implementation Steps:**

1. **Replace the `<p>` title (line 47) with a `<legend>` element:**
   - Change `<p className="text-xl font-bold text-content-primary mb-6">{tForm('title')}</p>` to `<legend className="text-xl font-bold text-content-primary mb-6">{tForm('title')}</legend>`
   - The `<legend>` element must be the first child of the `<fieldset>` element.

2. **Wrap the field groups div (line 51) in a `<fieldset>` element:**
   - Insert `<fieldset>` before the legend (line 47).
   - Close `</fieldset>` after the field groups div closes (after line 113).
   - Move the legend inside the fieldset as the first child.

3. **Apply reset styles to fieldset:**
   - By default, browsers apply padding, margin, and border styles to `<fieldset>` elements.
   - Add Tailwind utility classes to the `<fieldset>` to reset these styles and maintain current visual appearance:
     - `className="border-0 p-0 m-0 min-w-0"` (border-0 removes default border, p-0 removes padding, m-0 removes margin, min-w-0 prevents min-width default from breaking flex layouts)

4. **Verify legend styling:**
   - The `<legend>` element inherits the same classes as the original `<p>` element (`text-xl font-bold text-content-primary mb-6`).
   - Test that the legend visually matches the current paragraph appearance.

5. **Do NOT modify the submitted/success state:**
   - The early return `<div>` (lines 34-43) that renders the success message does not need a fieldset, as it's a static message, not a form grouping.

**Code Example (lines 45-113):**

```tsx
return (
  <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
    <fieldset className="border-0 p-0 m-0 min-w-0">
      <legend className="text-xl font-bold text-content-primary mb-6">
        {tForm('title')}
      </legend>

      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-1">
          <Label htmlFor="name">{tForm('nameLabel')}</Label>
          {/* ... rest of name field ... */}
        </div>

        <div className="flex flex-col gap-y-1">
          <Label htmlFor="email">{tForm('emailLabel')}</Label>
          {/* ... rest of email field ... */}
        </div>

        <div className="flex flex-col gap-y-1">
          <Label htmlFor="message">{tForm('messageLabel')}</Label>
          {/* ... rest of message field ... */}
        </div>
      </div>
    </fieldset>

    <Button.Base
      type="submit"
      className="w-full xl:w-[216px] h-[46px] mt-6"
      disabled={isSubmitting}
    >
      {tForm('submit')}
    </Button.Base>
  </form>
);
```

**Accessibility Impact:**

- Screen reader users will hear the legend ("Contact Form" or localized equivalent) announced as context when navigating to each field within the fieldset.
- Improves form comprehension and navigation for assistive technology users.
- Aligns with WCAG 2.1 Level A Success Criterion 1.3.1 (Info and Relationships) and WCAG Technique H71.

**Files to Modify:**
- `apps/site/src/features/contact/ContactForm/index.tsx` (lines 45-113)

**Visual Regression:**
- No visual changes expected; the legend element should render identically to the paragraph element with the same Tailwind classes.
- The fieldset reset classes (`border-0 p-0 m-0 min-w-0`) prevent default browser styling from affecting the layout.

**Test Strategy:**

**Automated Testing:**

1. **Pa11y/Axe Accessibility Audit:**
   - Ensure dev server is running: `pnpm dev` (port 3000)
   - Run Pa11y CI against all 21 URLs in `.pa11yci.json`: `pnpm run pa11y` or `pa11y-ci`
   - **Expected result:** 0 violations related to missing form group labels or H71 compliance
   - **Specific check:** Axe should not report missing fieldset/legend for the ContactForm (if it was previously flagged)

2. **Unit Test Update** (`apps/site/tests/components/Forms/ContactForm/ContactForm.test.tsx`):
   - Add a new test to verify the fieldset and legend elements are rendered:
     ```tsx
     it('should render fieldset with legend for form field grouping', () => {
       render(<ContactForm />);
       const fieldset = screen.getByRole('group');
       expect(fieldset).toBeInTheDocument();
       expect(screen.getByText('ContactForm.title')).toBeInTheDocument();
       expect(screen.getByText('ContactForm.title').tagName).toBe('LEGEND');
     });
     ```
   - Run unit tests: `pnpm test ContactForm`

**Manual Testing:**

1. **Visual Regression:**
   - Start dev server: `pnpm dev` (port 3000)
   - Visit the Contact page in all 3 locales:
     - `http://localhost:3000/en-US` (scroll to contact section)
     - `http://localhost:3000/pt-BR`
     - `http://localhost:3000/es`
   - **Expected result:** The form title ("Contact Form" or localized) should appear visually identical to before (bold, large text, margin bottom)
   - **Expected result:** No border, padding, or layout changes around the form fields

2. **Screen Reader Testing (macOS VoiceOver):**
   - Enable VoiceOver: `Cmd + F5`
   - Navigate to the Contact form on `http://localhost:3000/en-US`
   - Use `VO + Right Arrow` to navigate through the form fields
   - **Expected result:** When entering the name field, VoiceOver should announce: "Contact Form, group. Name, edit text" (or localized equivalent)
   - **Expected result:** The legend ("Contact Form") should be announced as the group context before each field label within the fieldset
   - **Expected result:** No duplicate announcements or unexpected verbosity

3. **Screen Reader Testing (Windows NVDA):**
   - Enable NVDA
   - Navigate to the Contact form on `http://localhost:3000/en-US`
   - Use `Tab` to navigate through the form fields
   - **Expected result:** NVDA should announce the fieldset legend ("Contact Form") when entering the field group, providing context for each field

4. **Keyboard Navigation:**
   - Use `Tab` to navigate through all form fields (name, email, message, submit button)
   - **Expected result:** Focus order remains unchanged (name → email → message → submit)
   - **Expected result:** No unexpected focus traps or skipped elements

5. **Form Submission:**
   - Fill out the form with valid data and submit
   - **Expected result:** The mailto: link behavior remains unchanged
   - **Expected result:** The success message displays correctly (no fieldset, as it's not a form grouping)

**Acceptance Criteria:**

- [ ] Fieldset element wraps the three field groups (name, email, message)
- [ ] Legend element replaces the paragraph title and is the first child of the fieldset
- [ ] Legend visually matches the original paragraph styling (`text-xl font-bold text-content-primary mb-6`)
- [ ] No visual regression in form layout or spacing
- [ ] Pa11y/Axe audit passes with 0 fieldset/legend violations
- [ ] Screen readers announce the legend as group context for each field
- [ ] Unit test verifies fieldset role="group" and legend element presence
- [ ] Form submission and success message behavior unchanged
- [ ] No console errors or warnings in browser DevTools
