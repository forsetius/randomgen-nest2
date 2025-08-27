---
template: page-default
title: web-pane
headerImage: mid-web-pane.jpg
langs:
  pl: web-pane
excerpt: Handy, always-on-top 'helper windows' for web-apps
tags:
  - projects
slots:
  aside:
    - type: static
      content: |
        ## Link
        - [Project repository](https://github.com/forsetius/web-pane)

lead: |
  `web-pane` is a small [Electron](https://www.electronjs.org/) app that pins lightweight always-on-top windows to your screen edges, each holding several web apps (tabs). Switch between them with shortcuts (`Ctrl+Tab`/`Ctrl+Shift+Tab`) or by clicking dock icons. Result: while you’re working in an IDE or terminal, you’ve got a steady reference at hand—ChatGPT, docs, cheat sheets, whatever you need—without juggling windows.
---
`web-pane` isn’t a full browser and doesn’t try to be. It’s a work helper: a few reference sources always within reach. Instead of managing user windows and tabs, the app keeps steady panels and fast switching between your “predefined” web apps.

## Who it’s for - and why

* **Developers**: quick peek at documentation, logs, ChatGPT.
* **Creators**: moodboards, color palettes, CMS preview.
* Anyone who prefers to *glance* at information rather than split the screen.

Panels stay “on top” but don’t steal focus from your main app; minimizing and restoring with a single click keeps things tidy.

## How it works (user view)

1. Integrate with **[Plank](https://news.itsfoss.com/plank-reloaded/)** (or another dock): add two docks to autostart and pin your own `.desktop` shortcuts to them. Each shortcut launches a left or right panel.
2. Launching web apps: The app provides a simple CLI to open/select web apps in a given panel, which keeps the `.desktop` entry short and stable. The README includes a ready-to-use example; a minimal entry looks like:

   ```
   Exec=web-pane show chatgpt https://www.chatgpt.com --target left
   StartupWMClass=web-panes
   ```
3. Keyboard shortcuts (the essentials):

    * `Ctrl+Tab`/`Ctrl+Shift+Tab` – next/previous web app in the panel
    * `Alt+Left`/`Alt+Right` – back/forward in history
    * `Ctrl+R`/`Ctrl+Shift+R` – reload / hard reload
    * `Ctrl+Shift+=`, `Ctrl+Shift+-`, `Ctrl+0` – zoom in, zoom out, reset zoom
    * `Ctrl+F4` – close tab, `Alt+F4` – quit the app
    * `Alt+Down` – minimize the panel (restore by clicking its activator)

All shortcuts are listed in the README.

## Implementation overview

`web-pane` is written in TypeScript on Electron. The architecture separates **panel windows** from **content views** that render web pages.

### Panel windows

Each panel (left/right) is an Electron window configured as always-on-top. On macOS it’s worth using the “screen-saver” level so the window sits above fullscreen apps; you can also enable *all workspaces* so the panel is visible on every desktop.

### Content views: `WebContentsView`

Inside a panel window, the app doesn’t open more windows for each site. Instead, it creates several `WebContentsView` instances and switches them within the same window. This is the modern, recommended way to embed web content in Electron (the successor to the now-dated `BrowserView`).

### Why this approach?

* A single panel can hold a **collection of views**; the active view is attached to the window’s `contentView` and gets the panel’s full size.
* Switching is instant (no new window creation); history, zoom, and reload are handled via `view.webContents`.

## Getting started

1. Install **Plank**, add two docks to autostart, and place them on the left/right edges.
2. Create `.desktop` files for your chosen web apps.
3. Install `web-pane` and add `.desktop` shortcuts that run `web-pane show <id> <url> [--target left|right]`.

Step-by-step instructions (plus the full shortcut list) are in the repository README.
