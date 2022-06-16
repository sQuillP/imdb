import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTitle'
})
export class FormatTitlePipe implements PipeTransform {

  transform(title:string): string {
    if(title.length < 28)
      return title;
    return title.substring(0,25) + "...";
  }

}
