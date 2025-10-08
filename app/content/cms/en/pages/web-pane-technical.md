---
template: page-default
title: Web-pane - technical details
headerImage: mid-web-pane.jpg
langs:
  pl: web-pane-technikalia
excerpt: Implementation details of Web-pane
category: web-pane
tags:
  - projects
  - web-pane
slots:
  aside:
    - id: web-pane-downloads
lead: |
  **Web-pane** is written in TypeScript on top of Electron. The Electron app is configured as a single instance—the first `web-pane` command launches the app, and subsequent ones perform their command and exit, leaving just one running instance.
---
## Pane pool (`PanePool`)
Panes are stored in a pool (`PanePool`) that manages their creation, sharing, UI updates, and serialization and deserialization (the last two are needed when you change preferences for showing the title bar or showing the app panes on the system's windows list).

`PanePool` saves geometry, always-on-top state, and panel visibility in the configuration, and when changes such as the window frame or window type occur, it reconstructs the entire pool from snapshots.

A neat detail is `ViewSwitcher`, which listens to `Ctrl/Cmd+Tab` and lets you select tabs in a way similar to the system switcher.

## Panes (`Pane`)

Each pane is a `Pane` object that holds a `BrowserWindow` configured to always stay on top and manages the views containing the opened websites. The views are stored in a dedicated `RoundRobinList` data structure that combines a circular double linked list with a map. This lets the app quickly insert and remove views, look them up by ID, and iterate forward or backward in a loop. The map only fetches views by ID, while the list handles retrieving the next or previous view and tracking the current one.

Each view gets its own persistent session partition (`persist:${viewId}`) and enforces header spoofing and a permissions policy. The spoofing is necessary for apps such as WhatsApp, which need to be kept oblivious that they are opened in Electron.

There is also serialization and deserialization of views, which the app uses when UI preferences change and when moving views between panes.

## Content views (`WebContentsView`)

The architecture separates the panes from the views that carry the web content. The app does not spawn another window for every page. Instead, it creates a `WebContentsView` inside the pane for each page and switches between them. This is the modern, recommended way to embed web content in Electron (newer than `BrowserView`, which may become deprecated).

Each page has its own session. If you open the same page with different IDs (provided via the `--id` option), each of them receives a separate session.

### Why this way?

- A single pane can store a collection of views, and the active view attaches to the window's `contentView` and receives the full pane dimensions.
- Switching is instant (with no new window creation); history, zoom, and reload work through `view.webContents`.

## Dialog windows

Dialogs such as "New pane," "Open page," or "Preferences" are also based on `BrowserWindow`, but they are not stored in the pane pool. Instead, the `App` object keeps them as singletons and summons them when needed. Once created they are not destroyed—only hidden and shown again on demand. Before each display they are reset.

Each dialog is handled by four files:
- **a class extending `BaseDialogWindow`**, which creates the `BrowserWindow`, shows it, destroys it when the app quits (needed because during normal operation we replace destruction with hiding), and registers IPC execution functions. These functions perform the tasks the dialog is meant for, such as creating a new pane or opening a page.
- **an HTML file** that defines the dialog layout
- **a TS script** that loads translated strings, prepares and clears forms, and calls the execution functions above
- **a preloader** that exposes those execution functions through `contextBridge` so they are available to the JS script running in the dialog's HTML

## Translations

The app is multilingual. At the moment it supports Polish and English, and the architecture easily allows adding more languages. Internationalization relies on objects that hold phrase translations (one per language) and a translation service (`TranslationService`).

Translations are needed in the app menu and inside the dialog windows. While the menu updates directly, the dialog phrases are delivered via `contextBridge` over IPC. The scripts on the dialog side ensure that when you change the language in Preferences, the dialog translations update immediately.
