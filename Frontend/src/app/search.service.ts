import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from './profile';
import { Quote } from './quote';
import {map, skipWhile, tap} from 'rxjs/operators'
import { Observable } from 'rxjs';
import { AllSearchInfo } from './all-search-info';
import { Candle } from './candle';
import { Recommend } from './recommend';
import {News} from './news';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private _http: HttpClient) { }
  host_name: string = "http://localhost:8080";
  // host_name: string = "https://nihe-hw8-new.wl.r.appspot.com";
  autocomplete_host_name: string = "/search/autocomplete/";
  profile_host_name = this.host_name + "/search/profile/";
  quote_host_name = this.host_name + "/search/quote/";
  candle_host_name = this.host_name + "/search/candle/";
  history_host_name = this.host_name + "/search/history/";
  recommend_host_name = this.host_name + "/search/recommendation/";
  social_host_name = this.host_name + "/search/social/";
  earnings_host_name = this.host_name + "/search/earnings/";
  news_host_name = this.host_name + "/search/news/";
  peers_host_name = this.host_name + "/search/peers/";
  id_num: string = "home";
  all_search_info : AllSearchInfo;
  tempProfile : Profile;
  search_profile(id: any){
    this.id_num = id;
    return this._http.get<Profile>(this.profile_host_name + id,<Object>id);
  }

  search_peers(id: any){
    return this._http.get<string[]>(this.peers_host_name + id,<Object>id);
  }

  search_quote(id: any){
    return this._http.get<Quote>(this.quote_host_name + id,<Object>id);
  }
  search_candle(id: any,timestamp:any){

    return this._http.get<Candle>(this.candle_host_name + id + "/"+timestamp,<Object>id);
    // return this._http.get("http://localhost:8080" + id,<Object>id);
  }
  search_history(id:any){
    let now_time = new Date().getTime();
    return this._http.get<Candle>(this.history_host_name + id + "/"+now_time,<Object>id);
  }
  search_recommend(id:any){
    return this._http.get<[]>(this.recommend_host_name + id ,<Object>id);
  }
  search_social(id:any){
    return this._http.get<any>(this.social_host_name + id ,<Object>id);
  }

  search_earning(id:any){
    return this._http.get<any>(this.earnings_host_name + id ,<Object>id);
  }
  search_news(id:any){
    return this._http.get<[]>(this.news_host_name + id ,<Object>id);
  }
  getAutoComplete(id:any){
    return this._http.get(this.autocomplete_host_name + id)
      .pipe( 
      );
  }

}
