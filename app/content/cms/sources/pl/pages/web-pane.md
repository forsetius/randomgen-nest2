---
template: page-default
title: Web-pane
headerImage: mid-web-pane.jpg
langs:
  en: web-pane
excerpt: Podręczne 'okienka-ściągawki' utrzymywane nad innymi oknami
subcategoryName: Web-pane
tags:
  - projekty
  - web-pane
slots:
  aside:
    - id: web-pane-pliki
  bottom:
    - type: pageGallery
      title: Chcesz wiedzieć więcej?
      sources:
        - category: web-pane
        
lead: |
  **Web-pane** to mała aplikacja pozwalająca otwierać lekkie okienka, które pozostają zawsze na wierzchu, ponad innymi oknami. W oknach tych można otworzyć różne strony internetowe, po kilka w każdym oknie i wygodnie przełączać się między nimi. W zamierzeniu jest to narzędzie, które pozwala utrzymywać na widoku tekst referencyjny (np. dokumentację, logi, ChatGPT) podczas pracy w innych oknach. Może też mieć jednak inne zastosowania, np. utrzymywać otwarte niewielkie okienko translatora czy komunikatora.
---
`web-pane` nie jest pełnoprawną przeglądarką i nie próbuje nią być. To podpórka do pracy: kilka źródeł referencyjnych zawsze pod ręką. Zamiast zarządzać oknami i kartami, aplikacja utrzymuje stałe panele i szybkie przełączanie stron internetowych.

## Dla kogo i po co

- **Programiści**: szybki podgląd dokumentacji, logów, ChatGPT.
- **Twórcy**: moodboardy, palety kolorów, podgląd CMS.
- Każdy, kto woli zaglądać do informacji niż dzielić ekran lub przełączać się między oknami.

## Jak to działa?

Uruchomienie aplikacji pokazuje okienko, w którym otwiera się wskazana strona internetowa. Okienko pozostaje zawsze na wierzchu, ale można je zminimalizować i w razie potrzeby przywrócić. Można je też przesunąć w bardziej odpowiednie miejsce lu zmienić jego rozmiar.

<block id="web-pane" type="media" template="lightbox-image" src="web-pane.png" title="Po prawej stronie wiszące okienko Web-pane, po bokach doki Planka pokazujące w tym okienku zdefiniowane strony internetowe" />

Wywołanie komendy (lub skrótu) otwierającej inną stronę w tym samym okienku powoduje zamienienie w nim widoku - pokazuje się w nim druga strona ale pierwsza jest "pod spodem" i można ją przywołać z powrotem. Można tak otwierać wiele stron w tym samym okienku a następnie przełączać się między nimi - pokazują się ikonki wszystkich otwartych stron i można między nimi przechodzić.

<block id="web-pane" type="media" template="lightbox-image" src="web-pane-switcher.png" title="Po prawej stronie wiszące okienko Web-pane, po bokach doki Planka pokazujące w tym okienku zdefiniowane strony internetowe" />

Okienek można otworzyć kilka, porozmieszczać je po ekranie według uznania i w każdym z nich przechowywać inny zestaw stron internetowych.

<block id="web-pane" type="media" template="lightbox-image" src="web-pane-2-panes.png" title="Po prawej stronie wiszące okienko Web-pane, po bokach doki Planka pokazujące w tym okienku zdefiniowane strony internetowe" />

Panele pozostają „na wierzchu”, ale nie kradną fokusu Twojej głównej aplikacji; minimalizacja i przywracanie jednym skrótem klawiszowym utrzymuje porządek.

## Integracje

Choć aplikację można otwierać z menu systemowego, można ją też uruchamiać na inne sposoby. Komenda, która ją wywołuje może zostać rozszerzona tak, by od razu otwierała wskazaną stronę w wybranym oknie. W normalnej pracy taki sposób uruchamiania byłby kłopotliwy, ale jest przydatny w integracji z systemem. Można to zrobić na kilka sposobów:
1. **Skróty** (windowsowy skrót, linuksowy aktywator `.desktop`, element doku na macOS) - można stworzyć na pulpicie zwykłe skróty systemowe, które odpalają pożądaną stronę w określonym oknie. Kolejne kliknięcie skrótu albo przełączy widok w okienku na tą stronę albo (jeśli już ją widać) zminimalizuje okienko.
2. **Doki** lub **listy okien** - można przypiąć do nich stworzone skróty dla łatwego dostępu i ew. ukrycia gdy są niepotrzebne (jeśli dok się chowa)
3. **Skróty klawiszowe** - w systemie można zdefiniować skróty, które wywołają/przywrócą okienko bądź pokażą w nim odpowiednią stronę.
4. **Skrypty** - mogą definiować cały złożony układ okienek ze stronami (np. do pracy programistycznej, redagowania tekstów itp.). Oczywiście takie skrypty można również podpiąć do skrótów, doków czy kombinacji klawiszy.

Po tego rodzaju konfiguracjach uruchamianie i sterowanie aplikacją sprowadza się do klikania w skróty pulpitu lub doku i/lub używania skrótów klawiszowych.

Szczegóły na [stronie z instrukcjami]{pl/web-pane-instrukcja}
