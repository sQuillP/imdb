import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  isFetchingData:boolean = false;

  // errorMessage:string = "";
  // errorSubscription:Subscription;


  keypressTimeout;

  keypressListener: ()=> void;


  constructor(
    private movieService:MovieService,
    private messageService:MessageService,
    private auth:AuthService,
    private renderer: Renderer2,
    private router:Router,
    private route:ActivatedRoute
    ) {}


  ngOnInit(): void {
    // this.errorMessage = this.errorService.error;
    // this.errorSubscription = this.errorService.errorSubject.subscribe(error => {
    //   this.errorMessage = error;
    // })
  }

  ngAfterViewInit(): void {

      console.log('after view init')
      this.keypressListener = this.renderer.listen(this.inputRef.nativeElement,'keydown',(event)=> {
        
        if(this.keypressTimeout)
          clearTimeout(this.keypressTimeout);
        
        if(event.key === 'Backspace'){
          this.isFetchingData = false;
          return;
        }
        this.isFetchingData = true;

        this.keypressTimeout = setTimeout(()=> {
          this.movieService.searchTitle(this.searchTerm).subscribe((data)=> {
            console.log(data);
            this.movieData = data.results;
            this.isFetchingData =false;
          });
        },500);
      });

  }

  onAddFavoriteMovie(movie:Object):void{
    if(!this.auth.isLoggedIn){
      this.messageService.notifyError("You must be logged in to add your favorite movies!");
      return;
    }
    this.movieService.addFavoriteMovie(movie);
    
  }

  // onDismissError():void{
  //   this.errorMessage = "";
  //   this.errorService.clearError();
  // }

  navigateMovieInfo(id:string):void{
    // this.onDismissError();
    this.router.navigate([id], {relativeTo:this.route});
  }

  ngOnDestroy(): void {
      this.keypressListener();
  }



  


}
