import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, Subject, throwError } from "rxjs";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from "./auth.service";
import { APIKEY } from "./environment";

@Injectable({providedIn: 'root'})
export class MovieService {


    constructor(
        private http:HttpClient,
        private afd:AngularFireDatabase,
        private auth:AuthService
        ) {

    }


    // For users to search the movie
    searchMovie(title:string):Observable<any> {
        return this.http.get<any>("https://imdb-api.com/en/API/SearchMovie/"+APIKEY+"/"+title)
        .pipe(
            catchError(
                (error)=> {
                    return throwError(()=> new Error(error))
                }
            )
        )
    }

    //general, more broad search for movie related titles
    searchTitle(title:string):Observable<any> {
        return this.http.get<any>('https://imdb-api.com/en/API/SearchTitle/', {
            params: {
                apiKey: APIKEY,
                expression: title
            }
        })
        .pipe(
            catchError(
                (err)=> {
                    return throwError(()=> new Error(err));
                }
            )
        )
    }

    // When the movie ID is known. Use this for displaying information
    getMovieById(titleId:string):Observable<any> {
        return this.http.get<any>("https://imdb-api.com/en/API/Title",{
            params: {
                apiKey: APIKEY,
                id: titleId
            }
        })
        .pipe(
            catchError(
                (error) => {
                    console.log('an error has occurred')
                    return throwError(()=> new Error(error));
                }
            )
        );
    }

    fetchMovies():Promise<any> {
        console.log(this.auth.userData)
        let userId:string = this.auth.userData.multiFactor.user.uid
        let favoriteMovies:[] = null;
         return this.afd.database.ref('/users/'+userId).get().then(snapshot => {
            if(snapshot.exists()){
                favoriteMovies = snapshot.val();
                console.log(favoriteMovies)
                return favoriteMovies;
            }
            else{
                console.log('no data available')
                return null;
            }
        });
    }

    addFavoriteMovie(movie:Object):void{
        let userId:string = this.auth.userData.multiFactor.user.uid;
        let moviesRef = this.afd.database.ref('/users/'+userId);
        let newMovie = moviesRef.push();
        newMovie.set(movie, error => {
            if(error)
                console.log('unable to save favorite movie', error);
            else
                console.log('should successfully save to db');
        });
    }

    deleteFavoriteMovie(movieId:string):void {
        let userId = this.auth.userData.multiFactor.user.uid;
        let moviesRef = this.afd.database.ref('/users/'+userId+'/'+movieId);
        moviesRef.remove().then(complete => {
            console.log('movie object deleted',movieId, complete);
        }, error => {
            console.error('Unable to fulfill deletion request at', movieId);
            console.log(error);
        });
    }

}