# Rendering process

On the application startup, the process of generating pages is started. Its point is to have all the HTML pages rendered.

The process starts in the `CmsService`'s `renderAll()` method. It calls `LibraryFactory.create()` for each language (as defined in `Lang`) and after it completes the `CmsService` holds a record of a `Library` for each language. In the `create` step, a `Locale` object is created passed to the factory method so that it has not only the language but also all the translations for it.

The `LibraryFactory.create()` asynchronically performs the following steps in order:

1. **Reading definitions ("defs") from the subdirectories** of `/content/cms/${lang}` directory. There are three of them:
    - `blocks`: contains named **static** block definitions intended to be used in multiple pages. An example of such a block would be "Under construction" warning block
    - `menus`: contains menu definitions
    - `pages`: contains page definitions

   Once a directory is read, the defs are passed to `createAll()` method of `BlockFactory`, `MenuFactory` and `PageFactory` respectively. In all cases, `def` is first validated (against `BlockZodSchema`, `MenuZodSchema` and `PageZodSchema` respectively) and then used to validated domain objects (subtypes of `Block`, `Menu`s and `Page`s respectively). In each case the factory passes the following arguments to the created objects:
    - services needed by domain objects,
    - the name of source file (would become a slug, handle by which the object is identified),
    - `def`,
    - `locale` (language + its translations)

   The `PageFactory` also passes metadata (`SitewideData`) that include media dir path, image default, brand details and base server address (origin).

   At this stage, we have created the library filled with domain objects: `Menu`s, `StaticBlock`s and `Page`s. Only the information from the `def` populate them. There are no connections between pages, menus and blocks. Data has not been rendered yet.

2. **Rendering the menus**: `Menu` objects get their `def`s rendered into HTML fragments. They will be inserted into the page template later. Menu rendering does not require nor support any blocks.

3. **Rendering the blocks**: using passed `Library`, `StaticBlock` objects get their `def`s rendered into HTML fragments. The `def` is passed to `TemplatingService` as-is except for `content` that is parsed by the `MarkdownService` first.

    At this point we return a `library` with rendered blocks and menus to the `CmsService`.

4. **rendering the pages**: using passed `library` with menus and static blocks already rendered into HTML. In the same step, RSS feed of "blog" category is constructed. 
   
   Page rendering process is multistage:
   - **data preparation** for use in the template - defaulting and supplementing with `SitewideData`
   - **pre-rendering** - the page gets rendered in multiple versions. Main version is rendered againts template defined in `def.template`, other are rendered against templates specified in `SitewideData.fragmentTemplates`. The latter are for HTML fragments used in page galleries and the like, generally simpler, trimmed down versions of the page.
   - **inserting menus** - each page version that includes `<menu id="..." />` markup has the corresponding rendered menu inserted from the `library`
   - **filling the slots** - if the page version includes `<slot id="..." />` markup, it gets expanded into slots. A **slot** is predefined, named place on the page that can host blocks. It can be any place in the HTML tree, not only content region but must be defined in the template.

     The blocks to be put in the slot have to be defined in the `def.slots[name]` as an array. They are instantiated into `Block` subtype objects and rendered appropriately by their subtype's `render()` method.
   - **inserting blocks** - apart from slots that offer putting blocks at predefined places, the page's `content` or `lead` can have `<block id="..." ... /> markup anywhere in their text and it will be expanded into a `Block` subtype as defined. The process is a bit more complicated than in slots because the block can be defined fully inline, have the simple `<block id="x" /> markup with details defined in `def.blocks['x']` or something in-between. Or - if the block's name is included in `library`'s blocks (ie. is shared block) - only that `<block id="x" />` is sufficient, no further definition in `def` is necessary.
   - **minifying** - before the content gets saved it's stripped of any excess whitespace

5. Rendered content is persisted to disk. 