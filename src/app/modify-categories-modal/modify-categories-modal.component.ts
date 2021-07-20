import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modify-categories-modal',
  templateUrl: './modify-categories-modal.component.html',
  styleUrls: ['./modify-categories-modal.component.scss']
})
export class ModifyCategoriesModalComponent implements OnInit {

  deletePressed = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  setDeletePressed(deleteVal: boolean) {
    this.deletePressed = deleteVal;
  }

}
