---
template: page-default
title: Application for window manufacturer
langs:
  pl: prog-okna
headerImage: mid-windows-head.jpg
excerpt: Application with overview of orders, documents and rack rentals
category: prog-experience
sort: 6
tags:
  - about-me
slots:
  aside:
    - type: static
      content: |
        ## Technologies
        - PHP 8 + Symfony
        - MSSQL
---
This project is an oft-seen thing: a corporate app that streamlines the customer's interaction with the company. From the customer's perspective, the app offers a fairly standard set of functionalities: an overview of orders, issued invoices and other sales documents, and rented racks. It is obvious that a window is a delicate thing, often made to order, so it is delivered on special racks, which are lent to the contractor and which the contractor is obliged to return.

While these are typical things for the customer, they addressed an important business need for the commissioner. Indeed, for him it was very important to create a channel to remind customers about returning rented equipment and sometimes about paying invoices or signing documents. Additionally, on the backend side, the application acts as an integrator between several of the client's systems, on which he has previously had to operate separately to obtain this data.

On the technical side, the challenge was already to hook up the database. We had to integrate an existing customer database (containing a lot of data we didn't need), which we couldn't alter, with our own, which provided additional functionality. As a result, we created a Facade for the customer database, and fetched data was decorated with our data.

Afterwards, it was a breeze - a fairly standard Symfony 6 installation on PHP 8. Sure, there was some business logic - especially when it came to notifications - but overall no problemo.