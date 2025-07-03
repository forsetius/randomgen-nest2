---
template: page-default
title: Backoffice kasyn
headerImage: mid-casino-head.jpg
excerpt: Platforma obsługująca kasyna, gry, płatności oraz wszelkie działania związane z graczami
lead: |
  Kompleksowa platforma backoffice'owa do zarządzania kasynami online. System zarządza wieloma kasynami, z których każde może oferować różne gry od różnych dostawców. Dostępna jest obsługa graczy, przeprowadzanie różnych wymaganych prawem sprawdzeń (PEP, dokumenty gracza, przeciwdziałanie praniu pieniędzy), analiza transakcji (w tym wpłat, wypłat, potencjalnych oszustw) itd.
category: prog-doswiadczenia
sort: 3
tags:
  - o-mnie
slots:
  aside:
    - type: static
      content: |
        ## Technologie
        - PHP 8 + Symfony 6
        - Node.js + TypeScript
        - Serverless
---
Był to największy projekt, w jakim pracowałem. W sumie pracowało przy nim kilkunastu programistów, devopsów i testerów. Dzielił się na kilka niezależnych serwisów, z czego ja pracowałem przy backendzie backoffice'owym, module security oraz module raportów. 

Mieliśmy komfort zaczęcia od zera, więc przygotowaliśmy kompleksową architekturę z zastosowaniem m.in. CQRS z event sourcingiem i pełnym pokryciem testami. Pracowaliśmy w najnowszej (ówcześnie) wersji PHP i Symfony, w zdockeryzowanym środowisku.

Nad projektem pracowałem od jego początku, implementując zarówno podstawowe funkcjonalności (system list i filtrów, system uprawnień) jak i bardziej skomplikowaną logikę biznesową, np. związaną z weryfikacjami graczy, systemami odpowiedzialnej gry, strategiami obsługi dostawców płatności i dostawcami gier itp.

Kiedy nawał pracy zelżał przeszedłem do innych projektów ale wróciłem, gdy zaistniała potrzeba wykonania modułu raportów. Tym razem robiliśmy to w Node.js w TypeScripcie, na AWS Lambda. Były to operacje na dużych zbiorach danych, więc idea była taka, że serwis odbiera żądanie wygenerowania raportu, potwierdza to żądanie, po czym przetwarza je w tle, a wyniki zapisuje w plikach CSV i XLS. Same raporty były dość różnorodne ale mimo wszystko udało mi się przygotować odpowiednie abstrakcje do poszczególnych faz przetwarzania i wszystko działało w przejrzysty, łatwy do ogarnięcia sposób.

Tym razem nie używaliśmy Nest.js tylko czystego Node'a z TypeORM-em. Do tego modułu przygotowałem również kompleksowe testy i dokumentację.
