import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-load-songs',
  templateUrl: './load-songs.component.html',
  styleUrls: ['./load-songs.component.scss']
})
export class LoadSongsComponent implements OnInit {

  user: any = {};
  optionDisplayed = 'excel';
  buttonClasses: any = {excel: 'btn btn-primary', json: 'btn btn-outline-primary', other: 'btn btn-outline-primary'};
  excelButtonClass = 'btn btn-primary';
  jsonExample = ['[', '  {', '    name : \'Varnams\',', '    songs : [', '      {', '        name : \'Mohanam\',', '        date : \'2021-04-19\',', '        talam : \'Mohanam\'', '      },', '      {', '        name : \'Hamsadhwani\',', '        date : \'2021-06-29\',', '      }', '    ]', '  }', ']'];
  fileMessage = 'Choose file';
  // tslint:disable-next-line: no-bitwise
  songsJson: any = null;
  jsonError: any;
  jsonSuccess = '';

  constructor(public ngbActiveModal: NgbActiveModal, private fileService: FileService) { }

  ngOnInit(): void {
    const sesUser: any = sessionStorage.getItem('user');
    this.user = JSON.parse(sesUser);
  }

  // tslint:disable-next-line: typedef
  resetClasses(value: string) {
    this.optionDisplayed = value;
    // tslint:disable-next-line: forin
    for (const key in this.buttonClasses) {
      this.buttonClasses[key] = 'btn btn-outline-primary';
    }
    this.buttonClasses[this.optionDisplayed] = 'btn btn-primary';
  }

  // tslint:disable-next-line: typedef
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.songsJson = (target.files as FileList)[0];
    this.fileMessage = this.songsJson.name;
  }

  // tslint:disable-next-line: typedef
  submitJson() {
    let error = false;
    if (!this.songsJson) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(this.songsJson);
    reader.onload = (e: any) => {
      try {
        if (typeof reader.result === 'string') {
          const json = JSON.parse(reader.result);
          for (const category of json) {
            if (typeof category.name === 'string') {
              for (const song of category.songs) {
                if (typeof song.name === 'string' && typeof song.date === 'string') {
                  if (!!song.talam && typeof song.talam !== 'string') {
                    this.jsonError = 'Talam must be a string';
                    error = true;
                    return;
                  }
                  if (!!song.ragam && typeof song.ragam !== 'string') {
                    this.jsonError = 'Ragam must be a string';
                    error = true;
                    return;
                  }
                  if (!!song.composer && typeof song.composer !== 'string') {
                    this.jsonError = 'Composer must be a string';
                    error = true;
                    return;
                  }
                  if (!!song.metronome && typeof song.metronome !== 'number') {
                    this.jsonError = 'Metronome must be a string';
                    error = true;
                    return;
                  }
                }
              }
            }
          }
          if (!error) {
            this.jsonSuccess = 'Valid JSON';
            this.fileService.loadSongs({songs: json, user: JSON.stringify(this.user)}).subscribe((resp) => {
              if (resp.success) {
                this.jsonSuccess = 'JSON data has been loaded';
              }
            });
          }
        }
      } catch (err) {
        console.log(err);
        this.jsonError = err;
      }
    };
  }
}
