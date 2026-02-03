# Backend Challenge

You have to build a notification management system for authenticated users. The system must allow each user to manage and send notifications through different channels.

1. User Authentication
- User registration with email and password
- Login that returns an access token
- Endpoints must require a valid token to be accessed

2. Notification Management
- Create a notification (fields: title, content, channel)
- Modify an existing notification
- Delete a notification
- View all your notifications

3. Notification Sending
- Each time a notification is created, it must be sent via the specified channel
- The available channels are:
- Email
- SMS
- Push Notification
- Each channel requires distinct sending logic, simulating specific steps for each channel
- The logic must be designed so that adding a new channel does not require modifying the existing logic

Every request must only accept this `Content-type: application/json`.

### Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/mcecisosa/th-challenge-notifications/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/mcecisosa/th-challenge-notifications/tree/master)

### Features

- Login
- Create new Users
- Get Users list
- Get User by Id
- Update User
- Delete User

- Create new notifications
- Get Users notifications
- Update Notification
- Delete Notification


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
- Strategy Pattern: to make the system scalable and that by adding a new channel does not require modifying the existing logic
- TypeOrm: have integration include with Nest and is popular ORM so it is easy to find fixes and people that know how to use it
- Docker: to make portable
- Jest/Testing/E2E: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed.


## Route

- Local: [API Swagger](http://localhost:3000/api)

## Env vars should be defined

To find an example of the values you can use .env.example

