---
template: page/default-sf
title: Generator technobełkotu
langs:
  en: generator-technobabble
headerImage: startrek-engineers-head.jpg
excerpt: |-
  Generator startrekowego technobełkotu losujący frazę, która mogłaby paść z ust Scottiego, O’Briena, czy LaForge'a.
lead: |
  Czy to "The Original Series", "The Next Generation" czy "Deep Space 9", oglądając "Star Treka" regularnie widzimy czerwony alert, emocje sięgają zenitu, statek/stację czeka zagłada... gdy nagle Główny Inżynier unosi błyszczące oczy i znajduje rozwiązanie! "Musimy tylko..."
tags:
  - generator
  - startrek
  - sf

blocks:
  technobabbleGenerator:
    type: apiCall
    template: block/form-technobabble
    url: /api/1.0/startrek/technobabble?lang=pl

slots:
  asideRight:
    - type: static
      content: |
        ## Warunki użycia
        Użycie jest oczywiście darmowe, nie używam też żadnych Waszych danych. 

        Jedynie przy integracji tego generatora do jakiś aplikacji czy narzędzi proszę o atrybucję i zgłoszenie mi tego (w celu łechtania ego i podbijania motywacji do dalszej pracy)
    - type: static
      content: |
        ## Technikalia
        Generator wystawia również API. O tym oraz o szczegółach implementacji możesz poczytać na stronie [Technikalia]{pl/generator-technobelkotu-technikalia}
---

I tu na scenę wchodzi **Generator Technobełkotu**. Tworzy on losową, 5-wyrazową frazę, która nie znaczy nic, ale brzmi bardzo mądrze i technicznie. Przykładowo:

> ...zresetować wtórny sprzęg fazy tetrionowej

Imponujące, nieprawdaż? Nic tylko wycedzić: _"make it so!"_ i wziąć się do roboty.

## Użycie

A więc jesteś np. w środku sesji Star Trek Adventures RPG i chcesz błysnąć jako inżynier czy inny jajogłowy? Nic prostszego, kliknij przycisk poniżej:

<block id="technobabbleGenerator" />
