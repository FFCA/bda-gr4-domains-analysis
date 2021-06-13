import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DigResponse } from '../model/api/dig-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

/**
 * Service to be used for communicating with the dig microservice.
 */
@Injectable({
    providedIn: 'root',
})
export class DigService {
    /**
     * Current input value.
     */
    currentValue: string = 'example.com';

    /**
     * @param http Injected HTTP client.
     * @param snackbar Injected snackbar service.
     * @param translate Injected translation service.
     */
    constructor(
        private readonly http: HttpClient,
        private readonly snackbar: MatSnackBar,
        private readonly translate: TranslateService
    ) {}

    /**
     * Performs a request to the dig service using the first part before a white space of {{ currentValue }} if
     * {{ currentValue }} is not empty. Afterwards, {{ currentValue }} is reset.
     */
    $dig(): Observable<DigResponse> | undefined {
        const chars = [...this.currentValue.trim()];
        const illegal = chars.find((c) => !c.match(/[a-z0-9.:\-_]/));
        if (illegal) this.openSnackbar('illegalDigChar', { illegal });
        else if (!chars[0].match(/[a-z0-9]/)) {
            this.openSnackbar('illegalLeading');
        } else if (!chars[chars.length - 1].match(/[a-z0-9]/)) {
            this.openSnackbar('illegalTrailing');
        } else if (this.currentValue.trim()) {
            const who = this.currentValue.trim();
            this.currentValue = '';
            return this.http.get<DigResponse>(environment.digApi + who);
        }
        return undefined;
    }

    /**
     * Opens a default snackbar with the given translation key appended to "snackbar.dig.".
     *
     * @param translationKey Key of the text to be displayed.
     * @param params Params to be added to the snackbar.
     * @private
     */
    private openSnackbar(translationKey: string, params?: any): void {
        this.snackbar.open(
            this.translate.instant('snackbar.dig.' + translationKey, params),
            this.translate.instant('general.close'),
            { duration: 4000 }
        );
    }
}
