import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MovieService } from '../movie-service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  isLoggedIn:boolean = false;
  noData:boolean = true;
  loggedInSubscription:Subscription;
  // movieList:Array<any> = [];
  movieList$ = new BehaviorSubject<any>(null);

  constructor(
    private auth:AuthService,
    private movieService:MovieService,
    private router:Router
  ) { 

    this.isLoggedIn = !!this.auth.userData;
    // this.isLoggedIn = this.auth.isLoggedIn.value
    this.loggedInSubscription = this.auth.isLoggedIn.subscribe(isLoggedIn=> {
      this.isLoggedIn = isLoggedIn;
      if(isLoggedIn)
        this.loadFavoriteMovies();
    })
  }

  ngOnInit(): void {
    if(!this.isLoggedIn) return;
    this.loadFavoriteMovies();

  }

  loadFavoriteMovies():void{
    console.log('fetching movies')
    this.movieService.fetchMovies().then((movies:any) => {
      if(movies === null) {
        this.noData = true;
        return;
      };
      this.noData = false;
      const movieArr = [];
      for(let key of Object.keys(movies)){
        movieArr.push({movieId: key, ...movies[key]});
        console.log(key)
      }
      this.movieList$.next(movieArr);
    });
  }

  onSelectFavoriteMovie(id:string):void{
    this.router.navigate(['search',id]);
  }

  onDeleteFavoriteMovie(movieId:string, index:number) {
    this.movieService.deleteFavoriteMovie(movieId);
    // this.movieList.splice(index,1);
    const temp = [...this.movieList$.value];
    temp.splice(index,1);
    this.movieList$.next(temp);
    if(temp.length === 0)
      this.noData = true;
  }

}
