import { Component, HostListener } from '@angular/core';
import { HeaderActionsService } from '../../services/header-actions.service';
import { StatisticsService } from '../../services/statistics.service';

/**
 * The application's header component.
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    /**
     * True if the page is not at the top, false if it is.
     */
    isScrolled: boolean = false;

    /**
     * @param actions Injected header actions service.
     * @param statistics Injected statistics service.
     */
    constructor(
        readonly actions: HeaderActionsService,
        readonly statistics: StatisticsService
    ) {}

    /**
     * Sets {{ isScrolled }} based on the current page scrolling any time a scroll event is emitted.
     */
    @HostListener('window:scroll') onScroll(): void {
        this.isScrolled = window.pageYOffset > 0;
    }
}
