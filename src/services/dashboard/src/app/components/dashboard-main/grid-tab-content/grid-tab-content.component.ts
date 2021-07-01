import { Component, Input } from '@angular/core';
import { DisplayedTab } from '../../../model/internal/displayed-tab';

/**
 * Compoennt for wrapping tab content to be displayed.
 */
@Component({
    selector: 'app-grid-tab-content',
    templateUrl: './grid-tab-content.component.html',
    styleUrls: ['./grid-tab-content.component.scss'],
})
export class GridTabContentComponent {
    /**
     * Tab data to be show.
     */
    @Input() tab!: DisplayedTab;
}
