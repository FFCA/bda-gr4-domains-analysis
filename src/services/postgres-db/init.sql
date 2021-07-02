-- Creation of tables:

CREATE TABLE domain
(
    top_level_domain VARCHAR(255) PRIMARY KEY,
    mx_record        VARCHAR(255)[] NULL,
    a_record         VARCHAR(255)[] NULL
);

CREATE TABLE domain_enhanced_based_on_existing_data
(
    top_level_domain  VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
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

CREATE TABLE exception_message
(
    id        INTEGER PRIMARY KEY,
    exception VARCHAR(255) NOT NULL
);

CREATE TABLE domain_records_checked -- TODO: new table to be used / adjusted
(
    top_level_domain        VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    a_record_checked        VARCHAR(255)[] NULL,
    a_record_checked_error  INTEGER        NOT NULL REFERENCES exception_message (id),
    mx_record_checked       VARCHAR(255)[] NULL,
    mx_record_checked_error INTEGER        NOT NULL REFERENCES exception_message (id)
);

CREATE TABLE domain_redirection
(
    top_level_domain VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    redirection      VARCHAR(255) NULL,
    status_code      VARCHAR(255) NULL
);

CREATE TABLE soa
(
    top_level_domain VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    mname            VARCHAR(255)   NULL,
    refresh          INTEGER        NULL,
    minimum          INTEGER        NULL,
    nameservers      VARCHAR(255)[] NULL,
    nameserver_error INTEGER        NOT NULL REFERENCES exception_message (id)
);

-- Insertion of pre-defined values (caught errors):

INSERT INTO exception_message (id, exception)
VALUES (0, 'No Error'),
       (1, 'NXDomain'),
       (2, 'No Answer'),
       (3, 'No Nameservers'),
       (4, 'Timeout'),
       (5, 'Connection Error'),
       (6, 'Read Timeout'),
       (7, 'Too Many Redirects');
-- TODO Generic error

-- Creation of functions to be used in order to minimize the queries to be written:

CREATE FUNCTION domain_count()
    RETURNS INTEGER
AS
$$
BEGIN
    RETURN (SELECT COUNT(*) FROM domain);
END;
$$
    LANGUAGE plpgsql;

CREATE FUNCTION top_10_mx_global()
    RETURNS SETOF mx_record_count_global
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM mx_record_count_global ORDER BY count DESC LIMIT 10;
END;
$$
    LANGUAGE plpgsql;

CREATE FUNCTION top_10_a_global()
    RETURNS SETOF a_record_count_global
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM a_record_count_global ORDER BY count DESC LIMIT 10;
END;
$$
    LANGUAGE plpgsql;

-- Creation of notification function:

CREATE FUNCTION notify_domain_count() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY
        watch_domain_count;
    RETURN NULL;
END;
$$
    LANGUAGE plpgsql;

CREATE FUNCTION notify_a_count_global() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY
        watch_a_count_global;
    RETURN NULL;
END;
$$
    LANGUAGE plpgsql;

CREATE FUNCTION notify_mx_count_global() RETURNS trigger AS
$$ -- TODO: Exclude localhost ?
DECLARE
BEGIN
    NOTIFY
        watch_mx_count_global;
    RETURN NULL;
END;
$$
    LANGUAGE plpgsql;

-- Creation of triggers:

CREATE TRIGGER domain_count_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON domain
    FOR EACH ROW
EXECUTE PROCEDURE notify_domain_count();

CREATE TRIGGER a_global_count_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON a_record_count_global
    FOR EACH ROW
EXECUTE PROCEDURE notify_a_count_global();

CREATE TRIGGER mx_global_count_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON mx_record_count_global
    FOR EACH ROW
EXECUTE PROCEDURE notify_mx_count_global();
