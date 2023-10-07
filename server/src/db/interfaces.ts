// table users
type User = {
    user_id: number
    email: string
    password: string
    created_at: string
}

// table instruments
type Instrument = {
    instrument_id: number
    symbol: string
    type: 'spot' | 'perp'
    price: number
}

// table user_favorites
type UserFavorite = {
    user_favorite_id: number
    user_id: number
    instrument_id: number
    added_at: string
}

/** users table */
// user_id: AUTO_INCREMENT, PRIMARY KEY
// email: VARCHAR(255)
// password: VARCHAR(255) (hashed, consider using bcrypt)
// created_at: TIMESTAMP
/** add a new user */
// INSERT INTO users (username, password, email, created_at) VALUES ('john_doe', 'hashed_password', 'john@example.com', NOW());

/** instruments */
// crypto_id: AUTO_INCREMENT, PRIMARY KEY
// name: VARCHAR(255)
// symbol: VARCHAR(10)
// current_price: DECIMAL(20, 8)
// last_updated: TIMESTAMP
/** update current price */
// UPDATE crypto_instruments SET current_price = 42000.50, last_updated = NOW() WHERE crypto_id = 5;


/** userFavorites */
// user_favorite_id: AUTO_INCREMENT, PRIMARY KEY
// user_id: FOREIGN KEY to users
// crypto_id: FOREIGN KEY to crypto_instruments
// added_at: TIMESTAMP
/** Add an instrument to user's favorites */
//INSERT INTO user_favorites (user_id, crypto_id, added_at) VALUES (1, 5, NOW());
/** retrieve a user's favorite instruments */
// SELECT c.* 
// FROM crypto_instruments c 
// JOIN user_favorites uf ON c.crypto_id = uf.crypto_id 
// WHERE uf.user_id = 1;