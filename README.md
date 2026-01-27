# Backend Challenge

You have to build a microservice that exposes a REST api with one table, users. User table should be open to creation, deletion, or update. 
Every request must only accept this `Content-type: application/json`.

### Badges


### Features

- Create new Users with their Pokemon Ids
- Get Users list
- Get User by Id and also gathering Pokemon Names from Poke API
- Update User
- Delete User

## Pre-Requisites

- Docker installed without SUDO Permission
- Docker Compose installed without SUDO
- Ports free: 3000 and 5433

### How to run the APP

```
chmod 711 ./up_dev.sh
./up_dev.sh
```

### How to run the tests

```
chmod 711 ./up_test.sh
./up_test.sh
```

## Areas to improve

- Data should be moved from tests to an external file
- Generic method should be used to mock endpoints
- A Seed migration would be useful to have an already working app with data
- The ORM is being used with Synchronize instead of migrations. Migrations would be the best option.
- Deployment could be done

## Techs

- Node: node:20.9.0
- Nest: 11
- Typeorm
- PostgreSQL

## Decisions Made

- Clean Architecture: To be able to handle further changes in the future in a proper way.
- TypeOrm: have integration include with Nest and is popular ORM so it is easy to find fixes and people that know how to use it
- Docker: to make portable
- Jest/Testing/E2E: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed.

## Route

- Local: [API Swagger](http://localhost:3000/api)

## Env vars should be defined

To find an example of the values you can use .env.example

