import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  imports: [MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskTitle: string },
  ) {}
}

