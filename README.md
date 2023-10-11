# price-tracker

## Overview
App that lets users track crypto prices. Users can favorite instruments from the full list.

## Usage
- Will need the server .env files in order to run.
The client env files were uploaded with the api routes for prod and dev environments.

- In the root directory, run `docker-compose up --build`

- To use the application, open `http://localhost:3050/`.

## Devs
While developing we simply run the docker container locally to access the database. Then in both the client and server run `yarn dev`.

## Stack
Frontend: Vite React
Backend: Express NodeJS
Database: MySQL + Prisma ORM

## Todo
- Price updates.

- Move database to separate server.

- Add phone notifications for when an instrument price hits x.

- Usage of JWTs.