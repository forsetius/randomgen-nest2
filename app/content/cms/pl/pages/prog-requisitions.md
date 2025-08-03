---
template: page-default
title: Zapotrzebowanie na narzędzia
langs:
  en: prog-requisitions
excerpt: Aplikacja mobilna pozwalająca pracownikom wnioskować o zakup narzędzi
headerImage: mid-requisition-head.jpg
category: prog-doswiadczenia
sort: 5
tags:
  - o-mnie
slots:
  aside:
    - type: static
      content: |
        ## Technologie
        - Node.js + TypeScript
        - Nest.js
        - MySQL
---
 
Załóżmy, że jesteśmy menedżerem w firmie budowlanej i mamy pod sobą pracowników fizycznych, którzy pracują na rozproszonych budowach. Jednym z problemów, z którymi możemy się mierzyć, są niekontrolowane zakupy narzędzi przez pracowników. Ot, ekipa wyjeżdżająca z bazy zapomni zestawu kluczy albo na miejscu połamią im się wiertła. I w takiej sytuacji majster podjeżdża do najbliższego sklepu i kupuje kolejne. Czasem to ma uzasadnienie, a czasem tylko niepotrzebnie generuje koszty.

Aplikacja, której backend robiłem, rozwiązuje ten problem w ten sposób, że pracownik może złożyć w aplikacji zapotrzebowanie na towar i otrzymać (lub nie) zgodę przełożonego na zakup. Uzyskawszy zgodę, ma określony czas, by zrealizować zamówienie. 

Ta w sumie dość prosta aplikacja miała jednak dwa bardziej skomplikowane elementy: onboarding firmy, który wymagał zintegrowania z norweskim rejestrem przedsiębiorstw oraz implementacja zmian stanów encji zapotrzebowania, zrealizowana za pomocą wzorca Stanu. Do tego zaimplementowałem wysyłkę emaili, SMS-ów i notyfikacji PUSH.

Całość została wykonana w Nest.js z użyciem TypeScripta. Było to kolejne już wdrożenie na tym duecie i w efekcie z końcowego dzieła można było wypreparować "szablon" aplikacji Nestowej. W ten sposób zrobiłem coś, co mogło stanowić szkielet nowej aplikacji z modułami do ApiDoc, konfiguracji, połączenia z bazą danych, szablonami, wysyłką powiadomień itd. Wszystko dopracowane w paradygmacie Nest.js, przetestowane na produkcji, udokumentowane.
