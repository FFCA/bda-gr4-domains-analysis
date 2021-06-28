import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

/**
 * Central snackbar service handling localizations.
 */
@Injectable({
    providedIn: 'root',
})
export class LocalizedSnackbarService {
    /**
     * @param snackbar Injected Material snackbar service.
     * @param translate Injected translation service.
     */
    constructor(
        private readonly snackbar: MatSnackBar,
        private readonly translate: TranslateService
    ) {}

    /**
     * Displays a localized snackbar.
     *
     * @param infoKey Translation key for the string to be displayed.
     * @param params Optional params for the string to be displayed.
     * @param duration Time in MS the snackbar is to be shown in (default: 3000 / 3s)
     * @param closeKey Translation key for the closing action key.
     */
    showSnackbar(
        infoKey: string,
        params?: object,
        duration: number = 3000,
        closeKey: string = 'general.close'
    ): void {
        const [close, info] = [closeKey, infoKey];
        const config = { duration };
        this.translate.get([close, info], params).subscribe((translation) => {
            this.snackbar.open(translation[info], translation[close], config);
        });
    }
}
