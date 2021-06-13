import { Component, ElementRef, ViewChild } from '@angular/core';
import { DigService } from '../../services/dig.service';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DigResponse } from '../../model/api/dig-response';

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
     * List of all dig requests.
     */
    requests: Observable<DigResponse>[] = [];

    /**
     * Element containing the displayed responses.
     * @private
     */
    @ViewChild('container') private readonly container!: ElementRef;

    /**
     * @param digService Injected dig service.
     */
    constructor(readonly digService: DigService) {}

    /**
     * Performs a dig request through {{ digService }} and (if valid) adds it to {{ requests }}
     * while piping in order to scroll down in case of a result.
     */
    dig(): void {
        const req = this.digService.$dig()?.pipe(
            tap(() => {
                setTimeout(() => {
                    const el = this.container.nativeElement;
                    el.scrollTop = el.scrollHeight;
                });
            })
        );

        if (req) this.requests.push(req);
    }
}
