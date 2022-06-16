import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {  MessageService } from '../message.service';
import { MovieService } from '../movie-service';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit {

  resolvedInfo:boolean = false;
  failedRequest:boolean = false;
  movieData;

  constructor(
    private router:Router, 
    private movieService:MovieService,
    private messageService:MessageService,
    private route:ActivatedRoute
    ) { }

  closeComponent():void{
    this.router.navigate(["search"]);
  }

  ngOnInit(): void {

    this.route.params.subscribe((params:Params)=> {
      //get the data
      this.movieService.getMovieById(params.id).subscribe(data => {
        if(data.errorMessage){
          console.log('notifying error')
          this.messageService.notifyError("Bad request. Please use the searchbar to find movies.");
          this.router.navigate(["search"]);
          return;
        }
        this.movieData = data;
        this.resolvedInfo = true;
      }, error => {
        console.error("Unable to handle API request",error);
        this.failedRequest = true;
      });

    });
  }

}
