---
template: page-default
title: Parking systems
langs: 
  pl: prog-systemy-parkingowe
headerImage: mid-parking-head.jpg
category: prog-experience
sort: 1
tags:
  - about-me
excerpt: Systems integrating sensors, cameras, displays and backoffice applications
slots:
  aside:
    - type: static
      content: |
        ## Technologies
        - PHP + Symfony + EasyAdmin
        - Node.js + websockets
        - PostgreSQL + PostGIS
        
lead: |
  While working for a company dealing with parking lots and parking fees, I made a whole series of systems integrating, through a variety of APIs, various sensors and passing the processed data from them to output devices and backoffice systems.
---
## Free parking ticket
No, “free ticket” is not an oxymoron. It handles situations where, for example, a shop allows you to park for free in the parking lot it owns for a certain period. After that, you have to pay. The shop wants to ensure that it is possible for its customers to park for a reasonable amount of time, enough to do their shopping or go to the cinema. At the same time, the shop wants to prevent, for example, local residents parking around the clock, which would limit the number of spaces available to customers.

I implemented two sides of the system: the backoffice and the handling of the parking machine API. The idea behind working with the API was simple: the customer enters the registration number, the system checks if he or she has already parked today and, if not, issues a ticket until a certain time. The backoffice, in turn, allows to view the status of the system and, if necessary, intervene when customers report problems or complaints.

The whole thing was done in PHP 7 and Symfony 3 with EasyAdmin. Database: PostgreSQL.

## Parking occupancy information system
A parking system that collects data from asphalt parking sensors (and in a later version from cameras), aggregates the parking occupancy data and feeds it to the displays and backoffice.

In addition to integrating with the sensor API (actually 3 APIs for different purposes) and the camera API, it was necessary to implement the assignment of groups of sensors (and possibly cameras) to the GPS position and the corresponding parking section. The latter was done using the Postgres extension PostGIS. The system itself was my first exposure to Node.js v6, which use I suggested because of the system's continuous work. It was written in pure JavaScript ES6.

The backoffice system is used to configure equipment and monitor the current occupancy of the parking lot. It was made on PHP 7 and Symfony 3 with EasyAdmin with a custom map control displaying the location of the sensor or the area of the parking section.

## ALPR cameras + parking fee system
A system that receives data from a mobile (car-mounted) camera that scans the registration numbers of parked cars and validates if parking is paid for.

The need for such a system was related to the fact that in case of large Paid Parking Zones, the parking inspector has no chance to cover the entire area in a reasonable time and with the required frequency. Hence the idea of mounting a special camera [ALPR](https://en.wikipedia.org/wiki/Automatic_number-plate_recognition) (Automatic License Plate Recognition) on the car and driving it along the line of parked cars. The camera reads the numbers of passing cars and transmits them to the system, which checks whether a fee has been paid or whether the car has a valid permit. Further development goals were to pass on the offenders' data directly to the fining system, but in my time this did not yet have a suitable API.

In fact, the integration with the camera API and the charging system API was a smaller part of the work. The bigger part was to implement the backoffice, in which the configuration of the connection to the camera and the areas to be checked and the real-time visualisation of the inspection progress was performed. The whole project was done in PHP+Symfony and the configuration of the areas and visualisation of the inspections again required PostGIS, again the map control for EasyAdmin was used.

As an aside, I remember we had a bit of trouble calibrating the GPS. We sent two volunteers along an established route around the estate and tracked how that route would be visualised. It turned out pretty well... apart from the neighbourhood of a 15-storey high-rise and a church. As yet I don't know which of these was responsible for the deviation of a good 10 metres from the real path. We solved the problem by using the snap-to-road option in [OSRM](https://project-osrm.org/).

## Integration of entry/exit equipment and parking payment system
A car park operation system with number plate scanning under the barriers and integration with the charging system.

The system worked in such a way that when a vehicle arrives at the entry barrier, the ALPR camera scans its number plate, stores it in the system with the entry time and opens the barrier. Before the driver leaves, he or she must pay for parking. When the vehicle appears at the exit barrier, its plate is scanned again and a check is made to see if payment has been made - if so, the barrier is raised.

The implementation of the camera API, barriers and toll system was realised in Node.js. Plus, as usual, a backoffice in PHP+Symfony with EasyAdmin.
