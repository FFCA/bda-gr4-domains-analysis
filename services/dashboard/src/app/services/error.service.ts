import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';

/**
 * Service class for centrally handling occurring errors.
 */
@Injectable({
    providedIn: 'root',
})
export class ErrorService implements ErrorHandler {
    /**
     * @param dialog Injected service for opening dialogs.
     * @param ngZone Injected NgZone.
     */
    constructor(
        private readonly dialog: MatDialog,
        private readonly ngZone: NgZone
    ) {}

    /**
     * Handles any occurring (uncaught) error: Logs it to the console and informs the user by showing a dialog.
     *
     * @param error Error to be handled.
     */
    handleError(error: Error): void {
        console.error(error);
        this.ngZone.run(() => {
            this.dialog.open(ErrorDialogComponent, {
                data: error.stack ?? error,
            });
        });
    }
}
