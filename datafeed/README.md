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

<!-- Get size of database -->
SELECT pg_size_pretty( pg_total_relation_size('orderbook') );


<!-- Get last item in orderbook -->
SELECT * FROM orderbook WHERE id=(SELECT max(id) FROM orderbook);


<!-- SELECT count(*) FROM orderbook WHERE pair_string IS NULL; -->


select * from orderbook where jsonb_array_elements(data->'asks'[0][0])::int > 6000;

select jsonb_array_elements(data->'asks')->0->0 from orderbook;


select jsonb_array_elements(data->'asks' -> 0  -> '0') as asks from orderbook where id=(SELECT max(id) FROM orderbook);



select jsonb_array_elements(data->'asks'->0) as asks from orderbook WHERE id=(SELECT max(id) FROM orderbook);


select jsonb_array_elements(data->'asks'->0) as asks from orderbook WHERE id=(SELECT max(id) FROM orderbook);


select (jsonb_array_elements(data->'asks'->0)) as asks from orderbook WHERE id=(SELECT max(id) FROM orderbook);

select (jsonb_array_elements(data->'asks'->0)) as asks from orderbook  WHERE id=(SELECT max(id) FROM orderbook);


WHERE pair_string IS NULL;


select * from (select t.* from "myData", jsonb_array_elements("values") with ordinality as t(data, idx)) as x;
