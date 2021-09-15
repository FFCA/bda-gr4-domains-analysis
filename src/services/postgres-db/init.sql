-- Creation of tables:

CREATE TABLE domain
(
    top_level_domain VARCHAR(255) PRIMARY KEY,
    mx_record        VARCHAR(255)[] NULL,
    a_record         VARCHAR(255)[] NULL
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
    ipv6_available   BOOLEAN NULL,
    ipv6_error       INTEGER NOT NULL REFERENCES exception_message (id)
);

CREATE TABLE domain_redirection
(
    top_level_domain VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    redirection      VARCHAR(255) NULL,
    status_code      INTEGER      NULL
);

CREATE TABLE soa
(
    top_level_domain        VARCHAR(255) PRIMARY KEY REFERENCES domain (top_level_domain),
    soa_name                VARCHAR(255)   NULL,
    soa_information_error   INTEGER        NOT NULL REFERENCES exception_message (id),
    refresh                 INTEGER        NULL,
    minimum                 INTEGER        NULL,
    nameservers             VARCHAR(255)[] NULL,
    nameservers_error       INTEGER        NOT NULL REFERENCES exception_message (id),
    nameservers_count       INTEGER NOT NULL
);

CREATE TABLE domain_mx_record_geolite2
(
    mx_record_checked              VARCHAR(255) NOT NULL,
    mx_record_ip                   VARCHAR(255) NOT NULL,
    iso_code                       VARCHAR(255) NULL,
    autonomous_system_organization VARCHAR(255) NULL,
    city                           VARCHAR(255) NULL,
    postal                         VARCHAR(255) NULL,
    latitude                       VARCHAR(255) NULL,
    longitude                      VARCHAR(255) NULL,
    PRIMARY KEY(mx_record_checked, mx_record_ip)
);

