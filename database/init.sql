CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS cows (
    id SERIAL PRIMARY KEY,
    tag_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    birth_date DATE,
    breed VARCHAR(50),
    purchase_date DATE,
    purchase_price NUMERIC(10,2),
    current_status VARCHAR(20) DEFAULT 'Heifer',
    dam_id INT,
    sire_id INT,
    photo_url TEXT,
    current_weight NUMERIC(6,2),
    body_condition_score NUMERIC(2,1),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS milking_records (
    id SERIAL PRIMARY KEY,
    cow_id INT REFERENCES cows(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    record_time TIME NOT NULL,
    session VARCHAR(10) DEFAULT 'AM',
    yield_liters NUMERIC(7,2) NOT NULL,
    fat_percentage NUMERIC(5,2),
    protein_percentage NUMERIC(5,2),
    scc INT,
    milker_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
