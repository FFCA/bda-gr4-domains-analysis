CREATE TABLE domain (
    id SERIAL PRIMARY KEY,
    top_level_domain VARCHAR(255) UNIQUE NOT NULL,
    mx_record TEXT[] NULL,
    a_record TEXT[] NULL,
	a_record_checked TEXT[] NULL,
	mx_record_checked TEXT[] NULL,
	redirection VARCHAR(255) NULL,
	status_code VARCHAR(255) NULL
);

CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('watch_domain', TG_TABLE_NAME);
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_trigger AFTER INSERT ON domain
    FOR EACH ROW EXECUTE PROCEDURE notify_trigger();

CREATE TRIGGER update_trigger AFTER UPDATE ON domain
    FOR EACH ROW EXECUTE PROCEDURE notify_trigger();

CREATE TRIGGER delete_trigger AFTER DELETE ON domain
    FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
