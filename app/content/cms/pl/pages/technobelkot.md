---
template: page-default
title: Generator technobełkotu
headerImage: index-head.png
thumbnailImage: index.jpg
lead: |
  Czy to "The Original Series", "The Next Generation" czy "Deep Space 9", oglądając "Star Treka" regularnie widzimy czerwony alert, emocje sięgają zenitu, statek/stację czeka zagłada... gdy nagle Główny Inżynier unosi błyszczące oczy i znajduje rozwiązanie! "Musimy tylko..."
---

I tu na scenę wchodzi **Generator Technobełkotu**. Tworzy on losową, 5-wyrazową frazę, która nie znaczy nic ale brzmi bardzo mądrze i technicznie. Przykładowo:

> ...zresetować wahliwe filtry rezonatora tachionów!

Imponujące, prawda? Nic tylko wycedzić zduszone "make it so!" i wziąć się do roboty, nieprawdaż?

## Użycie

A więc jesteś w środku sesji Star Trek Adventures RPG i chcesz błysnąć jako inżynier czy inny jajogłowy? Nic prostszego, kliknij poniższy przycisk:


## Technikalia

Nie oszukujmy się, jest to dość prosty generator, szczególnie w wersji angielskiej. Polska język - trudna język, trzeba było uzgodnić ze sobą te wszystkie rodzaje, liczby i inne rzeczy, które były na polskim w podstawówce i które przyszłemu programiście już na pewno się w życiu nie przydadzą. Bo np. jeśli myśleliście, że w naszym pięknym, nie-gęsim języku są tylko trzy rodzaje to ktoś Was srogo oszukał!

Ale technikalia. Generator ten zainmplementowałem jako moduł aplikacji w Node.js+TypeScript, opartej na NestJS. Obsługuje język polski i angielski, z możliwością dodania kolejnych. Poszczególne słowa (lub w języku polskim - zestawy form gramatycznych danego słowa) są zaczytywane z plików JSON. Jeśli ktoś chciałby pomóc mi zaimplementować nowy język albo dodać jakieś klawe słownictwo to zapraszam do kontaktu.