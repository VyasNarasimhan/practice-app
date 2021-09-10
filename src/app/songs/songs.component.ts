import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ModifySongModalComponent } from '../modify-song-modal/modify-song-modal.component';
import { ModifyCategoriesModalComponent } from '../modify-categories-modal/modify-categories-modal.component';
import { FileService } from '../services/file.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadSongsComponent } from '../load-songs/load-songs.component';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  constructor(public dialog: MatDialog, private fileService: FileService, private router: Router, private ngbModal: NgbModal) { }
  songsList: any;
  cardBodyShown: any = {};
  playedSongs: any = [];
  name = '';
  showModal = false;
  user: any = {};
  isLoaded = false;

  ngOnInit(): void {
    if (sessionStorage.getItem('user') === null) {
      this.router.navigate(['home']);
    } else {
      const userInfo: any = sessionStorage.getItem('user');
      this.user = JSON.parse(userInfo);
      this.fileService.getSongs(this.user.username).subscribe((resp) => {
        this.songsList = resp.songs;
        sessionStorage.setItem('songs', JSON.stringify(resp.songs));
        for (const category of this.songsList) {
          this.cardBodyShown[category.id] = false;
          category.songs.sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
        }
        this.isLoaded = true;
      });
    }
  }

  // tslint:disable-next-line: typedef
  toggleCardBodyShownStatus(categoryId: number) {
    this.cardBodyShown[categoryId] = !this.cardBodyShown[categoryId];
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
  getAlertStatus(song: any, categoryId: number) {
    let result = 'mb-1 ';
    const daysBetween = this.getDaysSince(song.date);
    for (const playedSong of this.playedSongs) {
      if (song.name === playedSong.name && playedSong.category === categoryId) {
        result += 'alert alert-primary';
        return result;
      }
    }
    if (daysBetween < 14) {
      result += 'alert alert-success';
    } else if (daysBetween < 28) {
      result += 'alert alert-warning';
    } else {
      result += 'alert alert-danger';
    }
    return result;
  }

  // tslint:disable-next-line: typedef
  changeStatus(songId: number, categoryId: number) {
    const data: any = {};
    let unPlayed = false;
    for (const category of this.songsList) {
      if (category.id === categoryId) {
        for (const song of category.songs) {
          if (song.id === songId) {
            for (let i = 0; i < this.playedSongs.length; i++) {
              if (this.playedSongs[i].name === song.name) {
                song.date = this.playedSongs[i].date;
                data.id = song.id;
                data.date = song.date;
                unPlayed = true;
                this.playedSongs.splice(i, 1);
              }
            }
            if (!unPlayed) {
              this.playedSongs.push({id: song.id, name: song.name, date: song.date, category: categoryId});
              song.date = moment().format('YYYY-MM-DD');
              data.id = song.id;
              data.date = song.date;
            }
          }
        }
      }
    }
    this.fileService.changeStatus(data).subscribe((resp) => {
      console.log('Song status changed');
    }, (err) => {
      console.log(err.error.error);
    });
  }

  // tslint:disable-next-line: typedef
  launchSongModal(song: any, action: string) {
    const allCategories = [];
    for (const category of this.songsList) {
      allCategories.push({id: category.id, name: category.name});
    }
    const dialogRef = this.dialog.open(ModifySongModalComponent, {
      data: {
        label: action,
        name: song.name,
        talam: song.talam,
        ragam: song.ragam,
        composer: song.composer,
        metronome: song.metronome,
        categories: allCategories
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.action === 'add') {
          // tslint:disable-next-line: radix
          result.values.category = parseInt(result.values.category);
          for (const category of this.songsList) {
            if (category.id === result.values.category) {
              // tslint:disable-next-line: max-line-length
              const newSong = {id: 0, name: result.values.name, date: moment().format('YYYY-MM-DD'), ragam: result.values.ragam, talam: result.values.talam, composer: result.values.composer, metronome: result.values.metronome, category: category.id};
              this.fileService.editSong({action: 'add', song: newSong, user: this.user}).subscribe((resp) => {
                newSong.id = resp.id;
                category.songs.push(newSong);
                console.log('Song added');
              }, (err) => {
                console.log(err.error.error);
              });
            }
          }
        } else {
          for (const category of this.songsList) {
            for (let i = 0; i < category.songs.length; i++) {
              if (category.songs[i].name === song.name) {
                if (result.action === 'save') {
                  // tslint:disable-next-line: forin
                  for (const key in result.values) {
                    if (key !== 'categories') {
                      category.songs[i][key] = result.values[key];
                    }
                  }
                  // tslint:disable-next-line: max-line-length
                  this.fileService.editSong({action: 'save', song: category.songs[i], user: this.user}).subscribe((resp) => {
                    console.log('Song saved');
                  }, (err) => {
                    console.log(err.error.error);
                  });
                } else {
                  this.fileService.deleteSong({id: category.songs[i].id}).subscribe((resp) => {
                    console.log('Song deleted');
                    category.songs.splice(i, 1);
                  }, (err) => {
                    console.log(err.error.error);
                  });
                }
              }
            }
          }
        }
      }
    });
  }

  // tslint:disable-next-line: typedef
  launchCategoryModal(categoryId: number, action: string) {
    let categoryName = '';
    for (const category of this.songsList) {
      if (category.id === categoryId) {
        categoryName = category.name;
      }
    }
    const dialogRef = this.dialog.open(ModifyCategoriesModalComponent, {
      data: {
        name: categoryName,
        label: action
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.action === 'add') {
          const newCategory = {name: result.values.name, id: 0, songs: []};
          this.fileService.editCategory({action: 'add', category: newCategory, user: this.user}).subscribe((resp) => {
            newCategory.id = resp.id;
            this.songsList.push(newCategory);
          });
        } else {
          for (let i = 0; i < this.songsList.length; i++) {
            if (this.songsList[i].id === categoryId) {
              if (result.action === 'save') {
                // tslint:disable-next-line: max-line-length
                this.fileService.editCategory({action: 'save', category: {id: this.songsList[i].id, name: result.values.name}, user: this.user}).subscribe((resp) => {
                  console.log('Category saved');
                  this.songsList[i].name = result.values.name;
                }, (err) => {
                  console.log(err.error.error);
                });
              } else {
                this.fileService.deleteCategory({id: this.songsList[i].id}).subscribe((resp) => {
                  console.log('Category deleted');
                  this.songsList.splice(i, 1);
                }, (err) => {
                  console.log(err.error.error);
                });
              }
            }
          }
        }
      }
    });
  }

  // tslint:disable-next-line: typedef
  launchLoadSongsModal() {
    const feedModal = this.ngbModal.open(LoadSongsComponent);
  }
}
