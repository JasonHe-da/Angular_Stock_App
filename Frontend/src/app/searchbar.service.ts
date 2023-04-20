import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchbarService {

  constructor() { }

  active:number = 0;
  searchName:string = "";
  getActive(){
    return this.active;
  }
  getSearchName(){
    return this.searchName;
  }
  saveSearchName(searchRes : string){
    this.searchName = searchRes;
  }
  updateActive(active_signal : number){
    this.active = active_signal;
  }
}
