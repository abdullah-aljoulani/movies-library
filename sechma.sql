CREATE TABLE IF NOT EXISTS firstMOV(
id SERIAL PRIMARY KEY,
title VARCHAR (255),
release_date VARCHAR (255),
poster_path VARCHAR(255),
overview VARCHAR(10000)
);


CREATE TABLE IF NOT EXISTS movies(
    id SERIAL PRIMARY KEY,
    movies_id integer,
    title VARCHAR (255),
    overview VARCHAR(10000),
    poster_path VARCHAR(255),
    vote_average decimal(5 , 4),
    vote_count integer,
    comment VARCHAR (255)
);