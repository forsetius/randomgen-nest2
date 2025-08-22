---
template: page-default
title: web-pane
headerImage: mid-web-pane.jpg
langs:
  en: web-pane
excerpt: Podręczne "okienka ściągawki" dla web-apek nad innymi oknami
slots:
  aside:
    - type: static
      content: |
        ## Link
        - [Repozytorium projektu](https://github.com/forsetius/web-pane)

lead: |
  `web-pane` to mały program w [Electronie](https://www.electronjs.org/), który pozwala przypiąć na krawędziach ekranu lekkie okna typu always-on-top i w każdym z nich trzymać kilka „web-apek” (karty). Przełączasz je skrótami (`Ctrl+Tab`/` Ctrl+Shift+Tab`) lub kliknięciem w ikony na doku. Efekt: podczas pracy w IDE albo w terminalu masz pod ręką stałą ściągę — ChatGPT, dokumentację, tablice skrótów, co potrzebne — bez żonglowania oknami.
---

`web-pane` nie jest pełnoprawną przeglądarką i nie próbuje nią być. To podpórka do pracy: kilka źródeł referencyjnych zawsze pod ręką. Zamiast zarządzać oknami i kartami użytkownika, aplikacja utrzymuje stałe panele i szybkie przełączanie „predefiniowanych” web-apek.

## Dla kogo i po co

- **Programiści**: szybki podgląd dokumentacji, logów, ChatGPT.
- **Twórcy**: moodboardy, palety kolorów, podgląd CMS.
- Każdy, kto woli zaglądać do informacji niż dzielić ekran.

Panele pozostają „na wierzchu”, ale nie kradną fokusu Twojej głównej aplikacji; minimalizacja i przywracanie jednym kliknięciem utrzymuje porządek.

## Jak to działa od strony użytkownika

1. Integracja z **[Plank (Reloaded)](https://news.itsfoss.com/plank-reloaded/)** (lub innym dokiem): do autostartu dodajesz dwa doki i przypinasz do nich własne skróty `.desktop`. Każdy skrót uruchamia panel po lewej lub prawej stronie.
2. Uruchamianie web-apek: Aplikacja udostępnia prosty interfejs CLI do otwierania/wybierania web-apek w danym panelu. Dzięki temu wpis `.desktop` jest krótki i stabilny. README zawiera gotowy przykład pliku a przykładowy minimalny wpis `.desktop` wygląda tak:
```
Exec=web-pane show chatgpt https://www.chatgpt.com --target left
StartupWMClass=web-panes
```
3. Skróty klawiaturowe (najważniejsze):
- `Ctrl+Tab`/`Ctrl+Shift+Tab` – następna/poprzednia web-apka w panelu
- `Alt+Left`/`Alt+Right` – wstecz/dalej w historii
- `Ctrl+R`/`Ctrl+Shift+R` – przeładowanie / twarde przeładowanie
- `Ctrl+Shift+=`, `Ctrl+Shift+-`, `Ctrl+0` – powiększ, pomniejsz, reset zoomu
- `Ctrl+F4` – zamknij kartę, `Alt+F4` – wyjdź z aplikacji
- `Alt+Down` – zminimalizuj panel (przywrócisz klikając jego aktywator)

Wszystkie skróty są spisane w README.

## Przegląd implementacji

web-pane jest napisany w TypeScript na Electronie. Architektura opiera się na rozdzieleniu okien paneli od widoków z treścią webową.

### Okna paneli
Każdy panel (lewy/prawy) to okno w Electronie skonfigurowane na tryb always-on-top. Na macOS warto ustawić poziom „screen-saver”, żeby okno było nad aplikacjami pełnoekranowymi; dodatkowo można włączyć all workspaces, by panel był widoczny na wszystkich pulpitach.

### Widoki z treścią: `WebContentsView`

Wewnątrz okna panelu aplikacja nie otwiera kolejnych okien dla każdej strony. Zamiast tego tworzy kilka `WebContentsView` i przełącza je w tym samym oknie. To współczesny, zalecany mechanizm osadzania treści web w Electronie (następca przestarzałego `BrowserView`).

### Dlaczego tak?
- Jeden panel może trzymać kolekcję widoków, a aktywny widok jest dołączany do `contentView` okna i dostaje pełne wymiary panelu.
- Przełączanie jest natychmiastowe (bez tworzenia okna); historia, zoom i przeładowanie działają przez `view.webContents`.

## Jak zacząć

1. Zainstaluj **Plank**, dodaj dwa doki do autostartu i ustaw je po lewej/prawej.
2. Stwórz pliki `.desktop` dla wybranych web-apek.
3. Zainstaluj web-pane i dodaj skróty `.desktop` z komendą `web-pane show <id> <url> [--target left|right]`.

Instrukcja krok po kroku (wraz z listą skrótów) jest w [README](https://github.com/forsetius/web-pane/) repozytorium.