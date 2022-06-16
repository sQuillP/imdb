import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkEmpty'
})
export class CheckEmptyPipe implements PipeTransform {

  transform(content:string):string {
    if(!content)
      return "N/A";
    return content;
  }

}
