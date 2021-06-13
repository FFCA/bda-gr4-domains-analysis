/**
 * Language class for internally managing language selection/configuration.
 */
export class Language {
    /**
     * @param iso2 Iso code of the language
     * @param name The language's name (native language)
     * @param englishName The language's name (english)
     */
    constructor(
        readonly iso2: string,
        readonly name: string,
        readonly englishName?: string
    ) {}
}
