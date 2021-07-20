import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongsComponent } from './songs/songs.component';

const routes: Routes = [{
  path: 'songs',
  component: SongsComponent
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'songs'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
