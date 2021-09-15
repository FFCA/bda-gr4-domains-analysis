/**
 * Enum containing all DB events used in the Domain Analysis project.
 */
export enum DomainAnalysisEvent {
    DOMAIN = 'watch_domain',
    A_CHECKED_COUNT_GLOBAL = 'watch_a_checked_count_global',
    MX_CHECKED_COUNT_GLOBAL = 'watch_mx_checked_count_global',
    DOMAIN_REDIRECTION = 'watch_domain_redirection',
    DOMAIN_MX_GEO = 'watch_domain_mx_record_geolite2',
    IP_V6_INFORMATION = 'watch_ip_v6_information',
    SOA = 'watch_soa',
    SOA_NAMESERVER_DETAILS = 'watch_soa_nameserver_details',
    DOMAIN_RECORDS_CHECKED = 'watch_domain_records_checked',
}
