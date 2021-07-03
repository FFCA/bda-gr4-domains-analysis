/**
 * Enum containing all DB events used in the Domain Analysis project.
 */
export enum DomainAnalysisEvent {
    DOMAIN = 'watch_domain',
    A_COUNT_GLOBAL = 'watch_a_count_global',
    MX_COUNT_GLOBAL = 'watch_mx_count_global',
    A_CHECKED_COUNT_GLOBAL = 'watch_a_checked_count_global',
    MX_CHECKED_COUNT_GLOBAL = 'watch_mx_checked_count_global',
    DOMAIN_ENHANCED_BASED_ON_EXISTING = 'watch_domain_enhanced_based_on_existing_data',
    DOMAIN_REDIRECTION = 'watch_domain_redirection',
    DOMAIN_MX_GEO = 'watch_domain_mx_record_geolite2',
}
