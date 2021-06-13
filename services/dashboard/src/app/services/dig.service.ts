import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DigResponse } from '../model/api/dig-response';

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
     */
    constructor(private readonly http: HttpClient) {}

    /**
     * Performs a request to the dig service using the first part before a white space of {{ currentValue }} if
     * {{ currentValue }} is not empty. Afterwards, {{ currentValue }} is reset.
     */
    $dig(): Observable<DigResponse> | undefined {
        if (this.currentValue.trim()) {
            const who = this.currentValue.trim();
            this.currentValue = '';
            return this.http.get<DigResponse>(environment.digApi + who);
        } else return undefined;
    }
}
