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


SELECT count(*) FROM orderbook WHERE pair_string IS NULL;


select * from orderbook where jsonb_array_elements(data->'asks'[0][0])::int > 6000;


select * from orderbook  WHERE (select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT LIKE '6___' LIMIT 1;


(select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)


WHERE pair_string IS NULL;






select count(*) from orderbook WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d\d"|"6\d\d\d.\d\d"|"7\d\d\d"|"7\d\d\d.\d\d"|"8\d\d\d"|"8\d\d\d.\d\d"|"9\d\d\d"|"9\d\d\d.\d\d"|"10\d\d\d"|"10\d\d\d.\d\d"' OR (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d\d"|"6\d\d\d.\d\d"|"7\d\d\d"|"7\d\d\d.\d\d"|"8\d\d\d"|"8\d\d\d.\d\d"|"9\d\d\d"|"9\d\d\d.\d\d"|"10\d\d\d"|"10\d\d\d.\d\d"') AND pair_string IS NULL;
| 58389
BTC-USD
UPDATE orderbook SET pair_string = 'BTC-USD' WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d\d"|"6\d\d\d.\d\d"|"7\d\d\d"|"7\d\d\d.\d\d"|"8\d\d\d"|"8\d\d\d.\d\d"|"9\d\d\d"|"9\d\d\d.\d\d"|"10\d\d\d"|"10\d\d\d.\d\d"' OR (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d\d"|"6\d\d\d.\d\d"|"7\d\d\d"|"7\d\d\d.\d\d"|"8\d\d\d"|"8\d\d\d.\d\d"|"9\d\d\d"|"9\d\d\d.\d\d"|"10\d\d\d"|"10\d\d\d.\d\d"') AND pair_string IS NULL;



select count(*) from orderbook WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d"|"6\d\d.\d\d"|"7\d\d"|"7\d\d.\d\d"|"8\d\d"|"8\d\d.\d\d"|"9\d\d"|"9\d\d.\d\d"|"10\d\d"|"10\d\d.\d\d"' OR (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d"|"6\d\d.\d\d"|"7\d\d"|"7\d\d.\d\d"|"8\d\d"|"8\d\d.\d\d"|"9\d\d"|"9\d\d.\d\d"|"10\d\d"|"10\d\d.\d\d"') AND pair_string IS NULL;
| 58112
BCH-USD
UPDATE orderbook SET pair_string = 'BCH-USD' WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d"|"6\d\d.\d\d"|"7\d\d"|"7\d\d.\d\d"|"8\d\d"|"8\d\d.\d\d"|"9\d\d"|"9\d\d.\d\d"|"10\d\d"|"10\d\d.\d\d"' OR (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"6\d\d"|"6\d\d.\d\d"|"7\d\d"|"7\d\d.\d\d"|"8\d\d"|"8\d\d.\d\d"|"9\d\d"|"9\d\d.\d\d"|"10\d\d"|"10\d\d.\d\d"') AND pair_string IS NULL;


select count(*) from orderbook WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"5\d\d"|"5\d\d.\d\d"|"4\d\d"|"4\d\d.\d\d"|"3\d\d"|"3\d\d.\d\d"' or (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"5\d\d"|"5\d\d.\d\d"|"4\d\d"|"4\d\d.\d\d"|"3\d\d"|"3\d\d.\d\d"') AND pair_string IS NULL;
| 58328
ETH-USD
UPDATE orderbook SET pair_string = 'ETH-USD' WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"5\d\d"|"5\d\d.\d\d"|"4\d\d"|"4\d\d.\d\d"|"3\d\d"|"3\d\d.\d\d"' or (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"5\d\d"|"5\d\d.\d\d"|"4\d\d"|"4\d\d.\d\d"|"3\d\d"|"3\d\d.\d\d"') AND pair_string IS NULL;


select count(*) from orderbook WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"1\d\d"|"1\d\d.\d\d"' OR (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"1\d\d"|"1\d\d.\d\d"') AND pair_string IS NULL;
| 58323
LTC-USD
UPDATE orderbook SET pair_string = 'LTC-USD' WHERE ((select * from jsonb_array_elements(data->'asks'->0) LIMIT 1)::TEXT SIMILAR TO '"1\d\d"|"1\d\d.\d\d"' OR (select * from jsonb_array_elements(data->'bids'->0) LIMIT 1)::TEXT SIMILAR TO '"1\d\d"|"1\d\d.\d\d"') AND pair_string IS NULL;
