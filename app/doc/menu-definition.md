# Menu definition YAML

Menu YAML files describe the navigation fragments that get rendered into HTML and dropped into page templates wherever `<menu id="..."/>` appears.

## Location and naming
- Files live at `content/cms/sources/<lang>/menus/*.yaml`.
- The filename (without extension) becomes the menu id used in templates, e.g. `topbar.yaml` -> `<menu id="topbar" />`.
- `template` must point to an existing Nunjucks file under `content/cms/templates/<template>.njs` (for menus these are `menu-*.njs`).

## Rendering context
- Menus are rendered before pages. Each YAML file is validated against `MenuZodSchema` and then rendered with its `template`.
- The template receives the YAML fields (`template`, optional `class`, `menu`) plus `lang` and `translations` for the current locale. The `menu` array is the main payload used by `menu-topbar.njs` and `menu-footer.njs`.

## YAML structure
Top level:
```yaml
template: menu-topbar   # required
class: optional-css-class
menu: []                # required array, order preserved
```

Each entry inside `menu` must match one of the shapes below:

- **SimpleMenuItem**  
  ```yaml
  - title: Blog
    url: "@{en/blog}"
  ```

- **SimpleSubMenu** – titled dropdown containing simple items.  
  ```yaml
  - title: Projects
    items:
      - title: RandomGen
        url: "@{en/randomgen}"
  ```

- **RichSubMenu** – multi-column mega menu.  
  ```yaml
  - title: My expertise
    url: "@{en/prog-experience}"      # optional
    text: "Summary shown near the title"   # optional
    columns:
      - title: Column heading (HTML allowed)
        url: optional-column-link
        text: optional-column-lead
        colspan: 2           # optional, 1–6, default 1
        repeatTitle: false   # optional, default false
        items:
          - title: Parking systems
            url: "@{en/prog-parking-systems}"
            text: Optional description
  ```
  Each `items` entry inside a column uses `title` + `url` with optional `text`.

- **SeparatorMenuItem** – decorative separator.  
  ```yaml
  - separator: "|"
  ```

- **LabelMenuItem** – non-clickable label.  
  ```yaml
  - label: "Hobby: "
  ```

Only one of the above keys should appear on a single element. Keep the array ordered as you want it rendered.
