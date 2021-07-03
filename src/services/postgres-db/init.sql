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

CREATE TABLE domain_records_checked
(
    top_level_domain        VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    a_record_checked        VARCHAR(255)[] NULL,
    a_record_checked_error  INTEGER        NOT NULL REFERENCES exception_message (id),
    mx_record_checked       VARCHAR(255)[] NULL,
    mx_record_checked_error INTEGER        NOT NULL REFERENCES exception_message (id)
);

CREATE TABLE ip_v6_information
(
    top_level_domain VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    ipv6_available   BOOLEAN NOT NULL,
    ipv6_error       INTEGER NOT NULL REFERENCES exception_message (id)
);

CREATE TABLE domain_redirection
(
    top_level_domain VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    redirection      VARCHAR(255) NULL,
    status_code      INTEGER      NULL
);

CREATE TABLE a_record_checked_count_global
(
    a_record_checked VARCHAR(255) PRIMARY KEY,
    count            INTEGER NOT NULL
);

CREATE TABLE mx_record_checked_count_global
(
    mx_record_checked VARCHAR(255) PRIMARY KEY,
    count             INTEGER NOT NULL
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

CREATE TABLE domain_mx_record_geolite2
(
    -- TODO Don't store unused
    top_level_domain               VARCHAR(255) NOT NULL,
    mx_record_checked              VARCHAR(255) NOT NULL,
    mx_record_ip                   VARCHAR(255) NULL,
    iso_code                       VARCHAR(3)   NULL,
    country                        VARCHAR(255) NULL,
    city                           VARCHAR(255) NULL,
    postal                         VARCHAR(255) NULL,
    latitude                       VARCHAR(255) NULL,
    longitude                      VARCHAR(255) NULL,
    autonomous_system_number       VARCHAR(255) NULL,
    autonomous_system_organization VARCHAR(255) NULL
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

-- for KPIs:

CREATE FUNCTION domain_count()
    RETURNS TABLE
            (
                domain_count INTEGER
            )
AS
$$
SELECT COUNT(*)
FROM domain
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_mx_localhost()
    RETURNS TABLE
            (
                percentage FLOAT
            )
AS
$$
SELECT ROUND((SUM(CASE WHEN mx_uses_localhost THEN 1 ELSE 0 END)::numeric / COUNT(top_level_domain)), 4) AS percentage
FROM domain_enhanced_based_on_existing_data;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_redirections()
    RETURNS TABLE
            (
                percentage FLOAT
            )
AS
$$
SELECT ROUND((SUM(CASE WHEN redirection != top_level_domain THEN 1 ELSE 0 END)::numeric / COUNT(redirection)),
             4) AS percentage
FROM domain_redirection;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_redirections_code_200()
    RETURNS TABLE
            (
                percentage FLOAT
            )
AS
$$
SELECT ROUND((SUM(CASE WHEN redirection != top_level_domain AND status_code = 200 THEN 1 ELSE 0 END)::numeric /
              COUNT(redirection)), 4) AS percentage
FROM domain_redirection;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_mx_providers_outside_of_germany()
    RETURNS TABLE
            (
                percentage FLOAT
            )
AS
$$
SELECT ROUND((SUM(CASE WHEN iso_code != 'DE' THEN 1 ELSE 0 END)::numeric /
              COUNT(iso_code)), 4) AS percentage
FROM domain_mx_record_geolite2;
$$ LANGUAGE sql;

-- for Charts:

CREATE FUNCTION top_10_mx_global()
    RETURNS SETOF mx_record_count_global
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM mx_record_count_global ORDER BY count DESC LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION top_10_a_global()
    RETURNS SETOF a_record_count_global
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM a_record_count_global ORDER BY count DESC LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION top_10_mx_checked_global()
    RETURNS SETOF mx_record_checked_count_global
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM mx_record_checked_count_global ORDER BY count DESC LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION top_10_a_checked_global()
    RETURNS SETOF a_record_checked_count_global
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM a_record_checked_count_global ORDER BY count DESC LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION mx_count_grouped()
    RETURNS TABLE
            (
                count           INTEGER,
                mx_record_count INTEGER
            )
AS
$$
SELECT COUNT(mx_record_count), mx_record_count
FROM domain_enhanced_based_on_existing_data
GROUP BY mx_record_count
$$ LANGUAGE sql;

CREATE FUNCTION a_count_grouped()
    RETURNS TABLE
            (
                count          INTEGER,
                a_record_count INTEGER
            )
AS
$$
SELECT COUNT(a_record_count), a_record_count
FROM domain_enhanced_based_on_existing_data
GROUP BY a_record_count
$$ LANGUAGE sql;

CREATE FUNCTION domain_access_status_codes()
    RETURNS TABLE
            (
                not_redirected_count INTEGER,
                redirected_count     INTEGER,
                status_code          INTEGER
            )
AS
$$
SELECT COUNT(CASE WHEN redirection IS NULL OR redirection = top_level_domain THEN 1 END) AS not_redirected_count,
       COUNT(CASE WHEN redirection != top_level_domain THEN 1 END)                       AS redirected_count,
       status_code
FROM domain_redirection
GROUP BY status_code;
$$ LANGUAGE sql;

CREATE FUNCTION top_10_redirected_to()
    RETURNS TABLE
            (
                count       INTEGER,
                redirection VARCHAR(255)
            )
AS
$$
SELECT COUNT(redirection) as count, redirection
FROM domain_redirection
WHERE redirection != top_level_domain
GROUP BY redirection
ORDER BY count DESC
LIMIT 10
$$ LANGUAGE sql;

CREATE FUNCTION top_10_mx_asn()
    RETURNS TABLE
            (
                count                          INTEGER,
                autonomous_system_organization VARCHAR(255),
                iso_code                       VARCHAR(3)
            )
AS
$$
SELECT COUNT(autonomous_system_organization) AS count, autonomous_system_organization, iso_code
FROM domain_mx_record_geolite2
GROUP BY autonomous_system_organization, iso_code
ORDER BY count DESC
LIMIT 10;
$$ LANGUAGE sql;

CREATE FUNCTION top_10_mx_cities()
    RETURNS TABLE
            (
                count    INTEGER,
                city     VARCHAR(255),
                iso_code VARCHAR(3)
            )
AS
$$
SELECT COUNT(city) count, city, iso_code
FROM domain_mx_record_geolite2
GROUP BY city, iso_code
ORDER BY count DESC
LIMIT 10;
$$ LANGUAGE sql;

CREATE FUNCTION top_10_mx_countries()
    RETURNS TABLE
            (
                count    INTEGER,
                iso_code VARCHAR(3)
            )
AS
$$
SELECT COUNT(iso_code) count, iso_code
FROM domain_mx_record_geolite2
GROUP BY iso_code
ORDER BY count DESC
LIMIT 10;
$$ LANGUAGE sql;

-- TODO: Add data to be displayed on map?

-- Creation of notification functions:

CREATE FUNCTION notify_domain() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_domain;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_a_count_global() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_a_count_global;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_mx_count_global() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_mx_count_global;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_mx_checked_count_global() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_mx_checked_count_global;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_a_checked_count_global() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_a_checked_count_global;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_domain_enhanced_based_on_existing_data() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_domain_enhanced_based_on_existing_data;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_domain_redirection() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_domain_redirection;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_domain_mx_record_geolite2() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_domain_mx_record_geolite2;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Creation of triggers:

CREATE TRIGGER domain_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON domain
    FOR EACH ROW
EXECUTE PROCEDURE notify_domain();

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

CREATE TRIGGER a_checked_global_count_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON a_record_checked_count_global
    FOR EACH ROW
EXECUTE PROCEDURE notify_a_checked_count_global();

CREATE TRIGGER mx_checked_global_count_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON mx_record_checked_count_global
    FOR EACH ROW
EXECUTE PROCEDURE notify_mx_checked_count_global();

CREATE TRIGGER domain_enhanced_based_on_existing_data_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON domain_enhanced_based_on_existing_data
    FOR EACH ROW
EXECUTE PROCEDURE notify_domain_enhanced_based_on_existing_data();

CREATE TRIGGER domain_redirection_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON domain_redirection
    FOR EACH ROW
EXECUTE PROCEDURE notify_domain_redirection();

CREATE TRIGGER domain_mx_record_geolite2_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON domain_mx_record_geolite2
    FOR EACH ROW
EXECUTE PROCEDURE notify_domain_mx_record_geolite2();
