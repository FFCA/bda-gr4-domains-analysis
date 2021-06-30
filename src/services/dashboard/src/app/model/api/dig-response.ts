/**
 * Dig response as returned from the dig microservice.
 */
export class DigResponse {
    /**
     * Dig answer.
     */
    readonly answer!: string;

    /**
     * URL/IP that has been digged.
     */
    readonly digged!: string;

    /**
     * Timestamp of the response.
     */
    readonly timestamp!: Date;
}
