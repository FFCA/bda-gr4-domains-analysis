import { DomainAnalysisEvent } from '../model/domain-analysis-event';
import { DomainAnalysisFunctionName } from '../model/domain-analysis-function-name';

/**
 * Map containing all functions to be triggered for a given event.
 */
const eventQueryMap = new Map<
    DomainAnalysisEvent,
    DomainAnalysisFunctionName[]
>([
    [
        DomainAnalysisEvent.DOMAIN,
        [
            DomainAnalysisFunctionName.DOMAIN_COUNT,
            DomainAnalysisFunctionName.TOP_10_A_GLOBAL,
            DomainAnalysisFunctionName.TOP_10_MX_GLOBAL,
            DomainAnalysisFunctionName.MX_COUNT_GROUPED,
            DomainAnalysisFunctionName.A_COUNT_GROUPED,
            DomainAnalysisFunctionName.PERCENTAGE_OF_MX_LOCALHOST,
        ],
    ],
    [
        DomainAnalysisEvent.DOMAIN_REDIRECTION,
        [
            DomainAnalysisFunctionName.DOMAIN_ACCESS_STATUS_CODES,
            DomainAnalysisFunctionName.PERCENTAGE_OF_REDIRECTIONS,
            DomainAnalysisFunctionName.PERCENTAGE_OF_REDIRECTIONS_CODE_200,
            DomainAnalysisFunctionName.TOP_10_REDIRECTED_TO,
        ],
    ],
    [
        DomainAnalysisEvent.DOMAIN_MX_GEO,
        [
            DomainAnalysisFunctionName.TOP_10_MX_COUNTRIES,
            DomainAnalysisFunctionName.TOP_10_MX_CITIES,
            DomainAnalysisFunctionName.TOP_10_MX_ASN,
            DomainAnalysisFunctionName.PERCENTAGE_MX_PROVIDERS_OUTSIDE_OF_GER,
        ],
    ],
    [
        DomainAnalysisEvent.IP_V6_INFORMATION,
        [DomainAnalysisFunctionName.PERCENTAGE_HAS_IP_V6],
    ],
    [
        DomainAnalysisEvent.SOA,
        [
            DomainAnalysisFunctionName.AVG_SOA_MINIMUM,
            DomainAnalysisFunctionName.AVG_SOA_REFRESH,
            DomainAnalysisFunctionName.SOA_NAMESERVERS_COUNT_WHERE_NO_ERR,
        ],
    ],
    [
        DomainAnalysisEvent.SOA_NAMESERVER_DETAILS,
        [
            DomainAnalysisFunctionName.SOA_TOP_TEN_CITIES,
            DomainAnalysisFunctionName.SOA_TOP_TEN_ASN,
            DomainAnalysisFunctionName.SOA_TOP_TEN_COUNTRIES,
            DomainAnalysisFunctionName.SOA_OUTSIDE_GER,
        ],
    ],
    [
        DomainAnalysisEvent.DOMAIN_RECORDS_CHECKED,
        [
            DomainAnalysisFunctionName.PERCENTAGE_OF_MX_CHECKED_LOCALHOST,
            DomainAnalysisFunctionName.PERCENTAGE_OF_A_DIFF_IGNORING_ERRS,
            DomainAnalysisFunctionName.PERCENTAGE_OF_MX_DIFF_IGNORING_ERRS,
            DomainAnalysisFunctionName.A_CHECKED_COUNT_GROUPED,
            DomainAnalysisFunctionName.MX_CHECKED_COUNT_GROUPED,
            DomainAnalysisFunctionName.TOP_10_A_CHECKED_GLOBAL,
            DomainAnalysisFunctionName.TOP_10_MX_CHECKED_GLOBAL
        ],
    ],
]);

/**
 * @param event DB Event the functions for are to be returned.
 * @return DB functions for the given event.
 */
export const getDbFunctionsByEvent = (
    event: DomainAnalysisEvent
): DomainAnalysisFunctionName[] => {
    return eventQueryMap.get(event)!;
};

/**
 * Returns all DB functions as map with the respective DB event as key.
 */
export const getDbFunctions = (): Map<
    DomainAnalysisEvent,
    DomainAnalysisFunctionName[]
> => {
    return eventQueryMap;
};

/**
 * Returns a list of all existing DB events.
 */
export const getAllEvents = (): DomainAnalysisEvent[] => {
    return [...eventQueryMap.keys()];
};
