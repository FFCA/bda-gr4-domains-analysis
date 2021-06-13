import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
     * List of all dig requests/results.
     */
    results: Observable<string>[] = [];

    /**
     * @param http Injected HTTP client.
     */
    constructor(private readonly http: HttpClient) {}

    /**
     * Performs a request to the dig service using the first part before a white space of {{ currentValue }}.
     * Afterwards, the request is pushed to {{ results }} and {{ currentValue }} is reset.
     */
    dig(): void {
        if (this.currentValue.trim()) {
            const who = this.currentValue.trim().split('\\s')[0]; // TODO: Snackbar if space?
            this.currentValue = '';
            this.results.push(
                this.http.get(environment.digApi + who, {
                    responseType: 'text',
                })
            );
            if (this.results.length > 20) this.results.pop();
        }
    }
}
