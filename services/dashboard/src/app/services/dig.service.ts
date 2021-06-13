import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Dig response as returned from the dig microservice.
 */
type DigResponse = {
    /**
     * Dig answer.
     */
    answer: string;

    /**
     * URL/IP that has been digged.
     */
    digged: string;

    /**
     * Timestamp of the response.
     */
    timestamp: Date;
};

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
    results: Observable<DigResponse>[] = [];

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
                this.http.get<DigResponse>(environment.digApi + who)
            ); // TODO change i.o. to not perform again
            if (this.results.length > 20) this.results.pop();
        }
    }
}
