import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime, filter, fromEvent, mergeMap, Subscription, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { MovieService } from '../movie-service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('inputref') inputRef:ElementRef;

  searchTerm:string = "";
  movieData:[] = [];
  movieData$ = new BehaviorSubject<any>(null);
  isFetchingData:boolean = false;

  // errorMessage:string = "";
  // errorSubscription:Subscription;


  keypressTimeout;

  keypressListener: ()=> void;


  constructor(
    private movieService:MovieService,
    private messageService:MessageService,
    private auth:AuthService,
    private router:Router,
    private route:ActivatedRoute
    ) {}


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

      fromEvent(this.inputRef.nativeElement,'keypress').pipe(
        filter((event:any)=> event.key.toLowerCase() !=='backspace'),
        tap(()=>{ this.isFetchingData = true;}),
        debounceTime(1000),
        mergeMap(e => this.movieService.searchTitle(this.searchTerm))
      )
      .subscribe({
        next:(response)=> {
          this.movieData$.next(response.results);
          this.isFetchingData =false;
        },
        error:(error)=> {
          this.isFetchingData = false;
          this.messageService.notifyError("Error fetching data from database");
        }
      })

  }

  onAddFavoriteMovie(movie:Object):void{
    console.log(this.auth.isLoggedIn.value)
    if(!this.auth.isLoggedIn.value){
      this.messageService.notifyError("You must be logged in to add your favorite movies!");
      return;
    }
    this.movieService.addFavoriteMovie(movie);
  }

  navigateMovieInfo(id:string):void{
    this.router.navigate([id], {relativeTo:this.route});
  }

  ngOnDestroy(): void {
  }



  


}
