---
template: page-wide+aside
title: Web-pane - technikalia
headerImage: mid-web-pane.jpg
langs:
  en: web-pane-technical
excerpt: Szczegóły implementacji aplikacji Web-pane
category: web-pane
tags:
  - projekty
  - web-pane
slots:
  aside:
    - id: web-pane-pliki
lead: |
  **Web-pane** jest napisany w TypeScript na Electronie. Aplikacja elektronowa jest ustawiona w tryb jednej instancji - pierwsze polecenie `web-pane` uruchamia aplikację, kolejne - wykonują swoje polecenie i kończą pracę, pozostawiając tylko jedną działającą instancję. 
---
## Pula okienek (`PanePool`)
Okienka są przechowywane w puli (`PanePool`), która zarządza ich tworzeniem, udostępnianiem, wprowadzaniem zmian zw. z UI oraz serializacją i deserializacją (dwa ostatnie są potrzebne przy zmianie preferencji dotyczących wyświetlania belki tytułowej i pokazywania okienek aplikacji na liście okien).

`PanePool` zapisuje geometrię, stan always-on-top i widoczność paneli w konfiguracji, a przy zmianach takich jak ramka okna czy typ okna rekonstruuje całą pulę na podstawie snapshotów.

Ciekawostką jest `ViewSwitcher`, który nasłuchuje `Ctrl/Cmd+Tab` i umożliwia wybór kart w stylu systemowego switchera. 

## Okienka (`Pane`)

Każde okienko to obiekt `Pane` zawierający okno `BrowserWindow` skonfigurowane na tryb always-on-top oraz zarządzający widokami zawierającymi otwierane strony internetowe. Widoki trzymane są w dedykowanej strukturze danych `RoundRobinList`, która jest połączeniem zapętlonej listy podwójnie linkowanej z mapą. Umożliwia to jednocześnie szybkie wstawianie i usuwanie widoków, wyszukiwanie ich po ID oraz iterowanie w kółko do następnego/poprzedniego. Mapa odpowiada tylko za pobieranie widoków po ID, lista - za pobieranie kolejnego/poprzedniego i przechowywanie aktualnego.

Warto wspomnieć, że okienko dla każdego widoku zakłada osobną, trwałą partycję sesji (persist:${viewId}) i nakłada spoofing nagłówków oraz politykę uprawnień. Spoofing hest konieczny przy aplikacjach takich jak WhatsApp, przed którymi trzeba ukrywać fakt otwierania ich w Electronie.

Jest tu także serializacja i deserializacja widoków, która jest wykorzystywana przy zmianie preferencji UI oraz przenoszeniu widoków między okienkami.

## Widoki z treścią (`WebContentsView`)

Architektura opiera się na rozdzieleniu okienek od widoków z treścią webową. Aplikacja nie otwiera kolejnych okienek dla każdej strony. Zamiast tego dla każdej strony tworzy w okienku widok `WebContentsView` i przełącza je. To współczesny, zalecany mechanizm osadzania treści web w Electronie (nowszy niż `BrowserView`, który może stać się przestarzały).

Każda strona ma swoją sesję. Jeśli otworzymy tę samą stronę z różnymi ID (wprowadzanymi opcją `--id`) to każda będzie miała swoją odrębną sesję.

### Dlaczego tak?
- Jeden panel może trzymać kolekcję widoków, a aktywny widok jest dołączany do `contentView` okna i dostaje pełne wymiary panelu.
- Przełączanie jest natychmiastowe (bez tworzenia okna); historia, zoom i przeładowanie działają przez `view.webContents`.

## Okna dialogowe

Dialogi takie jak "Nowe okienko", "Otwórz stronę" czy "Preferencje" również oparte są o `BrowserWindow` ale nie są przechowywane w puli okienek tylko w okiekcie `App` jako singletony i wywoływane w razie potrzeby. Raz stworzone nie są niszczony tylko ukrywane i pokazywane w razie ponownego wywołania. Przed każdym pokazaniem są czyszczone.

Każdy dialog jest obsługiwany przez cztery pliki:
- **klasę dziedziczącą po `BaseDialogWindow`**, która obsługuje tworzenie `BrowserWindow`, pokazywanie go, niszczenie przy wychodzeniu z aplikacji (potrzebne bo w trakcie działania aplikacji zastępujemy niszczenie ukrywaniem) i rejestrację funkcji wykonawczych w IPC. Funkcje te wykonują funkcjonalności, do których powołany jest dany dialog, tj. tworzenie nowego okienka, otwieranie strony itd.
- **plik HTML** definiujący wygląd dialogu
- **skrypt TS**, który wczytuje tłumaczenia tekstów, przygotowuje i czyści formularze oraz wywołuje funkcje wykonawcze jw.
- **preloader**, który przez `contextBridge` wystawia funkcje wykonawcze tak, by były widoczne dla skryptu JS po stronie HTML-a wyświetlanego w dialogu

## Tłumaczenia

Aplikacja jest wielojęzyczna. W tej chwili obsługuje język polski i angielski ale oczywiście jest możliwość dodania kolejnych języków. I18n opiera się o obiekty zawierające tłumaczenia fraz (po jednym dla każdego języka) oraz usługi tłumaczącej (`TranslationService`).

Tłumaczenia są potrzebne w menu aplikacji oraz z oknach dialogowych. O ile w przypadku menu przełączanie realizowane jest bezpośrednio, to do dialogów frazy dostarczane są przez `contextBridge` za pomocą IPC. Skrypty po stronie dialogów zapewniają, że w przypadku zmiany języka w Preferencjach, tłumaczenia w dialogach zmieniają się natychmiast.
