import { Injectable } from '@angular/core';
import { Candle } from './candle';
import { Profile } from './profile';
import { Quote } from './quote';
@Injectable({
  providedIn: 'root'
})
export class ResultStateService {
  StateExist:boolean = false;
  state_quote$ : Quote;
  state_profile$ : Profile;
  state_history$ : any;
  state_recommendation$ : any;
  state_candle$:Candle;
  state_social$: any;
  state_earning$: any;
  state_news$ : any;
  state_peers$ : any;
  id : string = "";
  constructor() { }
  updateStateExist( Exist:boolean){
    this.StateExist = Exist;
  }
  getStateExist(){
    return this.StateExist;
  }
  saveId(ticker: string){
    this.id = ticker;
  }
  getId(){
    return this.id;
  }
  updateState_quote(newQuote:Quote){
    this.state_quote$ = newQuote;
    console.log(this.state_quote$);
  }
  getValue_quote(){
    return this.state_quote$;
  }
  updateState_profile(newProfile:Profile){
    this.state_profile$ = newProfile;
  }
  getValue_profile(){
    return this.state_profile$;
  }

  updateState_history(newHistory:any){
    this.state_history$ = newHistory;
  }

  getValue_history(){
    return this.state_history$;
  }

  updateState_recommendation(newRecommendation:any){
    this.state_recommendation$ = newRecommendation;
  }
  getValue_recommendation(){
    return this.state_recommendation$;
  }

  updateState_candle(newCandle:any){
    this.state_candle$ = newCandle;
  }
  getValue_candle(){
    return this.state_candle$;
  }

  updateState_news(newNews:any){
    this.state_news$ = newNews;
  }
  getValue_news(){
    return this.state_news$;
  }
  updateState_earning(newEarning:any){
    this.state_earning$ = newEarning;
  }
  getValue_earning(){
    return this.state_earning$;
  }


  updateState_social(newSocial:any){
    this.state_social$ = newSocial;
  }
  getValue_social(){
    return this.state_social$;
  }
  updateState_peers(newPeers:any){
    this.state_peers$ = newPeers;
  }
  getValue_peers(){
    return this.state_peers$;
  }
  // getValue(){
  //   return this.state$;
  // }

  clear_state(){
    this.id = "home";
    this.StateExist = false;
  }
}
