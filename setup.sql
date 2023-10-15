-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) DEFAULT NULL, -- for price alerts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the instruments table
CREATE TABLE IF NOT EXISTS instruments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    logo VARCHAR(255) NOT NULL,
    current_price DECIMAL(20, 8) DEFAULT 0.0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    instrument_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (instrument_id) REFERENCES instruments(id),
    UNIQUE (user_id, instrument_id) -- ensure a user can't favorite the same instrument multiple times
);

-- Create the price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    instrument_id INT NOT NULL,
    target_price DECIMAL(20, 8) NOT NULL,
    alert_type ENUM('ABOVE', 'BELOW') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (instrument_id) REFERENCES instruments(id),
    UNIQUE (user_id, instrument_id, target_price) -- ensure a user can't create duplicate alerts
);

-- Database seeding
-- Dumping data for table price_tracker.instruments: ~2 rows (approximately)
INSERT IGNORE INTO `instruments` (`id`, `symbol`, `logo`, `current_price`, `last_updated`) VALUES
	(1, 'BTCUSDT', 'https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/btc.svg', 0.00000000, '2023-10-10 17:49:00'),
	(2, 'ETHUSDT', 'https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/eth.svg', 0.00000000, '2023-10-10 17:49:20'),
    (3, 'SOLUSDT', 'https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/sol.svg', 0.00000000, '2023-10-10 17:51:20'),
    (4, 'DOGEUSDT', 'https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/doge.svg', 0.00000000, '2023-10-10 17:51:20');
