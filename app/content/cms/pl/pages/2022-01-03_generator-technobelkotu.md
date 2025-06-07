---
template: page-blog-post
title: Generator technobełkotu
headerImage: startrek-engineers-head.png
#thumbnailImage: startrek-engineers-head.png
category: blog
date: 2022-01-03
excerpt: |-
  Generator startrekowego technobełkotu losujący frazę, która mogłaby paść z ust Scottiego, O’Briena, czy LaForge'a.
lead: |
  Czy to "The Original Series", "The Next Generation" czy "Deep Space 9", oglądając "Star Treka" regularnie widzimy czerwony alert, emocje sięgają zenitu, statek/stację czeka zagłada... gdy nagle Główny Inżynier unosi błyszczące oczy i znajduje rozwiązanie! "Musimy tylko..."
tags:
  - generator
  - startrek
  - fantastyka
slots:
  aside:
    - type: static
      content: |
        ## Źródła
        - Repozytorium kodu: [technobabble](https://github.com/forsetius/randomgen)
        - Endpointy API: [polski](https://forseti.pl/api/1.0/startrek/technobabble?lang=pl), [angielski](https://forseti.pl/api/1.0/startrek/technobabble?lang=en)
        - Źródło fraz: [polskich](https://github.com/forsetius/randomgen/blob/dev/dict/technobabble-pl.json), [angielskich](https://github.com/forsetius/randomgen/blob/dev/dict/technobabble-en.json)
        ## Warunki użycia
        Użycie jest oczywiście darmowe, nie używam też żadnych Waszych danych. Jedynie przy integracji tego generatora do jakiś aplikacji czy narzędzi proszę o atrybucję i zgłoszenie mi tego (w celu łechtania ego i podbijania motywacji do dalszej pracy)
---
I tu na scenę wchodzi **Generator Technobełkotu**. Tworzy on losową, 5-wyrazową frazę, która nie znaczy nic ale brzmi bardzo mądrze i technicznie. Przykładowo:

> **zsynchronizować wielomodalny podtrzymywacz obrazowania kwantowego**

Imponujące, nieprawdaż? Nic tylko wycedzić zduszone "make it so!" i wziąć się do roboty.

No dobrze, jest to dość prosty generator, szczególnie w wersji angielskiej. W polskiej to wiadomo, "polska język - trudna język", trzeba było uzgodnić ze sobą te wszystkie rodzaje, liczby i inne rzeczy, które były na polskim w podstawówce i które przyszłemu programiście na pewno już się w życiu nie przydadzą. A np. jeśli myśleliście, że w naszym pięknym, nie-gęsim języku są tylko trzy rodzaje, to ktoś Was srogo oszukał!

## Użycie

A więc jesteś np. w środku sesji Star Trek Adventures RPG i chcesz błysnąć jako inżynier czy inny jajogłowy? Nic prostszego, kliknij poniższy przycisk:

<block id="generateBtn" type="apiCall" template="partial-technobabble" url="/api/1.0/startrek/technobabble?lang=pl"></block>

## Dostęp przez API

Jeśli potrzebujesz to zintegrować do jakiegoś swojego narzędzia to wyślij żądanie HTTP na:

```
GET https://forseti.pl/api/1.0/startrek/technobabble
```

Opcjonalnie w query stringu można dodać dwa parametry:
- `lang` - język, dozwolone wartości: 'en' lub 'pl'. Domyślnie: 'pl'
- `repeat` - ile fraz wylosować. Dozwolone wartości: od 1 do 20, domyślnie: 1

Odpowiedź jest czystym tekstem. Jeśli `repeat` > 1 to frazy są rozdzielane nową linią

## Technikalia
Generator ten zainmplementowałem jako moduł aplikacji w Node.js+TypeScript, opartej na NestJS. Obsługuje język polski i angielski, z możliwością dodania kolejnych. Poszczególne słowa (lub w języku polskim - zestawy form gramatycznych danego słowa) są zaczytywane z plików JSON. Jeśli ktoś chciałby pomóc mi zaimplementować nowy język albo dodać jakieś klawe słownictwo to zapraszam do kontaktu.
