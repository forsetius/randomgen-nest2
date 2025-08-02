---
template: page-full-width
title: randomgen
langs:
  en: randomgen
excerpt: Generatory do RPG
blocks:
  generators:
    type: pageGallery
    sources:
      - tag: generator
lead: |
  RandomGen to zbiór generatorów do gier fabularnych.
  Wszystkie generatory są modułami jednej aplikacji Node.js używającej frameworka [Nest.js](https://nestjs.com/), napisanej w TypeScript. Dostępne w dwóch trybach: za pomocą podanych niżej podstron oraz za pomocą endpointów API. 

  <block id="generators" />
---

## Moduły bazowe

Jednak generatory to oczywiście nie wszystko. Oprócz nich, RandomGen zawiera też bazowe moduły takie jak:
- `config` - wczytuje zmienne środowiskowe, waliduje je i sprawdza czy ich zestaw jest kompletny. Umożliwia też zdefiniowanie danych konfiguracyjnych a la rejestr Windows, zmapowanie tam zmiennych środowiskowych i dostęp i bezpieczny, otypowany dostęp do nich.
- `parser` - zawiera usługi parsujące format Markdown i wczytujące/parsujące z plików. Parser markdowna zawiera zmiany i dodatki pod moduł CMS, które umożliwiają np. stosowanie linków wewnętrznych i oznaczanie segmentów strony czy rodzaju linku.
- `security` - zawiera ograniczanie ilości żądań w razie spamowania serwera, odsiewanie spamu oraz konfigurację polityk CORS i CSP. 
- `templating` - zapewnia rendering treści przez wypełnianie szablonów danymi. W tej chwili używane w module CMS, w przyszłości zanjdzie zastosowanie w wysyłaniu wiadomości pocztą, SMS-ami czy przez PUSH.
- `mail` - jak sama nazwa wskazuje, realizuje wysyłkę emaili. Korzysta przy tym z serwisu `templating`.

## Moduł CMS

Ostatnim z modułów bazowych jest moduł CMS. Zasługuje na osobną wzmiankę bo jest najbardziej kompleksowy.

Jego działanie polega na tym, że bierze zdefiniowane w Markdownie strony (oraz ich części jak menu czy różnego rodzaju bloki) i z pomocą szablonów (oraz modułu `templating`) renderuje je do statycznych plików HTML. No, nie do końca statycznych bo wzbogaconych o elementy HTMX, które umożliwiają wykonywanie różnego rodzaju żądań HTTP. Dzięki temu możliwe jest wysyłanie emaili, konstruowanie formularzy, dynamicznego wyszukiwania, galerii na bieżąco pobierających uprzednio wygenerowane fragmenty stron itp. 

Niemniej na koniec rozruchu aplikacji dysponuje ona kilkoma zestawami stron i fragmentów HTML, które są serwowane statycznie. Cały proces realizuje zasadę "zapisz raz, czytaj wiele razy" co daje bardzo szybkie działanie aplikacji. Tylko strona główna jest serwowana przez główny endpoint aplikacji - reszta stron to pliki HTML+HTMX serwowane statycznie.

Inne możliwości tego modułu to:
- generowanie stron za pomocą różnych szablonów stron
- definiowanie menu za pomocą pliku JSON lub YAML
- definiowania w tekście strony elastycznych bloków: treści statycznych, mediów i ich galerii, galerii podstron, danych pobieranych z innych endpointów i zewnętrznych API. Bloki te mogą być też dodawane do predefiniowanych regionów strony
- kategoryzowanie stron umożliwiające łatwe tworzenie galerii podstro. Kategorie są hierarchiczne - strona może należeć do kategorii, która należy do kategorii nadrzędnej itd.
- tagowanie treści
- proste wyszukiwanie po tytule, zajawce, kategoriach i tagach
- uproszczone linkowanie do stron wewnętrznych
- wbudowany lightbox wyświetlający media i ich galerie
- RSS udostępniający dane o stronach z kategorii "blog"
- wsparcie dla wielojęzyczności

## Dalszy rozwój

W kolejnej iteracji prac nad aplikacją dodane będą moduły `db` do bazy danych oraz `user` do obsługi rejestracji, logowania itp. Inne (np. `redis`, `sms` czy `push`) będę dodawał w miarę potrzeb.

W tej chwili moduł CMS nie wymaga bazy danych, nie ma też logowania użytkowników (bo nie ma takiej potrzeby). Docelowo zamierzam to dodać, choćby po to, żeby zrealizować wysyłkę newslettera czy powiadomień.

No i oczywiście dojdą nowe generatory. Na warsztacie jest już generator układów planetarnych, kolejnymi będą generator relacji stronnictw w mieście (fantasy, modern fantasy i SF) oraz scenariuszy do [Eclipse Phase]{pl/eclipse-phase} [RPG](https://pl.wikipedia.org/wiki/Gra_fabularna).