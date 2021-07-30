import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ModifySongModalComponent } from '../modify-song-modal/modify-song-modal.component';
import { ModifyCategoriesModalComponent } from '../modify-categories-modal/modify-categories-modal.component';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  constructor(public dialog: MatDialog, private fileService: FileService) { }
  songsList: any;
  cardBodyShown: any = {};
  playedSongs: any = [];

  showModal = false;

  ngOnInit(): void {
    console.log(moment().format('YYYY-MM-DD'));
    this.fileService.getFile().subscribe((resp) => {
      this.songsList = JSON.parse(resp.file);
      for (const category of this.songsList) {
        this.cardBodyShown[category.name] = false;
        category.songs.sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      }
    });
  }

  // tslint:disable-next-line: typedef
  addHashtag(element: string) {
    return '#' + element;
  }

  // tslint:disable-next-line: typedef
  toggleCardBodyShownStatus(element: string) {
    this.cardBodyShown[element] = !this.cardBodyShown[element];
  }

  // tslint:disable-next-line: typedef
  getDaysSince(stringDate: string) {
    const date = moment(stringDate);
    const today = moment();
    return today.diff(date, 'days');
  }

  // tslint:disable-next-line: typedef
  getDaysSinceMessage(stringDate: string) {
    const daysBetween = this.getDaysSince(stringDate);
    if (daysBetween === 1) {
      return 'Last played 1 day ago';
    } else {
      return 'Last played ' + daysBetween + ' days ago';
    }
  }

  // tslint:disable-next-line: typedef
  getAlertStatus(song: any, songCategory: string) {
    const daysBetween = this.getDaysSince(song.date);
    for (const playedSong of this.playedSongs) {
      if (song.name === playedSong.name && playedSong.category === songCategory) {
        return 'alert alert-primary';
      }
    }
    if (daysBetween < 7) {
      return 'alert alert-success';
    } else if (daysBetween < 14) {
      return 'alert alert-warning';
    } else {
      return 'alert alert-danger';
    }
  }

  // tslint:disable-next-line: typedef
  changeStatus(songName: string, songCategory: string) {
    let isPlayed = false;
    for (const category of this.songsList) {
      if (category.name === songCategory) {
        for (const song of category.songs) {
          if (song.name === songName) {
            for (let i = 0; i < this.playedSongs.length; i++) {
              if (this.playedSongs[i].name === song.name) {
                song.date = this.playedSongs[i].date;
                isPlayed = true;
                this.playedSongs.splice(i, 1);
              }
            }
            if (!isPlayed) {
              this.playedSongs.push({name: song.name, date: song.date, category: songCategory});
              console.log(this.playedSongs);
              song.date = moment().format('YYYY-MM-DD');
            }
          }
        }
      }
    }
    this.writeToFile();
  }

  // tslint:disable-next-line: typedef
  launchSongModal(song: any, action: string) {
    let allCategories = [];
    for (const category of this.songsList) {
      allCategories.push(category.name);
    }
    const dialogRef = this.dialog.open(ModifySongModalComponent, {
      data: {
        songs: this.songsList,
        label: action,
        name: song.name,
        composer: song.composer,
        ragam: song.ragam,
        categories: allCategories
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.action === 'add') {
          for (const category of this.songsList) {
            if (category.name === result.values.category) {
              // tslint:disable-next-line: max-line-length
              category.songs.push({name: result.values.name, date: moment().format('YYYY-MM-DD'), ragam: result.values.ragam, composer: result.values.composer});
            }
          }
        } else {
          for (const category of this.songsList) {
            for (let i = 0; i < category.songs.length; i++) {
              if (category.songs[i].name === song.name) {
                if (result.action === 'save') {
                  category.songs[i].name = result.values.name;
                  category.songs[i].composer = result.values.composer;
                  category.songs[i].ragam = result.values.ragam;
                } else {
                  category.songs.splice(i, 1);
                }
              }
            }
          }
        }
      }
      this.writeToFile();
    });
  }

  // tslint:disable-next-line: typedef
  launchCategoryModal(category: string, action: string) {
    const dialogRef = this.dialog.open(ModifyCategoriesModalComponent, {
      data: {
        name: category,
        label: action
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.action === 'add') {
          this.songsList.push({name: result.values.name, songs: []});
        } else {
          for (let i = 0; i < this.songsList.length; i++) {
            if (this.songsList[i].name === category) {
              if (result.action === 'save') {
                this.songsList[i].name = result.values.name;
              } else {
                this.songsList.splice(i, 1);
              }
            }
          }
        }
      }
      this.writeToFile();
    });
  }

  // tslint:disable-next-line: typedef
  writeToFile() {
    this.fileService.writeToFile(this.songsList).subscribe((resp: any) => {
      if (resp.success) {
        console.log('Saved');
      }
    });
  }
}


