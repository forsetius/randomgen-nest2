---
template: page-default
title: randomgen
headerImage: mid-randomgen.jpg
langs:
  en: randomgen
excerpt: Framework w Nest.js użyty do implementacji m.in. generatorów do RPG
tags:
  - projekty
slots:
  aside:
    - type: static
      content: |
        ## Linki
        - [Repozytorium projektu](https://github.com/forsetius/randomgen-nest2)
blocks:
  generators:
    type: pageGallery
    sources:
      - tag: generator
lead: |
  **RandomGen** to zbiór generatorów do gier fabularnych.
  Wszystkie generatory są modułami jednej aplikacji Node.js używającej frameworka [Nest.js](https://nestjs.com/), napisanej w TypeScript. Dostępne w dwóch trybach: za pomocą podanych niżej podstron oraz za pomocą endpointów API. 

  <block id="generators" />
---
## Moduły bazowe

Jednak generatory to oczywiście nie wszystko. Oprócz nich, RandomGen zawiera też bazowe moduły takie jak:
- `config` - wczytuje zmienne środowiskowe, waliduje je i sprawdza czy ich zestaw jest kompletny. Umożliwia też zdefiniowanie danych konfiguracyjnych a la rejestr Windows, zmapowanie tam zmiennych środowiskowych i dostęp i bezpieczny, otypowany dostęp do nich.
- `mail` - jak sama nazwa wskazuje, realizuje wysyłkę emaili. Korzysta przy tym z serwisu `templating`.
- `parser` - zawiera usługi parsujące format Markdown i wczytujące/parsujące z plików. Parser markdowna zawiera zmiany i dodatki pod moduł CMS, które umożliwiają np. stosowanie linków wewnętrznych i oznaczanie segmentów strony czy rodzaju linku.
- `security` - zawiera ograniczanie ilości żądań w razie spamowania serwera, odsiewanie spamu oraz konfigurację polityk CORS i CSP. 
- `templating` - zapewnia rendering treści przez wypełnianie szablonów danymi. W tej chwili używane w module CMS, w przyszłości zanjdzie zastosowanie w wysyłaniu wiadomości pocztą, SMS-ami czy przez PUSH.
- `cms` - realizuje funkcje renderowania treści składowanych w plikach Markdown do serwowanych statycznie plików HTML, z ewentualną domieszką HTMX. Z racji największej złożoności poświęcam mu [osobny artykuł]{pl/mod_cms}

## Dalszy rozwój

W kolejnej iteracji prac nad aplikacją dodane będą moduły `db` do bazy danych oraz `user` do obsługi rejestracji, logowania itp. Inne (np. `redis`, `sms` czy `push`) będę dodawał w miarę potrzeb.

W tej chwili moduł CMS nie wymaga bazy danych, nie ma też logowania użytkowników (bo nie ma takiej potrzeby). Docelowo zamierzam to dodać, choćby po to, żeby zrealizować wysyłkę newslettera czy powiadomień.

No i oczywiście dojdą nowe generatory. Na warsztacie jest już generator układów planetarnych, kolejnymi będą generator relacji stronnictw w mieście (fantasy, modern fantasy i SF) oraz scenariuszy do [Eclipse Phase]{pl/eclipse-phase} [RPG](https://pl.wikipedia.org/wiki/Gra_fabularna).