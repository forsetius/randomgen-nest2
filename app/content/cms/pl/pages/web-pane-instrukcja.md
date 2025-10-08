---
template: page-default
title: Web-pane - instrukcja użytkownika
headerImage: mid-web-pane.jpg
langs:
  en: web-pane-user-guide
excerpt: Jak korzystać z aplikacji Web-pane
category: web-pane
tags:
  - projekty
  - web-pane
slots:
  aside:
    - id: web-pane-pliki
---
## Instalacja

Każde wydanie zawiera kilka typów instalatorów i plików, które możesz pobrać, aby zacząć korzystać z aplikacji. Są to:
- **Linux DEB package** - dla dystrybucji Linux, takich jak Debian, Ubuntu czy Linux Mint. Wymaga uprawnień administratora (root), ale po instalacji każdy użytkownik może uruchamiać ją jak polecenie systemowe
- **Linux AppImage** - dla systemu Linux; to plik wykonywalny, który można uruchomić samodzielnie, bez uprawnień roota. Trzeba nadać mu praktyczną nazwę (np. `web-pane`) i skopiować do katalogu znajdującego się w `PATH` (np. `~/.local/bin`), aby można było uruchamiać go z dowolnego katalogu
- **Windows NSIS installer** - pakiet instalacyjny Windows, który zainstaluje aplikację na Twoim komputerze. Wymagane będą uprawnienia administratora i prawdopodobnie pojawi się ostrzeżenie, że aplikacja nie jest certyfikowana.
- **Windows Portable** - plik wykonywalny Windows, który można uruchomić samodzielnie, bez instalacji. Uprawnienia administratora nie są potrzebne; wystarczy umieścić go w katalogu, z którego system go odnajdzie, i nadać mu praktyczną nazwę (np. `web-pane`).
- **macOS ZIP** - jedyna forma dystrybucji, jaką mogę przygotować dla macOS.

