---
template: page-default
title: Pośrednictwo pracy
headerImage: mid-work-head.jpg
excerpt: Rozbudowany system rozgłaszania ogłoszeń o pracę i zbierania aplikacji
category: prog-doswiadczenia
sort: 4
tags:
  - o-mnie
slots:
  aside:
    - type: static
      content: |
        ## Technologie
        - PHP 7.4 + Laravel
        - Node.js + TypeScript
        - Python
        - MySQL
---
W tym projekcie pracowałem dla niemieckiego klienta, który miał swój dedykowany zespół deweloperski, ale potrzebował wsparcia. W zespole rozwijaliśmy system pośrednictwa pracy, którego różne części zbierają aplikacje kandydatów, rozsyłają je po portalach rekrutacyjnych, kojarzą kandydatów z propozycjami pracy itd.

Klient miał bogaty ekosystem różnych serwisów, które pomagałem utrzymywać i rozwijać. Poszczególne jego części były napisane w PHP+Laravel, inne w Node.js+TypeScript, zdarzyła się też pisana w Pythonie. Do tego MySQL, ElasticSearch, ładnie zdockeryzowane.

I tak, moim zadaniem było pracować z każdą z tych technologii, często przenosząc je na nowe wersje czy - jak w przypadku serwisu Pythonowego - iteracyjnie przenosić je na inne technologie. Generalnie, celem było zminimalizowanie długu technologicznego powstałego przy organicznym rozwoju platformy. W związku z tym robiłem też skrypty CLI usprawniające rutyny deweloperskie - i w Bashu i w Node.js.

Kolejnym moim zadaniem była implementacja generatorów treści dedykowanych poszczególnym portalom rekrutacyjnym. Było ich sporo a dochodziły kolejne, do których trzeba było dorobić strategie. Wreszcie, wykonałem od podstaw nową wersję serwisu tworzącego feedy dla portali rekrutacyjnych. Napisałem go w Node.js+TypeScript i jednocześnie przyspieszył proces generacji treści, jak i zredukował zużycie zasobów.
