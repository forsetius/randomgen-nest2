---
template: page-default
title: Moje umiejętności
langs:
  en: prog-skills
excerpt: Co umiem, co wiem, co mogę
headerImage: mid-moje-umiejetnosci-head.jpg
tags:
  - o-mnie
lead: |
  Programować zacząłem... jakoś w 1988. Najpierw na [Spectrum+](https://pl.wikipedia.org/wiki/ZX_Spectrum#ZX_Spectrum+_(1984)) i szkolnych [Elwro 800 Junior](https://pl.wikipedia.org/wiki/Elwro_800_Junior), potem uprosiłem rodziców i kupili mi [Atari 65XE](https://pl.wikipedia.org/wiki/Rodzina_8-bitowych_Atari#Seria_XE). Magnetofonu już mi nie kupili, żebym nie grał w gierki, tylko nauczył się czegoś pożytecznego na tym komputerze. No to się nauczyłem programować w Atari Basic.
slots:
  aside:
    - type: static
      content: |
        ## Umiejętności
        - Node.js
          - Express.js, Nest.js, TypeORM, Sequelize...
        - PHP
          - Symfony, Doctrine
        - SQL
          - MySQL, PostgreSQL+PostGIS, MSSQL
        - Docker, Git, Bash/Zsh
---
Fast forward, 9 pracodawców i paru zleceniodawców później jestem programistą backendowym aplikacji internetowych. Jeszcze do niedawna robiłem głównie w PHP, najczęściej z Symfony, teraz zdecydowanie bardziej interesuje mnie Node.js pisany w TypeScripcie. 

### Dlaczego Node? 
Filozofia życiowa:   nie lubię marnotrawstwa. W PHP czas życia aplikacji jest ściśle związany z cyklem życia requestu - tak w skrócie: żądanie wpada na serwer, ten przekazuje je do modułu PHP, przez router, kontroler, jakieś usługi itd. jest konstruowana odpowiedź, kontroler odpowiada... i koniec, cała misterna architektura obiektów idzie w kosz. Pewnie, są przyspieszające proces cache, ale wciąż - dla mnie to marnotrawstwo. Tymczasem w Node.js robisz sobie serwer aplikacji, który przyjmuje żądania, przetwarza je i odpowiada... po czym pracuje dalej. Głównie na przygotowanych na starcie aplikacji kontrolerach i serwisach. I też może przecież używać cache.

Druga rzecz: asynchroniczność. Urzekło mnie, że w JS operacje nie muszą się blokować, wykonując się jedna po drugiej. Jasne, są PECL-owe rozszerzenia _pthreads_ czy _parallel_, są kolejki itp. ale to są dodatki, bo sam język PHP jest synchroniczny. Za to asynchroniczność jest wrośnięta w JavaScript i może być stosowana w każdej najdrobniejszej operacji, której nikomu nie chciałoby się implementować asynchronicznie w PHP. W zasadzie w JS trzeba wymuszać synchroniczność :)

### Dlaczego TypeScript?
Bo mocne typowanie. _(słownie: kropka)_

Wszystkie zmienne mają ściśle określony typ, a operacje między różnymi typami są kontrolowane lub niedozwolone bez jawnej konwersji. Czyli nie ma dowolności w przesyłaniu argumentów do funkcji, jakiś dziwnych niejawnych konwersji, domyślania się co też wchodzi, a co wychodzi z danego kawałka kodu. Błędy typowania są wyłapywane już na etapie kompilacji, zanim kod zostanie uruchomiony. Łatwiej unikać typowych problemów, takich jak błędne przekazywanie parametrów czy niezgodność struktur danych. Lepsza jest czytelność kodu a jego utrzymanie - łatwiejsze. Narzędzia programistyczne działają skuteczniej, co przekłada się na wyższą produktywność. W efekcie TypeScript zmniejsza ryzyko błędów w aplikacji i sprzyja tworzeniu bardziej przewidywalnego oprogramowania.


## Dodatkowe umiejętności
Oczywiście PHP, Symfony, Node, TypeScript, Nest.js to nie wszystko. Jako programiści nie pracujemy w silosach i jakieś doświadczenie z pokrewnych dziedzin trzeba mieć - choćby żeby wiedzieć, o czym mówią frontendowcy czy devopsi a najczęściej, żeby móc samemu rozwiązać pewne problemy, nie czekając na pomoc innych członków zespołu. Znajomość samego używania Dockera to obecnie must have, ale potrafię również zdockeryzować aplikację. MySQL, PostgreSQL (również z PostGIS) - nie ma problemu, miałem też doświadczenie z MSSQL. Z pisaniem zapytań SQL oczywiście również, także na obiektowo - w Doctrine czy TypeORM. 

PHP czy Node.js używałem również "nietypowo" - np. w aplikacjach CLI. Zwykle były to małe rzeczy, skrypty używane w sytuacji, gdy zwykłe skrypty shellowe stawały się przekomplikowane i zwyczajnie trudne w utrzymaniu. Napisałem też bota do Discorda w Node.js.
