import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { SearchbarService } from '../searchbar.service';
import { ResultStateService } from '../result-state.service';
import * as e from 'express';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private service : SearchService,
    private router:Router,
    private stateService : ResultStateService,
    private searchBar : SearchbarService
  ) { }
  collapsed = true;
  params: string = "home";
  ngOnInit(): void {
    // setInterval(() => {
    //   this.params = this.service.id_num;
    // }, 5000);
    if(this.stateService.getStateExist()){
      this.params = this.stateService.getId();
    }
    this.params = this.service.id_num;
    if(this.params == ""){
      this.params = "home";
    }
  }
  temp(){
    var temp_button = document.getElementById('search_button') as HTMLElement;
    temp_button.classList.add("phase-active");
    var temp2_button = document.getElementById('watch_button') as HTMLElement;
    temp2_button.classList.remove("phase-active");
    var temp_button3 = document.getElementById('port_button') as HTMLElement;
    temp_button3.classList.remove("phase-active");
    // this.activeButton = 1;
  }
  removeActive(){
    this.params = "home";
    var temp_button = document.getElementById('search_button') as HTMLElement;
    temp_button.classList.remove("phase-active");
    var temp2_button = document.getElementById('watch_button') as HTMLElement;
    temp2_button.classList.remove("phase-active");
    var temp_button3 = document.getElementById('port_button') as HTMLElement;
    temp_button3.classList.remove("phase-active");
  }
  showSearch(){
    this.params = "home";
    var temp_button = document.getElementById('search_button') as HTMLElement;
    temp_button.classList.add("phase-active");
    var temp2_button = document.getElementById('watch_button') as HTMLElement;
    temp2_button.classList.remove("phase-active");
    var temp_button3 = document.getElementById('port_button') as HTMLElement;
    temp_button3.classList.remove("phase-active");
  }

  showWatch(){
    this.params = this.stateService.getId();
    var temp_button = document.getElementById('search_button') as HTMLElement;
    temp_button.classList.remove("phase-active");
    var temp2_button = document.getElementById('watch_button') as HTMLElement;
    temp2_button.classList.add("phase-active");
    var temp_button3 = document.getElementById('port_button') as HTMLElement;
    temp_button3.classList.remove("phase-active");
  }
  showPort(){
    this.params = this.stateService.getId();
    var temp_button = document.getElementById('search_button') as HTMLElement;
    temp_button.classList.remove("phase-active");
    var temp2_button = document.getElementById('watch_button') as HTMLElement;
    temp2_button.classList.remove("phase-active");
    var temp_button3 = document.getElementById('port_button') as HTMLElement;
    temp_button3.classList.add("phase-active");
  }
  activeButton:number = 0;
  showPhase(event:number){
    if(this.activeButton == 1){
      var temp_button = document.getElementById('search_button') as HTMLElement;
      temp_button.classList.add("phase-active");
      var temp_button3 = document.getElementById('port_button') as HTMLElement;
      temp_button.classList.remove("phase-active");
      var temp2_button = document.getElementById('watch_button') as HTMLElement;
      temp2_button.classList.remove("phase-active");
    }else if(this.activeButton == 2){
      var temp_button = document.getElementById('search_button') as HTMLElement;
      temp_button.classList.remove("phase-active");
      var temp_button3 = document.getElementById('port_button') as HTMLElement;
      temp_button.classList.add("phase-active");
      var temp2_button = document.getElementById('watch_button') as HTMLElement;
      temp2_button.classList.remove("phase-active");
    }else{
      var temp_button = document.getElementById('search_button') as HTMLElement;
      temp_button.classList.remove("phase-active");
      var temp_button3 = document.getElementById('port_button') as HTMLElement;
      temp_button.classList.remove("phase-active");
      var temp2_button = document.getElementById('watch_button') as HTMLElement;
      temp2_button.classList.add("phase-active");
    }
    this.activeButton = event;
    console.log(this.activeButton);
    // [.phase-active]="activeButton == 1"
    if(this.activeButton == 2 || this.activeButton == 3){
      if(this.stateService.getStateExist()){
        this.params = this.stateService.getId();
      }else{
        this.params = "home";
      }
    }
    console.log(this.stateService.getStateExist());
  }
  // expand(){
  //   this.expand = true;
  // }
}
