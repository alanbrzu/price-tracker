import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

let dbConfig: mysql.PoolOptions

const [user, password, database] = ['MYSQL_USER', 'MYSQL_PASSWORD', 'price_tracker']

if (process.env.NODE_ENV === 'development') {
    console.log('NODE_ENV development')
    dbConfig = {
        host: 'localhost',
        port: 9906,
        user,
        password,
        database
    }
} else {
    console.log('NODE_ENV production')
    dbConfig = {
        host: 'mysql_db',
        user,
        password,
        database
    }
}

export const db = mysql.createPool(dbConfig)