# Component Extraction Reference (create-component / update-component)

Read this right before converting a codebase component into a reusable Superdesign DraftComponent — i.e. Step 2.5's conversion step in [SUPERDESIGN.md](SUPERDESIGN.md), or any `create-component`/`update-component` call. Command flags live in the COMMAND CONTRACT in [SUPERDESIGN.md](SUPERDESIGN.md).

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
  <svg class="w-6 h-6"><!-- actual logo SVG --></svg>
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