Możesz również zainstalować wersję deweloperską z repozytorium. To bardziej zaawansowana opcja, dlatego odsyłam do pliku [README](https://github.com/forsetius/web-pane/blob/master/README.md).

W przypadku instalatorów polecenie `web-pane` pojawi się w systemie automatycznie. W wersjach AppImage i Portable przenieś pobrany plik w miejsce, w którym system będzie mógł go odnaleźć (w Linuxie: do katalogu znajdującego się w `PATH`, np. `~/.local/bin`) i najlepiej zmień nazwę na `web-pane` (w Windows: `web-pane.exe`).

## Uruchamianie

Web-pane można uruchomić na kilka sposobów w zależności od integracji. W każdym przypadku startuje jednak poprzez polecenie.

Najprostsze (choć niekoniecznie najwygodniejsze) wywołanie to:
> `web-pane` - otwiera pusty panel, gotowy na otwarcie pierwszej strony

Możesz też otworzyć panel od razu z załadowaną stroną:
> `web-pane --url <url>` - otwiera podaną stronę w domyślnym panelu

Możesz również wskazać docelowy panel:
> `web-pane --url <url> --target <pane>` - otwiera podaną stronę w podanym panelu

Wewnątrz aplikacja używa identyfikatora (ID) dla każdej strony. Domyślnie jest to część domenowa adresu URL. Jeśli więc skorzystamy z opcji `--url https://www.facebook.com/messages/t/123456789`, identyfikatorem będzie `www.facebook.com`. Oznacza to, że jeśli masz dwie strony z tą samą domeną, np.:
- `https://www.facebook.com` dla Facebooka
- `https://www.facebook.com/messages/t/123456789` dla Facebook Messengera
  to będą one traktowane jak ta sama strona i nadpisywać się nawzajem. Aby tego uniknąć, możesz dodać argument `--id`:
> `web-pane --url <url> --id <id>` - otwiera stronę z podanym identyfikatorem

Pełna komenda wygląda tak:
> `web-pane --url <url> --id <id> --target <pane>`

Pierwsze polecenie `web-pane` uruchamia aplikację. Kolejne wykonują swoje zadanie i kończą działanie, pozostawiając tylko jedną działającą instancję. Jeśli `web-pane` zostanie uruchomione drugi raz z tym samym `--id`, strona zostanie pokazana (jeśli była ukryta lub panel był zminimalizowany) albo panel zostanie zminimalizowany (jeśli strona była już widoczna).

## Użytkowanie

Stronę możesz otworzyć z menu `Strona > Otwórz stronę` lub skrótem `Ctrl+O`. Podajesz URL, a polecenie pozwala otworzyć stronę w bieżącym okienku, innym już istniejącym okienku (jeśli takie utworzyłeś) lub w nowym. Jeśli chcesz otworzyć ją w nowym okienku, musisz je nazwać - użyj krótkiej nazwy, np. "praca", "docs" albo "chat"; służy ona do wewnętrznego śledzenia okienek.

Możesz otworzyć wiele stron w jednym okienku, ale jednocześnie widoczna jest tylko jedna. Aby przełączyć się na inną, użyj `Ctrl+Tab` (następna) lub `Ctrl+Shift+Tab` (poprzednia). Zobaczysz przełącznik z ikonami otwartych stron, a każde kolejne naciśnięcie `Ctrl+Tab` albo `Ctrl+Shift+Tab` przeniesie Cię do następnej/poprzedniej strony. Stronę możesz zamknąć komendą menu `Strona > Zamknij stronę` lub klawiszem `F4`.

Ze stroną możesz wchodzić w interakcję tak jak w zwykłej przeglądarce, z wyjątkiem menu kontekstowego i historii. Menu kontekstowe nie jest dostępne, chyba że strona definiuje własne. Przykładem jest Google Maps, gdzie po kliknięciu prawym przyciskiem myszy pojawiają się dodatkowe akcje. Historię możesz przeglądać skrótami `Alt+←` i `Alt+→`; dostępne są też odpowiednie polecenia w menu.

Możesz zmieniać rozmiar okienka i przenosić go (w Linuxie możesz wybrać okienka bez tytułu i przesuwać je trzymając wciśnięty `Alt`), a zmiany zostaną zapisane. Nowe okienko otworzysz komendą menu `Pane > New pane` lub skrótem `Ctrl+N`. Stronę możesz przenieść do innego okienka (istniejącego lub nowego) komendą `Page > Move page` albo `Ctrl+M`. Aby zminimalizować okienko, użyj `Okienko > Minimize` lub `Alt+↓`. Jeśli ukrywasz okna `web-pane` na liście okien systemu, warto zdefiniować globalny skrót klawiszowy, który je przywróci - polecenie `web-pane` przywróci wszystkie okienka, a `web-pane --target <pane>` tylko wskazane.

## Integracje

Wywoływanie aplikacji z linii poleceń `web-pane ...` byłoby na dłuższą metę uciążliwe, dlatego warto zintegrować ją z systemem. Można to zrobić na kilka sposobów.

### Aktywatory
Znacznie wygodniej jest uruchamiać aplikację za pomocą skrótów (na Windows: pliki `.lnk`, na macOS: aliasy, na Linux: pliki `.desktop`). Utwórz skrót na pulpicie i edytuj go tak, aby uruchamiał `web-pane --url <url>` lub dowolną inną wariację z powyższych.

Przykładowy plik `.desktop` w Linuxie może wyglądać tak:
```ini
[Desktop Entry]
# Podmień wartości wg potrzeb
Name=ChatGPT
Exec=web-pane --url https://www.chatgpt.com
Icon=window-new

# Wklej poniższe linie, nic nie zmieniaj
Type=Application
StartupWMClass=web-panes
StartupNotify=false
Terminal=false
```

Kliknij aktywator, aby otworzyć stronę w okienku. Okienko będzie utrzymywane nad innymi oknami, co pozwoli podejrzeć jego zawartość nawet podczas pracy w innych aplikacjach. Ponowne kliknięcie aktywatora zminimalizuje okienko, a kolejne kliknięcie znów go przywróci.

### Pliki wsadowe
Możesz przygotować całe układy okienek ze stronami otwieranymi z plików wsadowych lub skryptów. Wystarczy utworzyć plik z kolejnymi poleceniami `web-pane ...` i nadać mu atrybut wykonywalny. Na przykład w Linuksie możesz mieć układ web-dev z dwoma okienkami zdefiniowany tak:

```sh
#!/bin/sh
web-pane --url https://chatgpt.com
web-pane --url https://docs.nestjs.com
web-pane --url https://nodejs.org/docs/latest/api/
web-pane --url https://www.facebook.com/messages/t/123456789 --target messages
web-pane --url https://web.whatsapp.com/ --target messages
```

Oczywiście możesz utworzyć aktywator dla takiego skryptu i uruchamiać go jednym kliknięciem.

### Doki
Przykładowa konfiguracja dla Linux Mint: Web-pane + dwa doki Plank. Powinna działać także w dystrybucjach opartych na Debianie (np. Ubuntu).

1. Zainstaluj Plank:
    > `sudo apt install plank`
2. Utwórz dwie instancje doków Plank w Autostarcie:
    - otwórz Programy startowe
    - dodaj wpis z poleceniem `plank -n dock1 &` oraz drugi z `plank -n dock2 &`
    - uruchom powyższe polecenia, aby ręcznie wystartować doki Plank
    - umieść jeden dok po lewej, drugi po prawej stronie ekranu i skonfiguruj je według uznania
3. Utwórz pliki `.desktop` dla stron, które chcesz mieć w okienkach. Dla lewego okienka użyj polecenia:
    > `web-pane --url <url> --target left`

    Dla prawego okienka użyj tego samego polecenia, ale pomiń argument `--target`.
4. Przeciągnij pliki `.desktop` na odpowiedni dok Plank
5. W sekcji "Klawiatura" w Ustawieniach systemowych przejdź do zakładki "Skróty" i dodaj globalne skróty, na przykład:
    - `Alt+Up` z poleceniem: `web-pane`, aby otworzyć lub przywrócić zminimalizowane okienka
    - `Ctrl+Shift+PgDn` z poleceniem: `bash -c 'web-pane --url "$(xclip -o -selection clipboard)"'`, aby otworzyć wcześniej skopiowany URL w głównym oknie. Aby użyć tego skrótu, może być konieczna instalacja pakietu `xclip` poleceniem `sudo apt install xclip`.

Jeśli aplikacja jest zainstalowana i dodałeś Plank do autostartu, uruchomi się automatycznie i pokaże zdefiniowane aktywatory stron.

## Skróty klawiaturowe

Aplikacja udostępnia następujące skróty klawiaturowe:
  - `Ctrl+N` - nowe okienko
  - `Ctrl+O` - otwarcie strony w okienku
  - `Ctrl+M` - przeniesienie strony do innego okienka
  - `F4` - zamknięcie aktywnej strony i pokazanie następnej (lub zamknięcie okienka, jeśli to ostatnia)
  - `Ctrl+F4` - zamknięcie okienka (lub aplikacji, jeśli to ostatnie)
  - `Alt+Down` - zminimalizowanie okienka (przywrócisz, klikając jego aktywator)
  - `Alt+F4` - zakończenie działania aplikacji
  - `Ctrl+Tab`/`Ctrl+Shift+Tab` - następna/poprzednia strona w okienku
  - `Alt+Left`/`Alt+Right` - wstecz/do przodu w historii
  - `Ctrl+R`/`Ctrl+Shift+R` - przeładowanie strony / wymuszone przeładowanie (bez cache)
  - `Ctrl+Shift+=`/`Ctrl+Shift+-`/`Ctrl+0` - powiększanie, pomniejszanie, reset powiększenia
  - `F10` - okno preferencji

Są to skróty przypisane do tej aplikacji, więc działają tylko wtedy, gdy aktywny (ma fokus) jest któreś z okienkek Web-pane. Dlatego warto zdefiniować skróty globalne - działające niezależnie od tego, która aplikacja jest aktywna. Na przykład w Linux Mint możesz to zrobić w `Ustawienia systemowe > Klawiatura > skróty`.
