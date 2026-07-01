# PRD: Close mobile side menu on menu item click

## Problem

On mobile, `SideNavigation` (`apps/site/src/components/Layout/SideNavigation/index.tsx`) opens as an overlay controlled by `useBoolean(false)` (`open`/`toggle`) at line 22, toggled only by the `Header` hamburger button. Clicking a menu item (page link, external link, or a theme/language option) does not close the menu — the user must tap the hamburger again.

## Scope

Close the mobile menu whenever the user acts on any menu item:

- `MenuItem.Item1` links (Home, Projects, About, Resume)
- `MenuItem.Item2.Link` / `MenuItem.Item2.ShortLink` (LinkedIn, GitHub, RSS)
- Selecting a `Radio` option inside the `ThemeToggle` or `LanguageSelector` expandables (i.e. their `RadioGroup`'s `onChange`)

Out of scope: any change to `Accordion` semantics. `ThemeToggle` and `LanguageSelector` remain two independent `Accordion.Root` instances — expanding one does not collapse the other. The "radio" behavior referenced in the original request is the existing `Radio`/`RadioGroup` used for selecting a theme/language inside each expandable, not a radio relationship between the two accordions.

Desktop is unaffected: `isOpen` is already gated by `!isDesktop && open`, so calling close on desktop is a no-op in practice, but consumers don't need to know or care about breakpoint — they just declare "close on selection."

## Design

### State reuse

No new state. `SideNavigation` already holds the open/closed state via `useBoolean(false)` at line 22. Swap the destructure to also pull `setFalse`:

```ts
const { value: open, toggle, setFalse: closeMenu } = useBoolean(false);
```

### Declarative propagation via Context

Add `SideNavigationContext` (React context) created and provided by `SideNavigation`, exposing `{ closeMenu: () => void }`. A `useSideNavigation()` hook reads it (with an `invariant` guard, following the existing `useAccordion` pattern in `packages/ui/src/Control/Accordion/useAccordion.ts`).

Consumers call `closeMenu()` from their existing `onClick`/`onChange` handlers — they don't manage or know about open/closed state, just declare "this action closes the menu":

- `MenuItem/Item1/index.tsx`: add `onClick={closeMenu}` on the `<Link>`.
- `MenuItem/Item2/Link/index.tsx` and `MenuItem/Item2/ShortLink/index.tsx`: same, `onClick={closeMenu}` on `<NextLink>`.
- `ThemeToggle.tsx`: call `closeMenu()` inside `onChangeTheme`, after `setTheme(...)`.
- `LanguageSelector.tsx`: call `closeMenu()` inside `onChangeLanguage`, after `replace(...)`.

### Placement

The context lives alongside `SideNavigation` (`apps/site/src/components/Layout/SideNavigation/context.ts` + hook), not in `packages/ui`, since it's specific to this app-level navigation composition, not a reusable design-system primitive.

## Testing

Behavior-focused tests (no implementation details), per `docs/08-TESTING.md`:

- `Item1`, `Item2.Link`, `Item2.ShortLink`: clicking the link calls `closeMenu` from a mocked `SideNavigationContext`.
- `ThemeToggle`, `LanguageSelector`: selecting a radio option calls `closeMenu` in addition to the existing `setTheme`/`replace` side effect.
- `SideNavigation`: an integration-level test confirming that clicking a nested `Item1` link transitions `open` back to `false`.

## Non-goals

- No change to `Accordion` component or its context/hook.
- No change to desktop behavior.
- No new shared state beyond the existing `useBoolean`.
