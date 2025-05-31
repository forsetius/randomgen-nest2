# Rendering process

On the application startup, the process of generating pages is started. Its point is to have all the HTML pages rendered as much as possible. Basically, all the pages that don't use API calls can be fully rendered at that point.

The process takes place in the `CmsService`'s `load()` method. Following steps are performed in order:

1. **Reading definitions ("defs") from the subdirectories** of `/content/cms/${lang}` directory. There are 3 of them:
    - `blocks`: contains **static** block definitions
    - `menus`: contains menu definitions
    - `pages`: contains page definitions
2. **Creating the domain objects**: 
   1. `StaticBlock`s are created in the `BlockFactory`. First the `BlockDef`s are validated against the `BlockZodSchema`, then the `def` is used to create the `Block` object The factory uses the `def.type` to determine the type of the block to create. **At this stage, only the static blocks are created**
   2. `Menu`
   3. `Page` 
    
   At this stage, only the information from the `def` populate the domain objects. There are no connections between pages, menus and blocks.

3. **Rendering the menus**: `Menu` objects get their `def`s rendered into HTML fragments. They will be inserted into the page template later. Menu rendering does not require nor support any blocks.

4. **Pre-rendering the blocks**: using passed `PageLib`, `Block` objects get their `def`s rendered into HTML fragments. Only dynamic blocks need to be rendered later, the rest of blocks are fully rendered at this stage.

5. **Pre-rendering the pages**: using passed menus and blocks (that are already rendered into HTML), `Page` objects get their `def`s rendered into HTML fragments. Only dynamic blocks need to be rendered later, otherwise the pages are good to go.