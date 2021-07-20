import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modify-song-modal',
  templateUrl: './modify-song-modal.component.html',
  styleUrls: ['./modify-song-modal.component.scss']
})
export class ModifySongModalComponent implements OnInit {

  deletePressed = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  setDeletePressed(deleteVal: boolean) {
    this.deletePressed = deleteVal;
  }

}