CREATE TABLE soa_nameserver_details
(
    soa_name                       VARCHAR(255) NOT NULL,
    ipv4                           VARCHAR(255) NOT NULL,
    iso_code                       VARCHAR(255) NULL,
    city                           VARCHAR(255) NULL,
    postal                         VARCHAR(255) NULL,
    latitude                       VARCHAR(255) NULL,
    longitude                      VARCHAR(255) NULL,
    autonomous_system_organization VARCHAR(255) NULL,
    PRIMARY KEY(soa_name, ipv4)
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
       (7, 'Too Many Redirects'),
       (8, 'Unknown Exception');

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
SELECT ROUND((SUM(CASE WHEN 'localhost'=ANY(mx_record) THEN 1 ELSE 0 END)::numeric / COUNT(*)), 4) AS percentage
FROM domain
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
FROM (
    SELECT iso_code
    FROM domain_records_checked d
        INNER JOIN domain_mx_record_geolite2 mx
            ON mx.mx_record_checked = ANY (d.mx_record_checked)
    ) x;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_soa_providers_outside_of_germany()
    RETURNS TABLE
        (
        percentage FLOAT
        )
    AS
$$
SELECT ROUND((SUM(CASE WHEN iso_code != 'DE' THEN 1 ELSE 0 END)::numeric /
              COUNT(iso_code)), 4) AS percentage
FROM soa_nameserver_details;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_has_ip_v6()
    RETURNS TABLE
        (
            percentage FLOAT
        )
AS
$$
SELECT ROUND((SUM(CASE WHEN ipv6_available THEN 1 ELSE 0 END)::numeric /
              COUNT(ipv6_available)), 4) AS percentage
FROM ip_v6_information;
$$ LANGUAGE sql;

CREATE FUNCTION avg_soa_minimum()
    RETURNS TABLE
        (
            avg FLOAT
        )
AS
$$
SELECT ROUND(AVG(minimum))
FROM soa;
$$ LANGUAGE sql;

CREATE FUNCTION avg_soa_refresh()
    RETURNS TABLE
        (
            avg FLOAT
        )
AS
$$
SELECT ROUND(AVG(refresh))
FROM soa;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_mx_checked_has_localhost()
    RETURNS TABLE
        (
        percentage FLOAT
        )
    AS
$$
SELECT ROUND((SUM(CASE WHEN 'localhost'=ANY(mx_record_checked) THEN 1 ELSE 0 END)::numeric /
              COUNT(mx_record_checked)), 4) AS percentage
FROM domain_records_checked;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_diff_a_records_ignoring_errs()
    RETURNS TABLE
        (
        percentage FLOAT
        )
    AS
$$
SELECT ROUND((1 - SUM(CASE WHEN a_record = a_record_checked THEN 1 ELSE 0 END)::numeric /
              COUNT(a_record_checked)), 4) AS percentage
FROM domain d INNER JOIN domain_records_checked c on d.top_level_domain = c.top_level_domain;
$$ LANGUAGE sql;

CREATE FUNCTION percentage_of_diff_mx_records_ignoring_errs()
    RETURNS TABLE
        (
        percentage FLOAT
        )
    AS
$$
SELECT ROUND((1 - SUM(CASE WHEN mx_record = mx_record_checked THEN 1 ELSE 0 END)::numeric /
              COUNT(mx_record_checked)), 4) AS percentage
FROM domain d INNER JOIN domain_records_checked c on d.top_level_domain = c.top_level_domain;
$$ LANGUAGE sql;

-- for Charts:

CREATE FUNCTION top_10_mx_global()
    RETURNS TABLE
        (
            mx_record   VARCHAR(255),
            count       INTEGER
        )
AS
$$
SELECT mx_record, count(*)
FROM (SELECT UNNEST(mx_record) AS mx_record FROM domain) mx
GROUP BY mx_record
ORDER BY count DESC
LIMIT 10
$$ LANGUAGE sql;

CREATE FUNCTION top_10_a_global()
    RETURNS TABLE
        (
            a_record    VARCHAR(255),
            count       INTEGER
        )
AS
$$
SELECT a_record, count(*)
FROM (SELECT UNNEST(a_record) AS a_record FROM domain) a
GROUP BY a_record
ORDER BY count DESC
LIMIT 10
$$ LANGUAGE sql;

CREATE FUNCTION top_10_mx_checked_global()
    RETURNS TABLE
        (
            mx_record_checked   VARCHAR(255),
            count               INTEGER
        )
    AS
$$
SELECT mx_record_checked, count(*)
FROM (SELECT UNNEST(mx_record_checked) AS mx_record_checked FROM domain_records_checked) mx
GROUP BY mx_record_checked
ORDER BY count DESC
LIMIT 10
$$ LANGUAGE sql;

CREATE FUNCTION top_10_a_checked_global()
    RETURNS TABLE
        (
            a_record_checked    VARCHAR(255),
            count               INTEGER
        )
AS
$$
SELECT a_record_checked, count(*)
FROM (SELECT UNNEST(a_record_checked) AS a_record_checked FROM domain_records_checked) a
GROUP BY a_record_checked
ORDER BY count DESC
LIMIT 10
$$ LANGUAGE sql;

CREATE FUNCTION mx_count_grouped()
    RETURNS TABLE
            (
                count           INTEGER,
                mx_record_count INTEGER
            )
AS
$$
SELECT COUNT(*), COALESCE(CARDINALITY(mx_record), 0) mx_record_count
FROM domain
GROUP BY mx_record_count
ORDER BY mx_record_count
$$ LANGUAGE sql;

CREATE FUNCTION a_count_grouped()
    RETURNS TABLE
            (
                count          INTEGER,
                a_record_count INTEGER
            )
AS
$$
SELECT COUNT(*), COALESCE(CARDINALITY(a_record), 0) a_record_count
FROM domain
GROUP BY a_record_count
ORDER BY a_record_count
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
FROM (
    SELECT autonomous_system_organization, iso_code
    FROM domain_records_checked d
           INNER JOIN domain_mx_record_geolite2 mx
                      ON mx.mx_record_checked = ANY (d.mx_record_checked)
    ) x
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
FROM (
    SELECT city, iso_code
    FROM domain_records_checked d
        INNER JOIN domain_mx_record_geolite2 mx
            ON mx.mx_record_checked = ANY (d.mx_record_checked)
    ) x
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
FROM (
    SELECT iso_code
    FROM domain_records_checked d
        INNER JOIN domain_mx_record_geolite2 mx
            ON mx.mx_record_checked = ANY (d.mx_record_checked)
    ) x
GROUP BY iso_code
ORDER BY count DESC
LIMIT 10;
$$ LANGUAGE sql;

CREATE FUNCTION soa_nameservers_count_where_no_err()
    RETURNS TABLE(
        count INTEGER,
        nameservers_cont INTEGER
    )
AS
$$
SELECT COUNT(nameservers_count) count, nameservers_count
FROM soa
WHERE nameservers_error = 0
GROUP BY nameservers_count;
$$ LANGUAGE sql;

CREATE FUNCTION top_10_soa_countries()
    RETURNS TABLE
        (
            count    INTEGER,
            iso_code VARCHAR(3)
        )
    AS
$$
SELECT COUNT(iso_code) count, iso_code
FROM soa_nameserver_details
GROUP BY iso_code
ORDER BY count DESC
LIMIT 10;
$$ LANGUAGE sql;

CREATE FUNCTION top_10_soa_asn()
    RETURNS TABLE
        (
        count                          INTEGER,
        autonomous_system_organization VARCHAR(255),
        iso_code                       VARCHAR(3)
        )
    AS
$$

SELECT COUNT(*), autonomous_system_organization, iso_code
FROM soa INNER JOIN soa_nameserver_details snd ON snd.soa_name = soa.soa_name
GROUP BY autonomous_system_organization, iso_code
ORDER BY count DESC
LIMIT 10;
$$ LANGUAGE sql;

CREATE FUNCTION top_10_soa_cities()
    RETURNS TABLE
        (
        count    INTEGER,
        city     VARCHAR(255),
        iso_code VARCHAR(3)
        )
    AS
$$
SELECT COUNT(city) count, city, iso_code
FROM soa_nameserver_details
GROUP BY city, iso_code
ORDER BY count DESC
LIMIT 10;
$$ LANGUAGE sql;

CREATE FUNCTION a_checked_count_grouped()
    RETURNS TABLE
        (
        count                  INTEGER,
        a_record_checked_count INTEGER
        )
    AS
$$
SELECT COUNT(*), COALESCE(CARDINALITY(a_record_checked), 0) a_record_checked_count
FROM domain_records_checked
WHERE a_record_checked_error = 0
GROUP BY a_record_checked_count
ORDER BY a_record_checked_count;
$$ LANGUAGE sql;

CREATE FUNCTION mx_checked_count_grouped()
    RETURNS TABLE
        (
        count                   INTEGER,
        mx_record_checked_count INTEGER
        )
    AS
$$
SELECT COUNT(*), COALESCE(CARDINALITY(mx_record_checked), 0) mx_record_checked_count
FROM domain_records_checked
WHERE mx_record_checked_error = 0
GROUP BY mx_record_checked_count
ORDER BY mx_record_checked_count;
$$ LANGUAGE sql;

-- Creation of notification functions:

CREATE FUNCTION notify_domain() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_domain;
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

CREATE FUNCTION notify_ip_v6_information() RETURNS trigger AS
$$
DECLARE
BEGIN
    NOTIFY watch_ip_v6_information;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_soa() RETURNS trigger AS
    $$
DECLARE
BEGIN
    NOTIFY watch_soa;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_soa_nameserver_details() RETURNS trigger AS
    $$
DECLARE
BEGIN
    NOTIFY watch_soa_nameserver_details;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION notify_domain_records_checked() RETURNS trigger AS
    $$
DECLARE
BEGIN
    NOTIFY watch_domain_records_checked;
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

CREATE TRIGGER ip_v6_information_trigger
    AFTER INSERT OR
        UPDATE OR
        DELETE
    ON ip_v6_information
    FOR EACH ROW
EXECUTE PROCEDURE notify_ip_v6_information();

CREATE TRIGGER soa_trigger
    AFTER INSERT OR
UPDATE OR
DELETE
ON soa
    FOR EACH ROW
EXECUTE PROCEDURE notify_soa();

CREATE TRIGGER soa_nameserver_details_trigger
    AFTER INSERT OR
UPDATE OR
DELETE
ON soa_nameserver_details
    FOR EACH ROW
EXECUTE PROCEDURE notify_soa_nameserver_details();

CREATE TRIGGER domain_records_checked_trigger
    AFTER INSERT OR
UPDATE OR
DELETE
ON domain_records_checked
    FOR EACH ROW
EXECUTE PROCEDURE notify_domain_records_checked();
