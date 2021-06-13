import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

/**
 * Module to be used for exporting Angular Material components to be used in this application.
 */
@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
    ],
})
export class MaterialModule {}
