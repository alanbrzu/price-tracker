// import mysql from 'mysql2'
// import dotenv from 'dotenv'

// dotenv.config()

// const [user, password, database] = ['MYSQL_USER', 'MYSQL_PASSWORD', 'price_tracker']

// const configOptions: { dev: mysql.PoolOptions, prod: mysql.PoolOptions } = {
//     dev: {
//         host: 'localhost',
//         port: 9906,
//         user,
//         password,
//         database,
//     },
//     prod: {
//         host: 'mysql_db',
//         user,
//         password,
//         database,
//     }
// }

// const dbConfig = process.env.NODE_ENV === 'development' ? configOptions.dev : configOptions.prod

// export const db = mysql.createPool(dbConfig)