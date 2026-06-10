---
template: page/default-sf
title: Generator technobełkotu
subtitle: Technikalia
langs:
  en: generator-technobabble-technical
headerImage: startrek-engineers-head.jpg
excerpt: |-
  API i inne technikalia generatora startrekowego technobełkotu.
lead: |
  No dobrze, [Generator technobełkotu]{pl/generator-technobelkotu} jest dość prosty, szczególnie w wersji angielskiej. W polskiej to wiadomo, "polska język - trudna język", trzeba było uzgodnić ze sobą te wszystkie rodzaje, liczby i inne rzeczy, które były na polskim w podstawówce i które potem się już w życiu nie przydają.

tags:
  - generator
  - startrek
  - sf

slots:
  asideRight:
    - type: static
      content: |
        ## Endpointy API 
        - [polski](https://forseti.pl/api/1.0/startrek/technobabble?lang=pl)
        - [angielski](https://forseti.pl/api/1.0/startrek/technobabble?lang=en)

        ## Słowniki fraz 
        - [polski](https://github.com/forsetius/randomgen-nest2/blob/master/app/content/technobabble/startrek-pl.json)
        - [angielski](https://github.com/forsetius/randomgen-nest2/blob/master/app/content/technobabble/startrek-en.json)
---

## Dostęp przez API

Jeśli potrzebujesz zintegrować ten generator do jakiegoś swojego narzędzia, wyślij żądanie HTTP:

```
GET https://forseti.pl/api/1.0/startrek/technobabble
```

Opcjonalnie w query stringu można dodać dwa parametry:

- `lang` - język, dozwolone wartości: `en` lub `pl`. Domyślnie: `pl`
- `repeat` - ile fraz wylosować. Dozwolone wartości: od `1` do `20`, domyślnie: `1`

Odpowiedź jest czystym tekstem. Jeśli `repeat` > 1 to frazy są rozdzielane nową linią

## Technikalia

Generator ten zaimplementowałem jako moduł aplikacji w Node.js+TypeScript, opartej na NestJS. Obsługuje języki: polski i angielski, z możliwością dodania kolejnych. Poszczególne słowa (lub w języku polskim - zestawy form gramatycznych danego słowa) są zaczytywane z plików JSON.

Jeśli chciałbyś pomóc mi zaimplementować nowy język albo dodać jakieś klawe słownictwo to zapraszam do [kontaktu]{pl/kontakt}.
