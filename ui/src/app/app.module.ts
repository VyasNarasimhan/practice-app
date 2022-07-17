import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SongsComponent } from './songs/songs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ModifySongModalComponent } from './modify-song-modal/modify-song-modal.component';
import { ModifyCategoriesModalComponent } from './modify-categories-modal/modify-categories-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './home/home.component';
import { LoadSongsComponent } from './load-songs/load-songs.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';



@NgModule({
  declarations: [
    AppComponent,
    SongsComponent,
    ModifySongModalComponent,
    ModifyCategoriesModalComponent,
    HomeComponent,
    LoadSongsComponent,
    MinesweeperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgbModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
