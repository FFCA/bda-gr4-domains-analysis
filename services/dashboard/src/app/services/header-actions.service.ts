import { Injectable } from '@angular/core';
import { I18nService } from './i18n.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { MatDialog } from '@angular/material/dialog';

/**
 * Action item including styling/descriptive properties to be displayed.
 */
type Action = {
    translationKey: string;
    color: string;
    onClick: () => void;
    icon?: string;
    faIcon?: IconDefinition;
};

/**
 * Service for globally defining header actions in order to use them in both the header and the nav menu (small screens).
 */
@Injectable({
    providedIn: 'root',
})
export class HeaderActionsService {
    /**
     * True if the sidebar is currently open, false if not.
     */
    isSidebarOpened = false;

    /**
     * List of actions including styling/descriptive properties to be displayed.
     */
    readonly actionItems: Action[] = [
        {
            icon: 'language',
            translationKey: 'header.action.language',
            color: 'primary',
            onClick: () => this.i18n.mockLanguageSwitch(),
        },
        {
            faIcon: faTerminal,
            translationKey: 'header.action.digMs',
            color: 'primary',
            onClick: () => console.log("to be implemented"),
        },
    ].map((a) => {
        return {
            ...a,
            onClick: () => {
                a.onClick();
                this.isSidebarOpened = false;
            },
        };
    });

    /**
     * Query that matches on small screens.
     * @private
     */
    private readonly mobileQuery: MediaQueryList;

    /**
     * @param media Media Matcher to be used in order to initialize the service's mobile query.
     * @param i18n Injected i18n service.
     * @param dialog Injected Material dialog service.
     */
    constructor(
        media: MediaMatcher,
        private readonly i18n: I18nService,
        private readonly dialog: MatDialog
    ) {
        // See bootstrap breakpoints
        this.mobileQuery = media.matchMedia('(max-width: 576px)');
    }

    /**
     * Closes the sidebar if the query does not match (any more).
     */
    checkMediaQuery(): void {
        if (!this.mobileQuery.matches) {
            this.isSidebarOpened = false;
        }
    }
}
