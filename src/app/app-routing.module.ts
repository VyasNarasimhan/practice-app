import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongsComponent } from './songs/songs.component';
import { HomeComponent } from './home/home.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';

const routes: Routes = [{
  path: 'songs',
  component: SongsComponent
}, {
  path: 'home',
  component: HomeComponent
}, {
  path: 'mine',
  component: MinesweeperComponent
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'home'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
