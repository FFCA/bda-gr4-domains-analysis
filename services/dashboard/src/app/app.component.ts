import { Component, HostListener } from '@angular/core';
import { I18nService } from './services/i18n.service';
import { HeaderActionsService } from './services/header-actions.service';
import { StatisticsService } from './services/statistics.service';

/**
 * Central application component.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    /**
     * Initializes i18n and registers socket on starting the app.
     *
     * @param i18n Injected I18n sevice.
     * @param actions Injected service containing header actions.
     * @param statistics Injected statistics service.
     */
    constructor(
        i18n: I18nService,
        statistics: StatisticsService,
        readonly actions: HeaderActionsService
    ) {
        i18n.initialize();
        statistics.setupSocketConnection();
    }

    /**
     * Checks the action service's media query on resizing.
     */
    @HostListener('window:resize') onResize(): void {
        this.actions.checkMediaQuery();
    }
}
