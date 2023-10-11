# price-tracker

## Usage
Will need the .env files in order to run.
The client env files were uploaded with the api routes for prod and dev environments.

In the root directory, run `docker-compose up --build`

To use the application, open `http://localhost:3050/`.

## Devs
While developing we simply run the docker container locally to access the database. Then in both the client and server run `yarn dev`.

## Overview
App that lets users track crypto prices. Favorite instruments from the full list.

## Stack
Frontend: Vite React
Backend: Express NodeJS
Database: MySQL + Prisma ORM

## Todo
- Move database to separate server

- Add phone notifications for when an instrument price hits x.