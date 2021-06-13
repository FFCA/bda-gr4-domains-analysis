CREATE TABLE domain (
    id SERIAL PRIMARY KEY,
    top_level_domain VARCHAR(255) UNIQUE NOT NULL,
    mx_record TEXT[] NULL,
    a_record TEXT[] NULL
);
