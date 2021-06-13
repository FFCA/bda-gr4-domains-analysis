import { Component, HostListener } from '@angular/core';
import { HeaderActionsService } from '../../services/header-actions.service';

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
     * @param actions Inejcted header actions service.
     */
    constructor(readonly actions: HeaderActionsService) {}

    /**
     * Sets {{ isScrolled }} based on the current page scrolling any time a scroll event is emitted.
     */
    @HostListener('window:scroll') onScroll(): void {
        this.isScrolled = window.pageYOffset > 0;
    }
}
