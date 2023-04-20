import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';
import { Profile } from '../profile'
import { Quote } from '../quote';
import { flush } from '@angular/core/testing';
import { StockBasicInfo } from '../stock-basic-info';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Portfolio } from '../portfolio';
//import * as Highcharts from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
import * as Highcharts1 from 'highcharts';
import {ChartCallbackFunction} from 'highcharts';
import { Options } from 'highcharts/highstock';
import { Candle } from '../candle';
import { Recommend } from '../recommend';
import { ResultStateService } from '../result-state.service';
import { timer } from 'rxjs';
import {News} from '../news';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {ViewChild} from '@angular/core';
import { SearchbarService } from '../searchbar.service';
//import { SearchBarComponent } from '../search-bar/search-bar.component'
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp
import stock from 'highcharts/modules/stock.src';
import * as e from 'express';
import { bottom } from '@popperjs/core';
@Component({
  selector: 'app-result',
  //providers:[SearchBarComponent],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private _searchService: SearchService,
    private stateService: ResultStateService,
    private modalService: NgbModal,
    private searchBar : SearchbarService,
    //private searchRes : SearchBarComponent
  ) {}
  //@ViewChild(SearchBarComponent) child:any;
  NotEnoughMoney : string = "Not enough money in wallet!";
  NotEnoughStock : string = "You cannot sell the stocks that you don't have!";
  going_up : boolean;
  equal_0 : boolean;
  successMessage_watchlist :boolean = false;
  successMessage_watchMessage : string = "";
  successMessage_unadd_watchlist : boolean = false;
  successMessage_unadd_watchMessage :string = "";
  successMessage: boolean = false;
  successMessage_buy : string;
  successMessage_sell_bool: boolean = false;
  successMessage_sell : string;
  state_quote:Quote;
  state_profile:Profile;
  state_history: any;
  state_recommendation: any;
  state_candle: Candle;
  state_social : any;
  quote_dp_2: number;
  quote_d_2 : number;
  tickerNotFound: boolean;
  ticker_not_found:boolean;
  state_earning : any;
  state_news : any;
  state_peers : any;
  public id: any = '';
  test1 : string = "";
  //test2 : Profile = new Profile("","","","","","",0,"","",0,"","");
  element: string = "";
  element1: string = "";
  element2: string = "";
  Last_price: number = 0;
  change: number = 0;
  element4: string = "";
  exchange: string = "";
  Basic_Info: string = "";
  current_time: string ="";
  current_time2: string ="";
  profile : Profile = new Profile("","","","","","",0,"","",0,"","");
  quote: Quote = new Quote(0,0,0,0,0,0,0,0);
  candle: Candle = new Candle([],[],[],[],"",[],[]);
  history: Candle = new Candle([],[],[],[],"",[],[]);
  recommendation: [];
  Open: boolean;
  exist :any;
  exist_value : boolean = true;
  // chartCallback:any;
  hold_or_not:boolean;
  social:any;
  earning: any;
  news: any;
  Market_status: string;
  close_time: Date;
  stockinfo: StockBasicInfo = new StockBasicInfo("","",0,0,0, false);
  portfolio:Portfolio = new Portfolio("","",0,0,0,0,0,0);
  unfillSvg :boolean;
  fillSvg :boolean;
  svg1: string ;
  svg2: string ;
  amount_share: number;
  amount_share_sell:number;
  buy_amount:number;
  sell_amount:number;
  reddit:{"TotalMentions": number, "PositiveMentions":number, "NegativeMentions":number} = {"TotalMentions":0,"PositiveMentions":0,"NegativeMentions":0};
  twitter:{"TotalMentions": number, "PositiveMentions":number, "NegativeMentions":number} = {"TotalMentions":0,"PositiveMentions":0,"NegativeMentions":0};
  money_amount_left: number;
  estimate_amount: number = 0;
  estimate_amount_sell:number = 0;
  error_buy:boolean = false;
  error_sell:boolean = false;
  news_date : string = "";
  WorkdayChartOptions: Options;
  HistoryChartOptions: Options;
  RecommChartOptions: Options;
  EPSSurprises:Options;
  SurpriseChartOptions: Options;
  close_modal:boolean = true;
  loading: boolean = true;
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false;
  news_list: []=[];
  news_details: News;
  timer15:any;
  timerS15:any;
  timerTemp:any;
  peers_company : string[] = [];
  tempBoolean : boolean = false;
  source = timer(15000);

  loading_profile: boolean;
  loading_quote: boolean;
  loading_history: boolean;
  loading_recommend: boolean;
  loading_peers: boolean;
  loading_news:boolean;
  loading_social_trend: boolean;
  loading_earning : boolean;
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert | undefined;
  // buy functionality

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  transaction(){
    let money_left = JSON.parse(localStorage.getItem("money"));
    let current_stock_list = JSON.parse(localStorage.getItem("portfolio"));
    if(this.buy_amount <= 0 ){
      this.error_buy = true;
      return;
    }
    if(this.estimate_amount > money_left){
      this.error_buy = true;
      return;
    }
    if(this.profile.ticker in current_stock_list){
      let current_portfolio = current_stock_list[this.profile.ticker];
      current_portfolio.quantity = current_portfolio.quantity+this.buy_amount;
      current_portfolio.total_cost = this.roundTo(current_portfolio.total_cost + (this.quote.c * this.buy_amount),2);
      current_portfolio.AverageCostShare = this.roundTo(current_portfolio.total_cost / current_portfolio.quantity,2);
      current_portfolio.CurrentPrice = this.quote.c;
      current_portfolio.Change = this.roundTo(current_portfolio.AverageCostShare - this.quote.c,2);
      current_portfolio.MarketValue = this.roundTo(this.quote.c * current_portfolio.quantity,2);
      current_stock_list[this.profile.ticker] = current_portfolio;
      localStorage.setItem("portfolio", JSON.stringify(current_stock_list));
    }else{
      this.portfolio.name = this.profile.name;
      this.portfolio.ticker = this.profile.ticker;
      this.portfolio.quantity = this.buy_amount;
      this.portfolio.total_cost = this.roundTo((this.quote.c * this.buy_amount),2);
      this.portfolio.AverageCostShare = this.roundTo(this.portfolio.total_cost / this.portfolio.quantity,2);
      this.portfolio.CurrentPrice = this.quote.c;
      this.portfolio.Change = this.roundTo(this.portfolio.AverageCostShare - this.quote.c,2);
      this.portfolio.MarketValue = this.roundTo(this.quote.c * this.portfolio.quantity,2);
      current_stock_list[this.profile.ticker] = this.portfolio;
      localStorage.setItem("portfolio", JSON.stringify(current_stock_list));
    }
    let money_afterbuy = this.roundTo(money_left - this.estimate_amount,2);
    localStorage.setItem("money", JSON.stringify(money_afterbuy));
    this.hold_or_not = true;
    this.successMessage = true;
    this.successMessage_buy = this.profile.ticker + " bought successfully";
    setTimeout(() => this.selfClosingAlert.close(), 5000);
    this.estimate_amount = 0;
  }
  buy_stock(amount:any){
    this.estimate_amount = 0;
    this.buy_amount = 0;
    this.amount_share = 0;
    let money_left = JSON.parse(localStorage.getItem("money"));
    this.money_amount_left = money_left;
    this.modalService.open(amount, {ariaLabelledBy: 'modal-basic-title1'}).result.then((result) => {
      this.buy_amount = this.amount_share;
    });
    //this.estimate_amount = this.buy_amount * this.quote.c;
    localStorage.setItem("money", JSON.stringify(money_left));
  }
  update_price(){
    this.buy_amount = this.amount_share;
    this.estimate_amount = this.roundTo(this.buy_amount * this.quote.c,2);
    let money_left = JSON.parse(localStorage.getItem("money"));
    if(this.estimate_amount > money_left){
      this.error_buy = true;
    }else{
      this.error_buy = false;
    }
  }

// sell functionality
  transaction_sell(){
    let current_stock_list = JSON.parse(localStorage.getItem("portfolio"));
    let money_left = JSON.parse(localStorage.getItem("money"));
    if(this.sell_amount <= 0 ){
      this.error_sell = true;
      return;
    }
    let left_quantity = current_stock_list[this.profile.ticker].quantity;
    if(left_quantity < this.sell_amount){
      this.error_sell = true;
      return;
    }
    if(this.profile.ticker in current_stock_list){
      let current_portfolio = current_stock_list[this.profile.ticker];
      current_portfolio.quantity = current_portfolio.quantity-this.sell_amount;
      current_portfolio.total_cost = this.roundTo(current_portfolio.total_cost - (this.quote.c * this.sell_amount),2);
      current_portfolio.AverageCostShare = this.roundTo(current_portfolio.total_cost / current_portfolio.quantity,2);
      current_portfolio.CurrentPrice = this.roundTo(this.quote.c,2);
      current_portfolio.Change = current_portfolio.AverageCostShare - this.quote.c;
      current_portfolio.MarketValue = this.roundTo(this.quote.c * current_portfolio.quantity,2);
      current_stock_list[this.profile.ticker] = current_portfolio;
      if(current_portfolio.quantity == 0){
        delete current_stock_list[this.profile.ticker]
        this.hold_or_not = false;
      }else{
        this.hold_or_not = true;
      }
      localStorage.setItem("portfolio", JSON.stringify(current_stock_list));
    }
    // else{
    //   this.portfolio.quantity = this.portfolio.quantity+this.buy_amount;
    //   this.portfolio.total_cost = this.portfolio.total_cost + (this.quote.c * this.buy_amount);
    //   this.portfolio.AverageCostShare = this.portfolio.total_cost / this.portfolio.quantity;
    //   this.portfolio.CurrentPrice = this.quote.c;
    //   this.portfolio.Change = this.portfolio.AverageCostShare - this.quote.c;
    //   this.portfolio.MarketValue = this.quote.c * this.portfolio.quantity;
    //   current_stock_list[this.profile.ticker] = this.portfolio;
    //   localStorage.setItem("portfolio", JSON.stringify(current_stock_list));
    // }
    let money_aftersell = this.roundTo(money_left + this.estimate_amount_sell,2);
    localStorage.setItem("money", JSON.stringify(money_aftersell));
    this.successMessage_sell_bool = true;
    this.successMessage_sell = this.profile.ticker + " sold successfully";
    setTimeout(() => this.selfClosingAlert.close(), 5000);
  }
  sell_stock(amount:any){
    this.sell_amount = 0;
    this.amount_share_sell = 0;
    this.estimate_amount_sell = 0;
    let money_left = JSON.parse(localStorage.getItem("money"));
    this.money_amount_left = money_left;
    this.modalService.open(amount, {ariaLabelledBy: 'modal-basic-title2'}).result.then((result) => {
      this.sell_amount = this.amount_share_sell;
    });
    this.estimate_amount_sell = this.roundTo(this.sell_amount * this.quote.c,2);
    localStorage.setItem("money", JSON.stringify(money_left));
  }
  update_price_sell(){
    this.sell_amount = this.amount_share_sell;
    this.estimate_amount_sell = this.roundTo(this.sell_amount * this.quote.c,2);
    let stock_own_temp = JSON.parse(localStorage.getItem("portfolio"));
    let stock_own = stock_own_temp[this.profile.ticker];
    let stock_share_own = stock_own["quantity"];

    // if(this.sell_amount < 0){
    //   this.error_sell_neg = true;
    // }
    if(this.sell_amount > stock_share_own){
      this.error_sell = true;
    }else{
      this.error_sell = false;
    }
  }

  onClick(){
    // put stuff into watchlist 
    if(this.unfillSvg == false && this.fillSvg == true){
      this.fillSvg=false;
      this.unfillSvg = true;
      this.svg2 = "block";
      this.svg1 = "none";
      // let temp = JSON.parse(localStorage.getItem("watch_list"));
      // temp.push(this.profile.ticker);
      // localStorage.setItem("watch_list", JSON.stringify(temp));
      // console.log(localStorage.getItem("watch_list"));
      this.stockinfo.name = this.profile.name;
      this.stockinfo.ticker = this.profile.ticker;
      this.stockinfo.c = this.quote.c;
      this.stockinfo.d = this.quote.d;
      this.stockinfo.dp = this.quote.dp;
      if(this.quote.dp > 0){
        this.stockinfo.going_up = true;
      }else if (this.quote.dp < 0){
        this.stockinfo.going_up = false;
      }
      
      // this.stock_obj.ticker_name = this.profile.ticker;
      // this.stock_obj.stockinfo1 = this.stockinfo;
      let temp1 = JSON.parse(localStorage.getItem("watch_list1"));
      temp1[this.profile.ticker] = this.stockinfo;
      localStorage.setItem("watch_list1", JSON.stringify(temp1));
      // console.log(localStorage.getItem("watch_list1"));
      // this.stock_obj[this.profile.ticker] = JSON.stringify(this.stockinfo);
      // localStorage.setItem("watch_list", JSON.stringify(this.watch_lists));
      // localStorage.setItem(this.profile.ticker, JSON.stringify(this.stockinfo));

      this.successMessage_watchMessage = this.profile.ticker + " added to Watchlist";
      this.successMessage_watchlist = true;
      setTimeout(() => this.selfClosingAlert.close(), 5000);
    // remove stuff into watchlist 
    }else if(this.unfillSvg == true && this.fillSvg == false ){
      this.unfillSvg=false;
      this.fillSvg=true;
      this.svg1 = "block";
      this.svg2 = "none";
      let temp1 = JSON.parse(localStorage.getItem("watch_list1"));
      if (this.profile.ticker in temp1){
        delete temp1[this.profile.ticker];
      }
      localStorage.setItem("watch_list1", JSON.stringify(temp1));
      this.successMessage_unadd_watchMessage = this.profile.ticker + " removed from Watchlist";
      this.successMessage_unadd_watchlist = true;
      setTimeout(() => this.selfClosingAlert.close(), 5000);
    }
  }
  save_data_and_populate_peers(data:string[]){
    this.peers_company = [];
     var peers_company_temp = data;
     for(var i = 0; i < peers_company_temp.length ; i++){
       if(peers_company_temp[i]==""){
         continue;
       }else{
         this.peers_company.push(peers_company_temp[i]);
       }
     }
    // console.log(this.peers_company);
    this.stateService.updateState_peers(this.peers_company);
    this.loading_peers = false;
  }
  save_data_and_populate(data:Profile){
    this.profile = data;
    var key = Object.keys(this.profile);
    if(key.length==0){
      this.exist_value = false;
      this.loading_profile= false;
      this.loading_quote= false;
      this.loading_history= false;
      this.loading_recommend= false;
      this.loading_peers= false;
      this.loading_news= false;
      this.loading_social_trend= false;
      this.loading_earning = false;
      setTimeout(() => this.selfClosingAlert.close(), 5000);
      return;
    }else{
      this.exist_value = true;
    }
    this.stateService.updateState_profile(this.profile);
    this.element2 = `<img id="img1" src=${this.profile["logo"]} class="img-fluid" alt="Responsive image">`;
    this.loading_profile = false;
  }
  save_data_and_populate_quote(data:Quote){
    this.quote = data;
    if(this.quote.c == 0 && this.quote.dp == null){
      this.exist_value = false;
      this.loading_profile= false;
      this.loading_quote= false;
      this.loading_history= false;
      this.loading_recommend= false;
      this.loading_peers= false;
      this.loading_news= false;
      this.loading_social_trend= false;
      this.loading_earning = false;
      setTimeout(() => this.selfClosingAlert.close(), 5000);
      return;
    }else{
      this.exist_value = true;
    }
    if(this.quote.dp>0){
      this.going_up = true;
    }else if(this.quote.dp<0){
      this.going_up = false;
    }
    this.stateService.updateState_quote(this.quote);
    this.getCandle(this.id, this.quote.t);
    this.Last_price = this.quote.c;
    this.change = this.quote.d;
    this.quote.dp = this.roundTo(this.quote.dp,2);
    this.quote.c = this.roundTo(this.quote.c, 2);
    this.quote.d = this.roundTo(this.quote.d, 2);
    let dateTime = new Date();
    const now_c = Date.now();
    if(Math.abs(now_c/1000 - this.quote.t) > 300){
      this.Open = false;
      this.Market_status = "Closed";
      this.close_time = new Date(this.quote.t*1000);
      const day1 = (this.close_time.getDate()<10?'0':'') + this.close_time.getDate();
      const month1 = ((this.close_time.getMonth()+1)<10?'0':'') + (this.close_time.getMonth()+1);
      const year1 = (this.close_time.getFullYear()<10?'0':'') + this.close_time.getFullYear();
      const hour1 = (this.close_time.getHours()<10?'0':'') + this.close_time.getHours();;
      const minute1 = (this.close_time.getMinutes()<10?'0':'') + this.close_time.getMinutes();
      const second1 = (this.close_time.getSeconds()<10?'0':'') + this.close_time.getSeconds();
      this.current_time2 = year1 +"-"+ month1 + "-" +day1 + " "+ hour1 + "-" + minute1+ "-"+ second1;
    }else{
      this.Open = true;
      this.Market_status = "Open";
    }
    const day = (dateTime.getDate()<10?'0':'') + dateTime.getDate();
    const month = ((dateTime.getMonth()+1)<10?'0':'') + (dateTime.getMonth()+1);
    const year = (dateTime.getFullYear()<10?'0':'') + dateTime.getFullYear();
    const hour = (dateTime.getHours()<10?'0':'') + dateTime.getHours();;
    const minute = (dateTime.getMinutes()<10?'0':'') + dateTime.getMinutes();
    const second = (dateTime.getSeconds()<10?'0':'') + dateTime.getSeconds();
    this.current_time = year +"-"+ month + "-" +day + " "+ hour + "-" + minute+ "-"+ second;
    this.loading_quote = false;
  }
   chartRef: Highcharts.Chart;
   chartCallback: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef = chart;
    setTimeout(() => {
      this.chartRef.reflow();
    }, 0)
  };
  chartRef1: Highcharts.Chart;
  chartCallback1: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef1 = chart;
    setTimeout(() => {
      this.chartRef1.reflow();
    }, 0)
  };
  chartRef2: Highcharts.Chart;
  chartCallback2: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef2 = chart;
    setTimeout(() => {
      this.chartRef2.reflow();
    }, 0)
  };
  chartRef3: Highcharts.Chart;
  chartCallback3: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef3 = chart;
    setTimeout(() => {
      this.chartRef3.reflow();
    }, 0)
  };
  onTabClick(event:any){
    this.chartRef.reflow();
    this.chartRef1.reflow();
    this.chartRef2.reflow();
    this.chartRef3.reflow();
  }
  save_data_and_populate_history(data:Candle){
    this.history = data;
    this.stateService.updateState_history(this.history);
    var ohlc = [],
        volume = [],
        dataLength = this.history.c.length,
        i = 0;
        // console.log(dataLength);
    for (i; i < dataLength; i += 1) {
      let tempTime = new Date(this.history.t[i]*1000);
      let correct_time = tempTime.getTime();
      ohlc.push([
          correct_time,
          this.history.o[i],
          this.history.h[i],
          this.history.l[i],
          this.history.c[i]
      ]);
      volume.push([
        correct_time, // the date
        this.history.v[i] // the volume
      ]);
    }
    Highcharts.setOptions({
      time: {
          useUTC: false
      }
    });

    // this.handleChange($event): void {
    //   this.chartRef.reflow();
    // }
    this.HistoryChartOptions = {
      rangeSelector: {
        enabled: true,
        selected: 0,
        buttons: [{
            type: 'month',
            count: 1,
            text: '1m'
        }, {
            type: 'month',
            count: 3,
            text: '3m'
        }, {
            type: 'month',
            count: 6,
            text: '6m'
        },  
        {
          type: 'ytd',
          text: 'YTD'
        },
        {
            type: 'year',
            count: 1,
            text: '1y'
        }, 
        {
          type: 'all',
          text: 'All'
        }]
    },
    plotOptions:{

    },
    navigator: {
      enabled: true
    },
    scrollbar: {
        enabled: true
    },
      title: {
          text: this.profile.ticker + ' Historical'
      },
      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          }
      }, {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
      }],

    tooltip: {
        split: true
    },
    series: [{
        type: 'candlestick',
        name: this.profile.ticker,
        id: 'stock',
        zIndex: 2,
        data: ohlc
    }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
    }, {
        type: 'vbp',
        linkedTo:  'stock',
        params: {
            volumeSeriesID: 'volume'
        },
        dataLabels: {
            enabled: false
        },
        zoneLines: {
            enabled: false
        }
    }, {
        type: 'sma',
        linkedTo:  'stock',
        zIndex: 1,
        marker: {
            enabled: false
        }
    }]
    }
    this.loading_history = false;
  }

  save_data_and_populate_candle(data:Candle){
    this.candle = data;
    this.stateService.updateState_candle(this.candle);
    let hourlyChart = [];
    var color = "";
    if(this.going_up){
      color = "green";
    }else{
      color = "red"
    }
    for(var i = 0 ; i < this.candle.c.length; i++){
        let tempTime = new Date(this.candle.t[i]*1000);
        let correct_time = tempTime.getTime();
        hourlyChart.push([correct_time, this.candle.c[i]]);
        //console.log(correct_time);
    }
    this.WorkdayChartOptions = {
      title:{
        text: this.profile.ticker + " Hourly Price Variation"
      },
      xAxis: {
        type: 'datetime',
        minTickInterval: 12
      },
      plotOptions:{

      },
      series: [{
        name: this.profile.ticker,
        data: hourlyChart,
        color: color,
        type: 'line'
      }]
    }
  }
  save_data_and_populate_social(data:any){
    // var RTotalMentions : number = 0;
    // var RTotalMentions : number = 0;
    this.social = data;
    this.stateService.updateState_social(this.social);
    // console.log(this.social);
    for(var i = 0; i < data["reddit"].length; i++){
      this.reddit["TotalMentions"] += data["reddit"][i]["mention"];
      this.twitter["TotalMentions"] += data["twitter"][i]["mention"];
      this.reddit["PositiveMentions"] += data["reddit"][i]["positiveMention"];
      this.reddit["NegativeMentions"] += data["reddit"][i]["negativeMention"];
      this.twitter["PositiveMentions"] += data["twitter"][i]["positiveMention"];
      this.twitter["NegativeMentions"] += data["twitter"][i]["negativeMention"];
    }
    this.loading_social_trend = false;
  }
  save_data_and_populate_earning(data:any){
    
    this.earning = data;
    this.stateService.updateState_earning(this.earning);
    var estimate_earning : number[] = [];
    var actual_earning : number[] = [];
    var time_line: string[] = [];
    var surprise: number[] =[];
    for(var i = 0; i < data.length; i++){
      if(data[i]["estimate"] == null){
        estimate_earning.push(0);
      }else{
        estimate_earning.push(data[i]["estimate"]);
      }
      actual_earning.push(data[i]["actual"]);
      time_line.push(data[i]["period"] + "<br>"+ "surprise: "+data[i]["surprise"]);
    }
    this.EPSSurprises = {
      chart:{
        type:'line',
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      yAxis: {
        title: {
            text: 'Quarterly EPS'
        }
      },
      tooltip:{
        shared:true
      },
      xAxis: {
        categories: time_line
      },
      plotOptions:{

      },
      legend: {
        verticalAlign: 'bottom'
      },

    series: [{
        name: 'Estimate',
        type: 'line',
        color: '#000000',
        data: estimate_earning
    }, {
        name: 'Actual',
        type: 'line',
        color: '#0000FF',
        data: actual_earning
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
    };
    this.loading_earning = false;
  }

  save_data_and_populate_news(data:[]){
    this.news = data;
    this.stateService.updateState_news(this.news);
    var number = 0;
    this.news_list = [];
    for(var i = 0; i < data.length;i++){
      if(number <= 19){
        if(data[i]["headline"]!="" && data[i]["image"]!="" && data[i]["url"]!="" && data[i]["datetime"]!=""){
          this.news_list.push(data[i]);
          number = number + 1;
        }
      }else{
        break;
      }
    }
    this.loading_news = false;
  }

  clickNews(content3:any, id:string, dateTime: any){
    var date = new Date(dateTime*1000);
    var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
    var temp = date.getMonth();
    var month = months[temp];
    this.news_date = month + " " + date.getDate() + ", " + date.getFullYear();
    for(var i = 0; i < this.news_list.length; i++){
      if(id === this.news_list[i]["id"]){
        this.news_details = new News(this.news_list[i]);
      }
    }
    this.modalService.open(content3, {ariaLabelledBy: 'modal-basic-title3'}).result.then((result) => {

    });
  }
  reflowBigChart(){
    this.chartRef.reflow();
  }
  save_data_and_populate_recommend(data:[]){
    this.recommendation = data;
    this.stateService.updateState_recommendation(this.recommendation);
    var buy : Array<number> = [];
    var sell : Array<number> = [];
    var hold  : Array<number> = [];
    var strongBuy : Array<number> = [];
    var strongSell : Array<number> = [];
    var period : Array<string> = [];
    var symbol = "";
    for(var i = 0 ; i < this.recommendation.length; i ++){

      buy.push(this.recommendation[i]["buy"]);
      sell.push(this.recommendation[i]["sell"]);
      period.push(this.recommendation[i]["period"]);
      hold.push(this.recommendation[i]["hold"]);
      strongBuy.push(this.recommendation[i]["strongBuy"]);
      strongSell.push(this.recommendation[i]["strongSell"]);
      symbol = this.recommendation[i]["symbol"];
    }
    for(var i = 0; i < period.length;i++){
      period[i] = period[i].slice(0,-3);
    }
    this.RecommChartOptions = 
    {
      chart: {
      type: 'column'
  },
  title: {
      text: 'Recommendation Trends'
  },
  xAxis: {
      categories: period
  },
  yAxis: {
      min: 0,
      title: {
          text: '#Analysis'
      },
      stackLabels: {
          enabled: true,
          style: {
              fontWeight: 'bold',
              color: ( // theme
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
              ) || 'gray'
          }
      }
  },
  legend: {

      verticalAlign: 'bottom'

      // align: 'right',
      // x: -30,
      // verticalAlign: 'bottom',
      // y: 45,
      // floating: true,
      // backgroundColor:
      //     Highcharts.defaultOptions.legend.backgroundColor || 'white',
      // borderColor: '#CCC',
      // borderWidth: 1,
      // shadow: false
  },
  tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  plotOptions: {
      column: {
          stacking: 'normal',
          dataLabels: {
              enabled: true
          }
      }
  },
  series: [{
      name: 'Strong Sell',
      type: 'column',
      color: '#8b0000',
      data: strongSell
  }, {
      name: 'Sell',
      type: 'column',
      color: '#FF0000',
      data: sell
  }, {
      name: 'Hold',
      type: 'column',
      color: '#964B00',
      data: hold
  },{
      name: 'Buy',
      type: 'column',
      color: '#90EE90',
      data: buy
  } ,{
      name: 'Strong Buy',
      type: 'column',
      color: '#00FF00',
      data: strongBuy
  }]
  
}
this.loading_recommend = false;
  }
  getProfile(id:any) {
    this._searchService.search_profile(this.id).subscribe(
      data => this.save_data_and_populate(data)
      //data => console.log(data)
    )
  }
  getQuote(id:any){
    this.timer15 = timer(0,15000).subscribe(()=>
      this._searchService.search_quote(this.id).subscribe(
        data => this.save_data_and_populate_quote(data)
      )
    );
    // this._searchService.search_quote(this.id).subscribe(
    //   data => this.save_data_and_populate_quote(data)
    //   //data => console.log(data)
    // )
  }

  getCandle(id:any, timestamp: any){
    this._searchService.search_candle(this.id, timestamp).subscribe(
      data => this.save_data_and_populate_candle(data)
      //data => console.log(data)
    )
  }

  getHistory(id:any){
    this._searchService.search_history(this.id).subscribe(
      data => this.save_data_and_populate_history(data)
      //data => console.log(data)
    )
  }

  getRecommendation(id:any){
    this._searchService.search_recommend(this.id).subscribe(
      data => this.save_data_and_populate_recommend(data)
      //data => console.log(data)
    )
  }

  getEarning(id:any){
    this._searchService.search_earning(this.id).subscribe(
      data => this.save_data_and_populate_earning(data)
      //data => console.log(data)
    )
  }
  getSocialTrend(id:any){
    this._searchService.search_social(this.id).subscribe(
      data => this.save_data_and_populate_social(data)
    );
  }

  getNews(id:any){
    this._searchService.search_news(this.id).subscribe(
      data => this.save_data_and_populate_news(data)
    );
  }

  getPeers(id:any){
    this._searchService.search_peers(this.id).subscribe(
      data => this.save_data_and_populate_peers(data)
    );
  }
  inWatchOrNot(id:any){
    let temp1 = JSON.parse(localStorage.getItem("watch_list1"));
    if (id in temp1){
      this.unfillSvg = true;
      this.fillSvg = false;
      this.svg1 = "none";
      this.svg2 = "block";
    }else{
      this.unfillSvg = false;
      this.fillSvg = true;
      this.svg1 = "block";
      this.svg2 = "none";
    }
  }
  inPortfolio(id:any){
    let temp1 = JSON.parse(localStorage.getItem("portfolio"));
    if(id in temp1){
      this.hold_or_not = true;
    }else{
      this.hold_or_not = false;
    }
  }
  // sub:any;
  // state$:Observable<any>;
  ngOnInit(): void {
    // if(this.searchBar.getSearchName() != "null"){
    //   this.searchRes.stockName = this.searchBar.getSearchName();
    //   this.searchBar.saveSearchName("null");
    // }
    if (this.timer15) {
      this.timer15.unsubscribe();
    }
    if(this.timerS15){
      clearTimeout(this.timerS15);
      console.log("clear useless time out");
    }
    if (this.stateService.getStateExist() == false){
      this.loading_profile= true;
      this.loading_quote= true;
      this.loading_history= true;
      this.loading_recommend= true;
      this.loading_peers= true;
      this.loading_news= true;
      this.loading_social_trend= true;
      this.loading_earning = true;

      this.id = this.route.snapshot.paramMap.get('id');
      // this.getProfileExist(this.id);
      // if(this.exist_value == false){
      //   return;
      // }

      this.route.paramMap.subscribe((params) =>{
        if (this.timer15) {
          this.timer15.unsubscribe();
        }
        // this.stockName = params['id'];
        this.id = params.get('id');
        this.inWatchOrNot(this.id);
        this.inPortfolio(this.id);
        this.getProfile(this.id);
        this.getQuote(this.id);
        this.getHistory(this.id);
        this.getRecommendation(this.id);
        this.getSocialTrend(this.id);
        this.getEarning(this.id);
        this.getNews(this.id);
        this.getPeers(this.id);
        // console.log(
        //   this.loading_profile,
        // this.loading_quote,
        // this.loading_history,
        // this.loading_recommend,
        // this.loading_peers,
        // this.loading_news,
        // this.loading_social_trend,
        // this.loading_earning
        // )

        this.stateService.updateStateExist(true);
        this.stateService.saveId(this.id);
      })
    }else{
      if (this.timer15) {
        this.timer15.unsubscribe();
      }
      var tick = this.stateService.getId();
      this.inWatchOrNot(tick);
      this.inPortfolio(tick);
      this.state_quote = this.stateService.getValue_quote();
      this.state_profile = this.stateService.getValue_profile();
      this.state_history = this.stateService.getValue_history();
      this.state_recommendation = this.stateService.getValue_recommendation();
      this.state_candle = this.stateService.getValue_candle();      
      this.state_social = this.stateService.getValue_social();      
      this.state_earning = this.stateService.getValue_earning();      
      this.state_news = this.stateService.getValue_news();    
      this.state_peers = this.stateService.getValue_peers();  
      this.quote = this.state_quote;
      this.profile = this.state_profile;
      this.history = this.state_history;
      this.recommendation = this.state_recommendation;
      this.candle = this.state_candle;
      this.social = this.state_social;
      this.earning = this.state_earning;
      this.news = this.state_news;
      this.peers_company = this.state_peers;
      this.save_data_and_populate_quote(this.state_quote);
      this.save_data_and_populate(this.state_profile);
      this.save_data_and_populate_history(this.state_history);
      this.save_data_and_populate_recommend(this.state_recommendation);
      this.save_data_and_populate_candle(this.state_candle);
      this.save_data_and_populate_social(this.state_social);
      this.save_data_and_populate_earning(this.state_earning);
      this.save_data_and_populate_news(this.state_news);
      this.save_data_and_populate_peers(this.state_peers);

      this.id = this.route.snapshot.paramMap.get('id');
      // console.log(this.id );
      if(this.stateService.getId() != this.id){
        if (this.timer15) {
          this.timer15.unsubscribe();
        }
        this.timerTemp = this.route.paramMap.subscribe((params) =>{
          // this.stockName = params['id'];
          // if (this.timer15) {
          //   this.timer15.unsubscribe();
          // }
          if (this.timer15) {
            this.timer15.unsubscribe();
          }
          this.id = params.get('id');
          this.inWatchOrNot(this.id);
          this.inPortfolio(this.id);
          this.getProfile(this.id);
          this.getQuote(this.id);
          this.getHistory(this.id);
          this.getRecommendation(this.id);
          this.getSocialTrend(this.id);
          this.getEarning(this.id);
          this.getNews(this.id);
          this.getPeers(this.id);

          this.stateService.updateStateExist(true);
          this.stateService.saveId(this.id);
        })
      }else{
        this.timerS15 = setTimeout( () => {
        // wait another 15 seconds and then start update 
        //if(tempBoolean){
          if (this.timer15) {
            this.timer15.unsubscribe();
          }
          this.timerTemp = this.route.paramMap.subscribe((params) =>{
            // this.stockName = params['id'];
            if (this.timer15) {
              this.timer15.unsubscribe();
            }
            this.id = params.get('id');
            this.inWatchOrNot(this.id);
            this.inPortfolio(this.id);
            this.getProfile(this.id);
            this.getQuote(this.id);
            this.getHistory(this.id);
            this.getRecommendation(this.id);
            this.getSocialTrend(this.id);
            this.getEarning(this.id);
            this.getNews(this.id);
            this.getPeers(this.id);
            this.stateService.updateStateExist(true);
            this.stateService.saveId(this.id);
          })
        //}
      }, 3000);
      }
    }

  }

  ngOnDestroy() {
    if (this.timer15) {
      this.timer15.unsubscribe();
    }
    if(this.timerS15){
      clearTimeout(this.timerS15);
      console.log("clear useless time out");
    }

    this.tempBoolean = false;
    this.loading_profile= true;
    this.loading_quote= true;
    this.loading_history= true;
    this.loading_recommend= true;
    this.loading_peers= true;
    this.loading_news= true;
    this.loading_social_trend= true;
    this.loading_earning = true;
  }

}
