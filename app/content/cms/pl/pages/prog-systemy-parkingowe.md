---
template: page-default
title: Systemy parkingowe
headerImage: mid-parking-head.jpg
category: prog-doswiadczenia
sort: 1
tags:
  - o-mnie
excerpt: Systemy integrujące czujniki, kamery, wyświetlacze i aplikacje backoffice
lead: |
  Pracując dla firmy zajmującej się obsługą parkingów i opłat za parkowanie wykonałem całą serię systemów integrujących przez różnorodne API różne czujniki i przekazujące przetworzone dane z nich do urządzeń wyjściowych oraz systemów backoffice'owych.
---
## Bezpłatny bilet parkingowy
Nie, "bezpłatny bilet" to nie oksymoron. Obsługuje on sytuacje, gdy np. sklep zezwala na bezpłatne parkowanie na należącym do niego parkingu przez jakiś okres. Po jego przekroczeniu trzeba już płacić. Sklep chce zapewnić możliwość parkowania dla swoich klientów przez rozsądny czas, wystarczający na zrobienie zakupów czy pójście do kina. Jednocześnie sklep chce zapobiec np. całodobowemu parkowaniu przez lokalnych mieszkańców, którzy ograniczaliby ilość miejsc dostępnych dla klientów.

Zaimplementowałem dwie strony systemu: backoffice i obsługę API automatu parkingowego. Idea pracy z API była prosta: klient wprowadza numer rejestracyjny, system sprawdza czy już dzisiaj nie parkował i jeśli nie to wystawia bilet do określonej godziny. Z kolei backoffice pozwala przeglądać stan systemu i ew. interweniować w sytuacji zgłoszeń problemów przez klientów lub zgłoszeń reklamacyjnych.

Całość była wykonana w PHP 7 i Symfony 3 z EasyAdmin. Baza danych: PostgreSQL.

## System informacji o zajętości parkingu
System parkingowy zbierający dane z czujników parkowania w asfalcie (oraz w późniejszej wersji z kamer), agregujący dane o zajętości parkingu i przekazujący je na wyświetlacze oraz do backoffice. 

Oprócz integracji z API czujników (właściwie 3 API do różnych celów) oraz API kamer trzeba było zaimplementować przypisywanie grup czujników (i ew. kamer) do pozycji GPS i odpowiedniej sekcji parkingu. To ostatnie zrobione zostało z wykorzystaniem Postgresowego rozszerzenia PostGIS. Sam system był moją pierwszą stycznością z Node.js v6, którego użycie zaproponowałem ze względu na specyfikę pracy ciągłej. Był pisany w czystym JavaScripcie ES6.

System backoffice'owy służy do konfiguracji urządzeń i monitorowania bieżącej zajętości parkingu. Został wykonany na PHP 7 i Symfony 3 z EasyAdmin z customową kontrolką mapy wyświetlającej położenie czujnika czy obszar sekcji parkingu.

## Kamery ALPR + system opłat parkingowych
System odbierający dane z mobilnej (zamocowanej na samochodzie) kamery skanującej numery rejestracyjne zaparkowanych samochodów i sprawdzający status opłacenia postoju.

Potrzeba wprowadzenia takiego systemu wiązała się z tym, że przy rozległych Strefach Płatnego Parkowania (SPP) kontroler sprawdzający opłacenie postoju nie ma szans ogarnąć całego podległego mu terenu w rozsądnym czasie, z wymaganą częstotliwością. Stąd pomysł zamontowania na samochodzie specjalnej kamery [ALPR](https://en.wikipedia.org/wiki/Automatic_number-plate_recognition) (Automatic License Plate Recognition) i przejeżdżanie nim wzdłuż linii zaparkowanych aut. Kamera zczytuje numery mijanych samochodów i przekazuje je do systemu, który sprawdza wniesienie opłaty lub posiadanie abonamentu. Dalsze cele rozwojowe zakładały przekazywanie danych delikwentów parkujących bez opłaty bezpośrednio do systemu wystawiającego mandaty ale za moich czasów nie posiadał on jeszcze stosownego API.

W rzeczywistości integracja z API kamery i API systemu opłat to była mniejsza część pracy. Większą stanowiło wykonanie backoffice'u, w którym realizowana była konfiguracja połączenia z kamerą i terenów podlegających sprawdzeniu oraz wizualizacji w czasie rzeczywistym przebiegu kontroli. Całość wykonana była w PHP+Symfony a konfiguracja obszarów oraz wizualizacja kontroli znów wymagały PostGIS-a, ponownie w użyciu była kontrolka mapy do EasyAdmina.

Na marginesie, pamiętam, że trochę kłopotów mieliśmy z kalibracją GPS-ów. Wysłaliśmy dwoje ochotników wzdłuż ustalonej trasy po osiedlu i śledziliśmy jak ta trasa zostanie zwizualizowana. Wypadło nieźle... oprócz sąsiedztwa 15-piętrowego wieżowca i kościoła. Do tej pory nie wiem, które z nich odpowiadało za odchylenie o dobre 5 metrów od realnej ścieżki. Problem rozwiązaliśmy przez użycie opcji snap-to-road w [OSRM](https://project-osrm.org/).

## Integracja urządzeń na wjeździe/wyjeździe i systemu opłat parkingowych
System obsługi parkingu ze skanowaniem tablic rejestracyjnych pod szlabanami i integracją z systemem opłat.

System pracował tak, że w momencie, gdy pod szlabanem wjazdowym pojawia się pojazd, kamera ALPR skanuje jego tablice rejestracyjne, zachowuje je w systemie z czasem wjazdu i otwiera szlaban. Zanim kierowca wyjedzie musi opłacić postój. Gdy samochód pojawi się pod szlabanej wyjazdowym, jego tablica znów jest skanowana i następuje sprawdzenie czy opłata została wniesiona - jeśli tak to szlaban jest podnoszony.

Integracja API kamer, szlabanów i systemu opłat zrealizowana była w Node.js. Do tego jak zwykle backoffice w PHP+Symfony z EasyAdminem.
