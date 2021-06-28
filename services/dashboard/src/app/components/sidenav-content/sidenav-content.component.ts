import { Component } from '@angular/core';
import { HeaderActionsService } from '../../services/header-actions.service';
import { StatisticsService } from '../../services/statistics.service';

/**
 * Content to be displayed in the side nav (small screens only)
 */
@Component({
    selector: 'app-sidenav-content',
    templateUrl: './sidenav-content.component.html',
    styleUrls: ['./sidenav-content.component.scss'],
})
export class SidenavContentComponent {
    /**
     * @param actions Injected actions service.
     * @param statistics Injected statistics service.
     */
    constructor(
        readonly actions: HeaderActionsService,
        readonly statistics: StatisticsService
    ) {}
}
