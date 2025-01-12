CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    userid VARCHAR(255) NOT NULL,
    password VARCHAR(512) NOT NULL
--     hh VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE knowledge (
    userid varchar(255) NOT NULL,
    k1 VARCHAR(255),
    k2 VARCHAR(255),
    k3 VARCHAR(255),
    k4 VARCHAR(255),
    k5 VARCHAR(255),
    k6 VARCHAR(255)
)

-- CREATE TABLE user_story (
--     username VARCHAR(255),
--     storyId VARCHAR(255),
--     saved VARCHAR(20)
-- );
--
-- CREATE TABLE paragraphs (
--     storyId VARCHAR(255),
--     prompt TEXT,
--     `text` TEXT,
--     url TEXT,
--     weight VARCHAR(255)
-- );
--
-- CREATE TABLE total_story (
--     storyId VARCHAR(255),
--     outline TEXT,
--     originalStory TEXT
-- );
--
