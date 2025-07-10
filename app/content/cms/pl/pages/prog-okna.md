---
template: page-default
title: Aplikacja dla producenta okien
headerImage: mid-windows-head.jpg
excerpt: Aplikacja z przeglądem zamówień, dokumentów i wypożyczeń stojaków
category: prog-doswiadczenia
sort: 6
tags:
  - o-mnie
slots:
  aside:
    - type: static
      content: |
        ## Technologie
        - PHP 8 + Symfony
        - MSSQL
---
Ten projekt to często spotykana rzecz: firmowa aplikacja, która usprawnia interakcję użytkownika z przedsiębiorcą. Z perspektywy użytkownika aplikacja oferuje w miarę standardowy zestaw funkcjonalności: przegląd zamówień, wystawionych faktur i innych dokumentów sprzedażowych a także wypożyczonych stojaków. Wiadomo, takie okno to delikatna rzecz, często robiona na zamówienie, więc dostarcza się je na specjalnych stojakach, które wypożyczane są kontrahentowi i które ten musi zwrócić. 

O ile dla użytkownika to powszechne rzeczy, odpowiadały one na istotną potrzebę biznesową klienta. Otóż dla samego klienta bardzo istotne było stworzenie kanału, którym mógłby przypominać klientom o konieczności zwrotu wypożyczonego sprzętu a czasem także opłacenia faktur czy podpisania dokumentów. Oprócz tego po stronie backendowej aplikacja stanowi zwornik między kilkoma systemami klienta, na których do tej pory musiał oddzielnie operować, by pozyskać te dane.

Od strony technicznej wyzwaniem było już podpięcie bazy danych. Musieliśmy zintegrować istniejącą bazę klienta (zawierającą wiele niepotrzebnych nam danych), w którą nie mogliśmy ingerować z naszą, obsługującą dodatkowe funkcjonalności. W rezultacie stworzyliśmy Fasadę na bazę klienta, z której dane były Dekorowane naszymi danymi.

Później było już z górki - w miarę standardowa instalacja Symfony 6 na PHP 8. Wiadomo, było trochę logiki biznesowej - szczególnie jeśli chodzi o powiadomienia - ale ogólnie no problemo. 