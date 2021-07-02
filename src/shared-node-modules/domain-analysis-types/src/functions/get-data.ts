import { DomainAnalysisEvent } from '../model/domain-analysis-event';

const eventQueryMap = new Map<DomainAnalysisEvent, string>([
    [DomainAnalysisEvent.DOMAIN, 'domain_count'],
    [DomainAnalysisEvent.A_COUNT_GLOBAL, 'top_10_a_global'],
    [DomainAnalysisEvent.MX_COUNT_GLOBAL, 'top_10_mx_global'],
    [DomainAnalysisEvent.A_CHECKED_COUNT_GLOBAL, 'top_10_a_checked_global'],
    [DomainAnalysisEvent.MX_CHECKED_COUNT_GLOBAL, 'top_10_mx_checked_global'],
]);

export const getDbFunctionByEvent = (event: DomainAnalysisEvent): string => {
    return eventQueryMap.get(event)!;
};

export const getDbFunctions = (): Map<DomainAnalysisEvent, string> => {
    return eventQueryMap;
};

export const getAllEvents = (): DomainAnalysisEvent[] => {
    return [...eventQueryMap.keys()];
};
