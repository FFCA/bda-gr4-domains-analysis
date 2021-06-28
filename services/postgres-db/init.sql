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

-- Creation of notification function:

CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM
pg_notify('watch_domain', TG_TABLE_NAME);
RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Creation of triggers:

CREATE TRIGGER insert_trigger
    AFTER INSERT
    ON domain
    FOR EACH ROW EXECUTE PROCEDURE notify_trigger();

CREATE TRIGGER update_trigger
    AFTER UPDATE
    ON domain
    FOR EACH ROW EXECUTE PROCEDURE notify_trigger();

CREATE TRIGGER delete_trigger
    AFTER DELETE
    ON domain
    FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
