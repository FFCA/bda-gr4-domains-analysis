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
