import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {path: "search", component: SearchComponent},
  {path: 'search/:id', component: MovieInfoComponent},
  {path: "favorites", component: FavoritesComponent},
  {path: 'about', component: AboutComponent},
  {path:"**", redirectTo:'/search'},
  // {path: '', redirectTo:'/search', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
