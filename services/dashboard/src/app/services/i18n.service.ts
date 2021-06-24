import { Injectable } from '@angular/core';
import { Language } from '../model/internal/language';
import { TranslateService } from '@ngx-translate/core';

/**
 * Service for globally handling states concerning language selection.
 */
@Injectable({
    providedIn: 'root',
})
export class I18nService {
    /**
     * List of all available languages.
     */
    readonly supportedLanguages: Language[] = [
        new Language('en', 'English', 'flag-icon-gb'),
        new Language('de', 'Deutsch', 'flag-icon-de'),
    ];

    /**
     * Sets the default language (en) on creating service.
     *
     * @param translate Injected translate service for internal usage.
     */
    constructor(private readonly translate: TranslateService) {
        this.translate.setDefaultLang('en');
    }

    /**
     * Initializes the language service by determining the user's preferred language based on either storage
     * (if the tool has been used before) or browser settings and setting it if offered (default = enlish).
     */
    initialize(): void {
        this.currentLanguage = this.supportedLanguages.find(
            (l) =>
                l.iso2 ===
                (this.supportedUserLanguageIso2 ?? this.translate.defaultLang)
        )!;
    }

    /**
     * @param language Language to be used and stored in local storage.
     */
    set currentLanguage(language: Language) {
        this.translate.use(language.iso2);
        localStorage.setItem('language', language.iso2);
    }

    /**
     * @return Currently used language (iso2).
     */
    get currentLanguageIso2(): string {
        return this.translate.currentLang;
    }

    /**
     * Determines the user's preferred language based on storage/`navigator.languages`/
     * `navigator.language` and returns it if supported by this application.
     * @private
     * @return Preferred supported user language or undefined in case of no match.
     */
    private get supportedUserLanguageIso2(): string | undefined {
        return [
            localStorage.getItem('language'),
            ...navigator.languages,
            navigator.language,
        ]
            .filter((l) => !!l)
            .map((l) => (l as string).split('-')[0])
            .find((l) =>
                this.supportedLanguages
                    .map((supported) => supported.iso2)
                    .includes(l)
            );
    }
}
