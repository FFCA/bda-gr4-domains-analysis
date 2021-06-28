-- Creation of tables:

CREATE TABLE domain
(
    top_level_domain VARCHAR(255) PRIMARY KEY,
    mx_record        VARCHAR(255)[] NULL,
    a_record         VARCHAR(255)[] NULL
);

CREATE TABLE domain_enhanced_based_on_existing_data
(
    top_level_domain  VARCHAR(255) REFERENCES domain (top_level_domain) PRIMARY KEY,
    a_record_count    INTEGER NOT NULL,
    mx_record_count   INTEGER NOT NULL,
    mx_uses_localhost BOOLEAN NOT NULL
);

CREATE TABLE a_record_count_global
(
    a_record VARCHAR(255) PRIMARY KEY,
    count    INTEGER NOT NULL
);

CREATE TABLE mx_record_count_global
(
    mx_record VARCHAR(255) PRIMARY KEY,
    count     INTEGER NOT NULL
);

CREATE TABLE domain_enhanced -- TODO: new table to be used / adjusted
(
    top_level_domain  VARCHAR(255) REFERENCES domain (top_level_domain) PRIMARY KEY,
    a_record_checked  VARCHAR(255)[] NULL,
    mx_record_checked VARCHAR(255)[] NULL,
    redirection       VARCHAR(255) NULL,
    status_code       VARCHAR(255) NULL
);

-- TODO describe

CREATE FUNCTION top_10_mx_global()
    RETURNS SETOF mx_record_count_global
AS $$
BEGIN
RETURN QUERY SELECT * FROM mx_record_count_global ORDER BY count DESC LIMIT 10;
END;
$$
LANGUAGE plpgsql;

CREATE FUNCTION top_10_a_global()
    RETURNS SETOF a_record_count_global
AS $$
BEGIN
RETURN QUERY SELECT * FROM a_record_count_global ORDER BY count DESC LIMIT 10;
END;
$$
LANGUAGE plpgsql;

-- Creation of notification function:

-- CREATE FUNCTION notify_domain() RETURNS trigger AS $$
-- DECLARE
-- BEGIN
-- PERFORM
-- pg_notify('watch_domain', TG_TABLE_NAME);
-- RETURN NULL;
-- END;
-- $$
-- LANGUAGE plpgsql;

CREATE FUNCTION notify_a_count_global() RETURNS trigger AS $$
DECLARE
BEGIN
NOTIFY
watch_a_count_global;
RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE FUNCTION notify_mx_count_global() RETURNS trigger AS $$
DECLARE
BEGIN
NOTIFY
watch_mx_count_global;
RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Creation of triggers:

-- CREATE TRIGGER insert_domain_trigger
--     AFTER INSERT
--     ON domain
--     FOR EACH ROW EXECUTE PROCEDURE notify_domain();

CREATE TRIGGER insert_a_global_count_trigger
    AFTER INSERT
    ON a_record_count_global
    FOR EACH ROW EXECUTE PROCEDURE notify_a_count_global();

CREATE TRIGGER insert_mx_global_count_trigger
    AFTER INSERT
    ON mx_record_count_global
    FOR EACH ROW EXECUTE PROCEDURE notify_mx_count_global();



-- TODO Add update / delete for each (?)

-- CREATE TRIGGER update_trigger
--     AFTER UPDATE
--     ON domain
--     FOR EACH ROW EXECUTE PROCEDURE notify_domain();
--
-- CREATE TRIGGER delete_trigger
--     AFTER DELETE
--     ON domain
--     FOR EACH ROW EXECUTE PROCEDURE notify_domain();
