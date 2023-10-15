# price-tracker

## Overview
App that lets users track crypto prices. Users can add price alerts and will be sent an SMS when the target is hit. Users can also favorite instruments from the full list.

## Usage
- Will need the server .env files in order to run.
The client env files were uploaded with the api routes for prod and dev environments.

- In the root directory, run `docker-compose up --build`

- To use the application, open `http://localhost:3050/`.

## Devs
For development just need the MySQL db. Run `docker-compose -f docker-compose.dev.yml up --build`.
Then in both the client and server run `yarn dev`.

## Stack
Frontend: Vite React
Backend: Express NodeJS
Database: MySQL + Prisma ORM

## Todo
- Whenever there is an application update (schema changes), if frontend user is logged in via localStorage, could cause errors.

- Usage of JWTs.

- SSL certs

- Move database to separate server.

- For real production would need email verification, password updates, etc.