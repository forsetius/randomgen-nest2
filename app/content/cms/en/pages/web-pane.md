---
template: page-wide+aside
title: Web-pane
headerImage: mid-web-pane.jpg
langs:
  pl: web-pane
excerpt: Handy cheat-sheet windows kept above other windows
subcategoryName: Web-pane
tags:
  - projects
  - web-pane
slots:
  aside:
    - id: web-pane-downloads
    
  bottom:
    - type: pageGallery
      title: Want to know more?
      sources:
        - category: web-pane
        
lead: |
  **Web-pane** is a small app that lets you open lightweight windows that stay always on top of other windows. Each window can host multiple websites so you can switch between them comfortably. The goal is to keep reference text (documentation, logs, ChatGPT) visible while you work elsewhere, but it also suits other uses, like keeping a compact translator or messenger window handy.
---
`web-pane` is not a full-fledged browser and does not try to be one. It is a work support tool: a handful of reference sources always within reach. Instead of managing windows and tabs, the app maintains fixed panes and fast switching between web pages.

## Who is it for?

- **Developers**: quick access to docs, logs, ChatGPT.
- **Creators**: mood boards, color palettes, CMS previews.
- Anyone who prefers peeking at information over splitting the screen or juggling windows.

## How does it work?

Launching the app shows a window with the requested webpage. The window stays always on top, but you can minimize it and restore it whenever you need. You can also move it to a better spot or resize it.

<block id="web-pane" type="media" template="lightbox-image" src="web-pane-screenshot.png" title="On the right, a floating Web-pane window with Plank docks on the sides showing the pages defined for that pane" />

Running a command (or shortcut) that opens another page in the same window replaces the view - the second page appears, but the first stays underneath and you can bring it back. You can open many pages within the same window and switch between them; icons of all open pages appear, and you can cycle through them.

<block id="web-pane" type="media" template="lightbox-image" src="web-pane-screenshot.png" title="On the right, a floating Web-pane window with Plank docks on the sides showing the pages defined for that pane" />

You can open several windows, place them around the screen however you like, and keep a different set of web pages in each of them.

<block id="web-pane" type="media" template="lightbox-image" src="web-pane-screenshot.png" title="On the right, a floating Web-pane window with Plank docks on the sides showing the pages defined for that pane" />

The panes stay "on top" but do not steal focus from your main app; minimizing and restoring them with a single shortcut keeps things tidy.

## Integrations

You can launch the app from the system menu, but there are other ways too. The command that triggers it can be extended so it immediately opens a specific page in a chosen window. That would be clumsy in everyday usage, yet it shines when you integrate it with the system. You can do that in several ways:
1. **Shortcuts** (Windows shortcuts, Linux `.desktop` launchers, macOS dock items) - create ordinary system shortcuts that open the desired page in a particular window. Clicking the shortcut again either switches the pane to that page or, if it is already visible, minimizes the pane.
2. **Docks or window lists** - pin the shortcuts there for easy access and hide them when they are not needed (if the dock auto-hides).
3. **Keyboard shortcuts** - define system shortcuts that summon or restore a pane, or show a specific page inside it.
4. **Scripts** - script the entire layout of panes and pages (for coding, editing, and so on). You can tie those scripts to shortcuts, dock items, or key combinations as well.

Once configured this way, running and managing the app becomes a matter of clicking desktop or dock shortcuts and/or using key combinations.

Details are on the [user guide page]{en/web-pane-user-guide}
