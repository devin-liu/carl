<!-- Create a db -->
psql postgres
CREATE DATABASE gdax;

<!-- Create a table -->
create table orderbook (
    id serial,
    created_at TIMESTAMP DEFAULT NOW(),
    data jsonb not null,
    pair_string text
);

<!--
create table historicalprices (
    id serial,
    created_at TIMESTAMP DEFAULT NOW(),
    data jsonb not null
);
 -->


SELECT pg_size_pretty( pg_total_relation_size('orderbook') );
