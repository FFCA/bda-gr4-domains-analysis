import { Component } from '@angular/core';
import { I18nService } from '../../../services/i18n.service';

/**
 * Component to be used within a dialog, listing all available languages and returning the
 * user selection.
 */
@Component({
    selector: 'app-language-selection-dialog',
    templateUrl: './language-selection-dialog.component.html',
    styleUrls: ['./language-selection-dialog.component.scss'],
})
export class LanguageSelectionDialogComponent {
    /**
     * @param i18n Injected internationalization service.
     */
    constructor(readonly i18n: I18nService) {}
}
