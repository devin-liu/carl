<!-- Create a db -->
psql postgres
CREATE DATABASE gdax;

<!-- Create a table -->
create table orderbook (
    id serial,
    created_at TIMESTAMP DEFAULT NOW(),
    data jsonb not null
);
