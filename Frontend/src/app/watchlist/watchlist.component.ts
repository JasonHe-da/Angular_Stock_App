import { Component, OnInit } from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core';
import { ResultComponent } from '../result/result.component';
import { StockBasicInfo } from '../stock-basic-info';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SearchbarService } from '../searchbar.service';
import { SearchService } from '../search.service';
import { Quote } from '../quote';
@Component({
  selector: 'app-watchlist',
  providers:[HeaderComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  constructor(
    private router:Router,
    private searchbar : SearchbarService,
    private header : HeaderComponent,
    private _searchService : SearchService
    ) {}
  @ViewChild(HeaderComponent) child:any;
  tempTest : any;
  watch_list_items : string = "";
  arrayOfKeys : any;
  Stock_info : StockBasicInfo[];
  new_stock : [] = [];
  stock_basic : StockBasicInfo[]=[];
  going_up : boolean;
  have_watch_item : boolean;
  watch_keys:  string[];


  quote : Quote;
  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
  save_quote(data:Quote, id:any){
    this.quote = data;
    var watch_info = JSON.parse(localStorage["watch_list1"]);
    if(id in watch_info){
      watch_info[id]["c"] = this.roundTo(this.quote.c,2);
      watch_info[id]["dp"] = this.roundTo(this.quote.dp,2);
      watch_info[id]["d"] = this.roundTo(this.quote.d,2);
    }
    //console.log(watch_info);
    localStorage.setItem("watch_list1", JSON.stringify(watch_info));
  }
  getQuote(id:any){
      this._searchService.search_quote(id).subscribe(
        data => this.save_quote(data,id)
      )
  };


  initiate_Watchlist(arrayList: any){
    this.Stock_info = Object.values(arrayList);
    // for(var i = 0; i < this.Stock_info.length; i ++){
    //   this.new_stock.push(this.Stock_info[i]);
    // }
    // this.new_stock = JSON.stringify(this.Stock_info);
    //console.log(this.Stock_info[0]);
  }

  ngOnInit(): void {
    this.arrayOfKeys = JSON.parse(localStorage["watch_list1"]);
    this.watch_keys = Object.keys(this.arrayOfKeys);
    if(this.watch_keys.length <= 0){
      this.have_watch_item = true;
    }else{
      this.have_watch_item = false;
    }
    console.log(this.arrayOfKeys);
    for(var i = 0; i < this.watch_keys.length ; i ++){
      this.getQuote(this.watch_keys[i]);
    }
    this.arrayOfKeys = JSON.parse(localStorage["watch_list1"]);
    this.initiate_Watchlist(this.arrayOfKeys);
  }


  clickWatchList(name:string){
    if(this.searchbar.getActive()==0){
      this.searchbar.updateActive(1);
    }
    var temp = this.header.temp();
    this.router.navigateByUrl('/search/' +name);
  }
  deleteWatchItem(ticker:string){
    for(var i = 0; i < this.Stock_info.length;i++){
      if(ticker === this.Stock_info[i]["ticker"]){
        delete this.Stock_info[i];
      }
    }
    let temp1 = JSON.parse(localStorage.getItem("watch_list1"));
      if (ticker in temp1){
        delete temp1[ticker];
      }
    localStorage.setItem("watch_list1", JSON.stringify(temp1));
    
    this.ngOnInit();
    //this.router.navigateByUrl('/watchlist');
  }
}
