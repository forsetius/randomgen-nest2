---
template: page-default
title: Rozmowy 1&#8209;na&#8209;1
langs:
  en: prog-1on1
excerpt: Narzędzie dla działów HR do rozmów z pracownikami
headerImage: mid-hr-1on1-head.jpg
category: prog-doswiadczenia
sort: 2
tags:
  - o-mnie
slots:
  aside:
    - type: static
      content: |
        ## Technologie
        - ADFS + Auth0 (uwierzytelnianie)
        - Node.js + Express.js + Sequelize
        - PostgreSQL
---
To narzędzie odpowiadało na potrzebę usprawnienia zarówno przebiegu, jak i efektów procesów HR w dużej korporacji sektora finansowego. Jest to narzędzie dla działów HR do planowania, przeprowadzania i monitorowania efektów rozmów 1&#8209;na&#8209;1, np. ocen rocznych. 

Nasz kilkuosobowy zespół składał się m.in. z Duńczyka, Rumuna, Litwina i nas - Polaków. Oczywiście wszyscy bardzo dobrze mówiliśmy po angielsku, więc dogadywaliśmy się bez problemu. Ogólnie dobrze wspominam tę współpracę a szczególnie tydzień wspólnego kodowania w siedzibie klienta (tu pozdro dla Bartka, rzecznego amanta 😉). 

Jeśli chodzi o sam projekt, to niestety nie było to robienie od zera - dostaliśmy odziedziczony kod bez żadnej dokumentacji i bez testów, przez który trzeba się było przegryzać. Miejscami był tak zagmatwany, że lepiej było napisać go od zera, co też z ulgą robiliśmy. Dźwignęliśmy to i na odziedziczonym zrębie dorobiliśmy wszelkie niezbędne funkcjonalności. Z godnych wspomnienia były to:

- uwierzytelnianie zintegrowane z Active Directory korporacji, z użyciem Auth0
- użytkownicy i ich zespoły były mapowane do aplikacji w ramach codziennej (właściwie conocnej) synchronizacji
- integracje ze Stripe, Sendgrid, Slack, Google Calendar
- CRUD-owe endpointy do zarządzania spotkaniami, ich szablonami i agendą, celami i zadaniami dla pracowników oraz feedbackiem
