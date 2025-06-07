---
template: page-blog-post
title: Afera wokół Fakera
headerImage: mid-afera-fakera-head.jpg
#thumbnailImage: mid-afera-fakera-head.jpg
category: blog
date: 2022-01-11
excerpt: Sabotaż w pakietach NPM `colors` i `faker`
lead: |-
  Był sobie programista. Kodował open source’owe pakiety do Node.js i udostępniał je społeczności przez zwykłe kanały (GitHub, NPM). 
  Prywatnie miał na koncie romans z teoriami spiskowymi, pożar we własnym mieszkaniu i śledztwo w kierunku terroryzmu ale swoje robił. 
  A teraz nagle się zbiesił i zaczął sabotować swoje – i niestety nie swoje – projekty.
tags:
  - open-source
slots:
  aside:
    - type: static
      content: |
        ## Źródła
        - Techniczny opis problemu z `colors`: 
            [Dev corrupts NPM libs 'colors’ and 'faker’ breaking thousands of apps](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/)
        - Doniesienie o pożarze w domu Maraka: 
            [Neighbor on Queens man with bomb-making equipment:…](https://abc7ny.com/suspicious-package-queens-astoria-fire/6425363/)
        - Status projektu `colors`: 
            [(Semi-Official) Status Update](https://github.com/Marak/colors.js/issues/317)
    - type: static
      content: |
        ## Test
        Abcde
---

Ekosystem aplikacji pisanych w Node.js zakłada przy ich pisaniu korzystanie z gotowych klocków oferujących jakieś cząstkowe funkcjonalności zamiast pisania ich samemu przez programistę. Na przykład programista w swojej aplikacji nie musi od nowa wynajdować koła i pisać funkcji obsługujących kolorowanie czy tworzenie zmyślonych danych do testów, bo deklaruje tylko użycie odpowiednich pakietów, które zostały udostępnione za darmo społeczności. Fajne i w sumie logiczne, nie?

I teraz załóżmy, że piszemy aplikację-bloga. Uruchamia ona serwer, który przyjmuje żądania od użytkowników, robi z nimi coś ważnego i odpowiada użytkownikowi. Robi różne rzeczy, ale to jest ta główna funkcjonalność, na której się skupiamy. Ale obok głównej funkcjonalności są też drobne detale poboczne: trzeba napisać testy, żeby sprawdzić, czy nowy kod działa i nie psuje starego no i przydałyby się jakieś narzędzia do cyklicznych prac porządkowych, na przykład podsumowania aktywności na blogu za dany dzień i wysłanie tego mailem.

Więc potrzebujemy narzędzia do testowania i narzędzia do odpalania skryptów z linii poleceń (CLI). Ok, to zaciągamy odpowiednie pakiety z serwisu NPM. Dochodzimy do wniosku, że do testów potrzebujemy narzędzia, które wylosuje nam imię i nazwisko użytkownika do testów – ok, następny pakiet z NPM. W podobny sposób zbudowane są pakiety, które zaciągamy – one również mają swoje zależności. Np. pakiet do obsługi CLI może mieć wbudowane kolorowanie tekstu, który wypisuje w konsoli. Czyli ma zależność do pakietu kolorowania. No ma to ma, zaciągnie się jeden pakiet więcej, nie?

Więc deklarujemy te swoje zależności, uruchamiamy komendę `npm install` i siup! się instaluje. Cacy, choć na końcu okazuje się, że zadeklarowaliśmy kilkanaście zależności, ale te zależności miały zależności, które miały swoje zależności… no i `npm` oznajmia, że zainstalował kilkaset pakietów, z których sto kilkanaście szuka finansowania.

Jednym z tych programistów szukających wsparcia jest Marak Squires, który jest autorem pakietów `faker` i `colors`. A w zasadzie był, bo GitHub zawiesił mu konto i odciął go od wszystkich projektów, a NPM też już go nie chce.

Marak zaczął bowiem nie tyle prosić co domagać się zapłaty za używanie jego kodu. W środowisku chodzą różne ploty – od tego, że wpadł w sidła hazardu po takie, że spalił mu się dom i jest w realnej potrzebie. Otóż dom Maraka faktycznie spłonął pod koniec 2020, a Marak trafił do szpitala. Okazało się jednak, że zapaliły się substancje chemiczne używane do produkcji materiałów wybuchowych, z którymi pracował. Było w tej sprawie śledztwo — nie wiem, czy i jak się skończyło.

Teraz zaś Marak się wkurzył i zaczął sabotować swoje projekty: wyczyścił repozytorium `faker`-a a z `colors` zrobił coś gorszego – wprowadził nieskończone zapętlenie. Czyli w zasadzie sabotował swój projekt

Wróćmy do naszej aplikacji-bloga. W dobrej wierze co jakiś czas uaktualniamy te nasze pakiety – bo przecież wychodzą poprawki, łatki na błędy, nowe funkcje – i nagle nasza aplikacja przestaje działać. Co, jak, ale ja nic nie zrobiłem! Poza tym zwykle działa, rozwala się tylko, jak musi skorzystać z tych nieszczęsnych kolorków, co nie jest od razu oczywiste. A obrazek tytułowy przedstawia efekt wprowadzenia złośliwych zmian.

Więc ów Marak miał kosę z korporacjami, które biorą za darmo, programista nic z tego nie ma, a te kolosy zarabiają krocie. Deklarował, że jeśli chcą korzystać na jego pracy to niech mu płacą 6-cyfrowo itd. Cóż, korporacje to mają wdrożone ścisłe polityki aktualizacji zależności, więc ich to nie ruszy – za to oberwą mali i średni gracze, a przede wszystkim nowicjusze. To dość popularny pakiet więc pewnie w kilkunastu-kilkudziesięciu tysiącach projektów zaczął się alarm.

I to nie jest tylko sensacyjny nius. Na koniec zostaje otwarte pytanie: jak finansować oprogramowanie open source, które w dużej mierze powstaje dzięki pracy pasjonatów i udostępniane jest za darmo. I przede wszystkim kod jest jawny, więc jak komuś nie podoba się licencja, to może sobie wziąć kod i wydać go jako swój. I później programisto trzeciego świata weź i udowodnij gigantowi z pierwszego świata, że naruszył twoją własność intelektualną.

Według mnie gość zrobił źle i chyba ma coś z głową. Ale fakt jest faktem, że świat Open Source ma problem z finansowaniem. Natknąłem się na to, gdy robiłem aplikację w Nest.js – bardzo popularnego polskiego frameworku, który wykorzystuje do obsługi bazy danych pakiet TypeORM. Autor Nesta poradził sobie biznesowo i oprócz przyjmowania datków organizuje szkolenia itp. Natomiast autor TypeORM musiał w pewnym momencie na ponad pół roku zawiesić rozwijanie swojego pakietu, żeby w inny sposób zarabiać na życie. A jego produkt jest topowy w swojej niszy – tylko że niewidoczny, bo jest zależnością.
