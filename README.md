# price-tracker

## Usage
In the root directory, run `docker-compose up --build`

Access Adminer (db management) with `http://localhost:8000/`
Login: `server=mysql_db`, `username=root`, `password=MYSQL_ROOT_PASSWORD`, `database=price_tracker`

To use the application, open `http://localhost:3050/`.

## Overview
App that lets users track crypto prices. Favorite instruments from the full list.

## Stack
Frontend: Vite React
Backend: Express NodeJS
Database: MySQL + Prisma ORM

## Todo
Add phone notifications for when an instrument price hits x.