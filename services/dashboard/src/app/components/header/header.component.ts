import { Component, HostListener } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

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

    // TODO temporary solution => use logic of new service unifying actions and remove here
    constructor(readonly i18n: I18nService) {}

    /**
     * Sets {{ isScrolled }} based on the current page scrolling any time a scroll event is emitted.
     */
    @HostListener('window:scroll') onScroll(): void {
        this.isScrolled = window.pageYOffset > 0;
    }
}
