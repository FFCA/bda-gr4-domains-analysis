import { Component } from '@angular/core';
import { DigService } from '../../services/dig.service';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';

/**
 * Component mocking a terminal for performing dig requests.
 */
@Component({
    selector: 'app-dig-dialog',
    templateUrl: './dig-dialog.component.html',
    styleUrls: ['./dig-dialog.component.scss'],
})
export class DigDialogComponent {
    /**
     * Font Awesome Terminal icon.
     */
    readonly terminalIcon = faTerminal;

    /**
     * @param dig Injected dig service.
     */
    constructor(readonly dig: DigService) {}
    // TODO: Stick to bottom?
}
