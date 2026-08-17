# Component Extraction Reference (create-component / update-component)

Read this right before converting a codebase component into a reusable Superdesign DraftComponent — i.e. Step 2.5's conversion step in [SUPERDESIGN.md](SUPERDESIGN.md), or any `create-component`/`update-component` call. Run `create-component --help` / `update-component --help` for their flag sets.

## BRAND LOGO INVARIANT

Treat a real project logo as required content whenever the source component or requested design contains a logo position.

1. Before converting the component, resolve the appropriate logo selected by the source UI or user from the project's Brand Assets. On a cold flow, upload the selected local logo first with `--purpose brand --type logo`, a stable repo-relative `--key`, and a usage description. Keep both the returned `assetKey` and public `url`. On a warm flow, reuse the saved logo key; if its public URL is not already available in the working context, repeat the same stable-key upload so deduplication returns the canonical URL.
2. Hardcode that exact public `https://` URL in an `<img>` inside every logo-bearing template. Preserve the source alt text, dimensions, and layout treatment.
3. Never replace an available logo with initials, product-name text alone, an emoji, a generic icon, an invented SVG, or another placeholder. Text may accompany the logo only when the source UI does so.
4. Before `create-component` or `update-component`, inspect the finished HTML. If the source needs a logo and the template does not contain the resolved logo URL, stop and repair the template first.
5. If a logo becomes available after a reusable component was created, update every affected component before the next generation.

Allow a no-logo fallback only when the project has no appropriate logo Brand Asset and no deliberately selected local logo. Do not fabricate a brand mark; preserve a text-only identity when appropriate.

## PETITE-VUE TEMPLATE SPEC

When converting React components to Petite-Vue HTML templates for `create-component`:

### What to HARDCODE in the template (NOT props):

- Icon names and SVG markup
- Text labels, menu item names
- Image sources and alt text
- CSS classes and all styling
- Structural HTML and layout
- Color values, font sizes, spacing

### What to EXTRACT as props (ONLY these categories):

- **Active state**: `activeItem`, `isActive`, `currentTab` — indicates which page/section is selected
- **Navigation URLs**: `homeHref`, `searchHref`, `profileHref` — link destinations
- **Conditional visibility**: `showNotification`, `showBadge`, `isExpanded` — toggle elements
- **Dynamic counts**: `badgeCount`, `notificationCount` — numeric values that change

### Allowed Petite-Vue syntax:

- `{{ propName }}` — text interpolation
- `:href="propName"` — attribute binding
- `v-if="propName"` / `v-show="propName"` — conditional rendering
- `:class="{ 'active': activeItem === 'home' }"` — dynamic class binding
- `@click="$emit('name', payload)"` — event emission

### NOT allowed:

- `v-for` for navigation items (hardcode each item instead)
- `v-model` (no two-way binding)
- `v-html` (no raw HTML injection)
- Complex JavaScript expressions in templates

### Every prop MUST have a non-empty `defaultValue`.

### Output requirements:

- Valid HTML with Tailwind CSS classes
- Replace all CSS modules / styled-components with Tailwind utilities or inline styles
- Use Lucide icon CDN or inline SVGs for icons
- Include reasonable `previewWidth` and `previewHeight` estimates in the component description

### Example conversion:

**React source:**

```tsx
function NavBar({ activeItem = "home" }) {
  return (
    <nav className="flex items-center gap-4 px-6 py-3 bg-white border-b">
      <Logo />
      <Link
        to="/"
        className={cn("text-sm", activeItem === "home" && "font-bold")}
      >
        Home
      </Link>
      <Link
        to="/explore"
        className={cn("text-sm", activeItem === "explore" && "font-bold")}
      >
        Explore
      </Link>
    </nav>
  );
}
```

**Petite-Vue template:**

```html
<nav class="flex items-center gap-4 px-6 py-3 bg-white border-b">
  <img
    src="https://cdn.example.com/brand/logo.svg"
    alt="Project logo"
    class="h-6 w-6"
  />
  <a
    :href="homeHref"
    :class="{ 'font-bold': activeItem === 'home' }"
    class="text-sm"
    >Home</a
  >
  <a
    :href="exploreHref"
    :class="{ 'font-bold': activeItem === 'explore' }"
    class="text-sm"
    >Explore</a
  >
</nav>
```

**Props:**

```json
[
  { "name": "activeItem", "type": "string", "defaultValue": "home" },
  { "name": "homeHref", "type": "string", "defaultValue": "#" },
  { "name": "exploreHref", "type": "string", "defaultValue": "#" }
]
```
