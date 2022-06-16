import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MovieService } from '../movie-service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  isLoggedIn:boolean = false;
  loggedInSubscription:Subscription;
  movieList:Array<any> = [];
  constructor(
    private auth:AuthService,
    private movieService:MovieService,
    private router:Router
  ) { 

    this.isLoggedIn = !!this.auth.userData
    this.loggedInSubscription = this.auth.isLoggedIn.subscribe(isLoggedIn=> {
      this.isLoggedIn = isLoggedIn;
      this.loadFavoriteMovies();
    })
  }

  ngOnInit(): void {
    if(!this.isLoggedIn) return;
    this.loadFavoriteMovies();

  }

  loadFavoriteMovies():void{
    this.movieService.fetchMovies().then((movies:any) => {
      if(movies === null) return;
      for(let key of Object.keys(movies)){
        this.movieList.push({movieId: key, ...movies[key]});
        console.log(key)
      }
    });
  }

  onSelectFavoriteMovie(id:string):void{
    this.router.navigate(['search',id]);
  }

  onDeleteFavoriteMovie(movieId:string, index:number) {
    this.movieService.deleteFavoriteMovie(movieId);
    this.movieList.splice(index,1);
  }

}
