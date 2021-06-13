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
        const regex = /[a-z0-9.:-_]/;
        const illegal = [...this.currentValue].find((c) => !c.match(regex));
        if (illegal) {
            this.snackbar.open(
                this.translate.instant('snackbar.illegalDigChar', {illegal}),
                this.translate.instant('general.close'),
                { duration: 4000 }
            );
        } else if (this.currentValue.trim()) {
            const who = this.currentValue.trim();
            this.currentValue = '';
            return this.http.get<DigResponse>(environment.digApi + who);
        }
        return undefined;
    }
}
