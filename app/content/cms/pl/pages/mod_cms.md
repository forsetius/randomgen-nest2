---
template: page-default
title: mod_cms
headerImage: mid-cms-module.jpg
langs:
  en: mod_cms
excerpt: Moduł CMS generujący statyczne strony HTML
tags:
  - projekty
slots:
  aside:
    - type: static
      content: |
        ## Linki
        - [Repozytorium projektu](https://github.com/forsetius/randomgen-nest2)
        - [Mniej techniczny opis]{pl/2025-08-06_modul-cms}

lead: |
  **Mod_CMS** to system CMS ([content management system](https://pl.wikipedia.org/wiki/System_zarz%C4%85dzania_tre%C5%9Bci%C4%85)) zrealizowany w Node.js i TypeScript jako moduł aplikacji w NestJS.
---

Jego działanie polega na tym, że łączy treść trzymaną w plikach Markdown (z front-matterem w YAML) z szablonami Nunjucks i publikuje jako gotowe, statyczne strony HTML. W efekcie warstwa serwowania może pozostać bardzo lekka — pliki są wystawiane bezpośrednio przez Express (pod Nest.js), a tam, gdzie ma to uzasadnienie, można domieszać punktową dynamikę dzięki HTMX. Zasada jest prosta: treść i metadane są źródłem prawdy, layout i filtry odpowiadają za prezentację, a budowanie następuje przed serwowaniem.

Silna strona tego podejścia to przewidywalność. Każda strona jest deterministycznym wynikiem: Markdown → HTML (z rozszerzeniami), następnie layout Nunjucks → finalny plik. Walidacja metadanych przez Zod pozwala zatrzymać publikację, jeśli brakuje kluczowych pól, a rozszerzenia parsera dbają o jakość wyjścia, np. generując stabilne identyfikatory nagłówków czy przepisując linki wewnętrzne do spójnych URL-i. Całość wspiera i18n dzięki równoległym drzewom językowym, a obrazy, skrypty itp. są serwowane statycznie.

## Funkcjonalności
- metadane w front-matter - z walidacją: tytuł, opis, kategoria, tagi, data, obrazy OG, flagi indeksowania,
- rozszerzony Markdown: stabilne id dla nagłówków (unikalne w obrębie strony), własna notacja linków wewnętrznych i kontrola atrybutów linków zewnętrznych,
- Nunjucks: layout bazowy, partiale (head, header, footer, breadcrumb), filtry (np. formatowanie dat przez Luxon),
- i18n: równoległe drzewa /pages/pl/… oraz /pages/en/…,
- SEO/social: wypełnienie meta/OG/Twitter na podstawie front-matter,
- serwowanie statyczne: szybkie, bez angażowania kontrolerów dla gotowych stron

## Decyzje architektoniczne

Projekt kieruje się zasadą „build-time first”. Najpierw powstają gotowe pliki, a dopiero później są serwowane, co przenosi koszt obliczeń z czasu żądania na czas publikacji i upraszcza zachowanie systemu pod obciążeniem. 

Treść wraz z metadanymi pozostaje oddzielona od prezentacji: Markdown jest nośnikiem informacji oraz metadanych, a Nunjucks zarządza layoutem i kompozycją widoków. Takie rozdzielenie ułatwia wymianę skórki, reorganizację sekcji czy zmianę szablonów bez ryzyka modyfikacji materiałów źródłowych.

Walidacja metadanych została ustawiona w trybie „fail-fast”, aby natychmiast wstrzymywać pipeline w razie braków lub niespójności. Błędy wychwytywane są wcześnie, gdzie koszt ich naprawy jest najniższy. Budowanie jest deterministyczne: te same wejścia skutkują tym samym wyjściem, włączając w to stabilne identyfikatory nagłówków i spójne adresy odnośników wewnętrznych. Taka przewidywalność sprzyja testom snapshotowym i powtarzalnym wydaniom.

Domyślnym trybem jest serwowanie statyczne, które wystawia `/pages`, `/media` i `/ui` (skrypty i CSS) bez angażowania kontrolerów Nest.js. Dzięki temu zyskuje się prostotę, mniejsze obciążenie i czytelny model cache’owania. Rozszerzenia — czy to niestandardowe reguły dla Markdowna, czy filtry Nunjucks — są zamknięte w małych, łatwych do testowania modułach, co ogranicza zasięg zmian i ułatwia utrzymanie. Warstwa i18n opiera się na równoległych drzewach językowych (`/pl` i `/en`), co pozwala różnicować metadane i strukturę bez ryzyka mieszania języków.

Dynamika pozostaje w ryzach: HTMX traktowane jest jako dodatek do statycznej bazy. W efekcie profil wydajności przypomina serwis „prawie statyczny”, ale z opcją dołożenia interaktywności tam, gdzie daje to realny zysk.

## Wysokopoziomowa implementacja

Całość składa się z kilku współpracujących warstw. Przetwarzanie Markdowna odpowiada za render i rozszerzenia (identyfikatory nagłówków, przepięcie linków). Renderer Nunjucks zajmuje się layoutem, partialami i filtrami. Generator wiąże te kroki w spójny pipeline publikacji i zapisuje wynikowy HTML w strukturze statycznej. Niezależnie montowane są katalogi statyczne w Expressie, co pozwala traktować serwer jak klasycznego hosta plików, a logikę Nest.js pozostawić wolną od serwowania gotowych stron. Tam, gdzie przewidziano to w layoutach, wprowadzane są miejsca pod HTMX, aby uzupełniać treść lekkimi fragmentami.

## Przepływ sterowania

1. wczytanie pliku `.md`, rozdzielenie front-matter i treści,
2. walidacja metadanych (Zod),
3. render Markdown → HTML z rozszerzeniami (m.in. unikalne id nagłówków, linki wewnętrzne),
4. złożenie HTML z layoutem Nunjucks i partialami,
5. zapis gotowej strony do drzewa statycznego (`/content/static/pages/<lang>/…`),
6. serwowanie statyczne przez Express (Nest.js

## Dynamika przez HTMX

HTMX pełni tu rolę precyzyjnie aplikowanego dodatku, a nie fundamentu interfejsu. Layouty przewidują miejsca, w których można włączyć atrybuty hx-* (np. hx-get, hx-boost, hx-target, hx-swap) i zasilać je lekkimi endpointami zwracającymi gotowe fragmenty HTML. Dzięki temu większość stron pozostaje w pełni statyczna, a tylko te sekcje, które faktycznie na tym zyskują, pobierają dane dynamicznie.

Ważne jest zachowanie czytelnych granic odpowiedzialności. Dokument HTML powinien być kompletny i użyteczny sam w sobie, a fragmenty wstrzykiwane przez HTMX jedynie go uzupełniają — na przykład o listy powiązanych treści, drobne widgety czy komentarze. Sprzyja to idempotencji i przewidywalności: endpointy dostarczające HTML mają mały zakres, są spójne z konwencją layoutu i łatwo je testować, chociażby snapshotami. Istotne jest również konsekwentne używanie `hx-target` i `hx-swap`, tak aby każdy fragment miał stabilne selektory i jednoznacznie określony punkt wstrzyknięcia; unika się w ten sposób komplikowania DOM-u „przepisami na krzyż”. Zgodnie z duchem minimalizmu nie wprowadza się dodatkowych warstw stanu tam, gdzie wystarczy `hx-boost` i prosty `hx-get`. 

## Podsumowanie

Moduł cms łączy pragmatyzm generatora statycznych stron z elastycznością fragmentów HTMX. Treść i metadane są przetwarzane do przewidywalnego HTML-a, który serwowany jest jak zwykły plik, a interaktywność dokładana jest tam, gdzie wzmacnia doświadczenie użytkownika bez nadmuchiwania złożoności. Taki układ wspiera szybkie ładowanie, stabilne buildy i przejrzyste utrzymanie, a przy tym zostawia miejsce na rozwój layoutu, strukturę i automatyzację publikacji.

## Dalszy rozwój

W tej chwili moduł CMS nie wymaga bazy danych, nie ma też logowania użytkowników (bo nie ma takiej potrzeby). Docelowo zamierzam to dodać, choćby po to, żeby zrealizować wysyłkę newslettera czy powiadomień.
