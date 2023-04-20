import { Component, OnInit } from '@angular/core';
import { AllSearchInfo } from '../all-search-info';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../search.service';
import { Quote } from '../quote';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {ViewChild} from '@angular/core';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private _searchService: SearchService
  ) {}
  port_info : any;
  port_value : any;
  port_key:any;
  own_nothing: boolean = false;
  successMessage : boolean = false;
  successMessage_sell_bool :boolean  = false;
  successMessage_sell : string = "";
  successMessage_buy : string = "";
  moneyinwallet : string = "";
  NotEnoughMoney : string = "Not enough money in wallet!";
  NotEnoughStock : string = "You cannot sell the stocks that you don't have!";
  error_buy:boolean = false;
  error_sell:boolean = false;
  current_buy_ticker: string ="";
  estimate_amount:number = 0;
  buy_amount :number = 0;
  amount_share :number = 0;
  money_amount_left = 0;
  
  current_sell_ticker : string = "";
  current_sell_price : number = 0;
  sell_amount:number = 0;
  amount_share_sell : number = 0;
  estimate_amount_sell : number = 0;

  quote: Quote;
  current_buy_price:any;
  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
  @ViewChild('selfClosingAlert1', {static: false}) selfClosingAlert1: NgbAlert | undefined;
  save_quote(data:Quote, id:any){
    this.quote = data;
    this.port_info = JSON.parse(localStorage["portfolio"]);
    if(id in this.port_info){
      this.port_info[id]["CurrentPrice"] = this.quote.c;
    }
    console.log(this.port_info);
    localStorage.setItem("portfolio", JSON.stringify(this.port_info));
  }
  getQuote(id:any){
      this._searchService.search_quote(id).subscribe(
        data => this.save_quote(data,id)
      )
  };

  // tempPort : AllSearchInfo = new AllSearchInfo("","",0,0,0,0,0,0);
  port_list : AllSearchInfo[] = [];
  jsonObject: any;
  ngOnInit(): void {
    this.port_info = JSON.parse(localStorage["portfolio"]);
    this.moneyinwallet = JSON.parse(localStorage["money"]);
    this.port_value = Object.values(this.port_info);
    this.port_key = Object.keys(this.port_info);
    if(this.port_key.length == 0){
      this.own_nothing = true;
    }else{
      this.own_nothing = false;
    }
    for(var i = 0; i < this.port_key.length; i++){
      this.getQuote(this.port_key[i]);
    }
    this.port_list = [];
    for(var i = 0; i < this.port_value.length; i++){
      // let jsonData: string = this.port_temp.toString();
      // this.jsonObject = JSON.parse(jsonData);
      // this.port_temp[i] = this.jsonObject;
      var tempPort : AllSearchInfo = new AllSearchInfo("","",0,0,0,0,0,0);
      tempPort.name = this.port_value[i]["name"];
      console.log(this.port_value[i]["name"]);
      tempPort.ticker = this.port_value[i]["ticker"];
      tempPort.quantity = this.port_value[i]["quantity"];
      tempPort.AverageCostShare = this.roundTo(this.port_value[i]["AverageCostShare"],2);
      tempPort.Change = this.roundTo(this.port_value[i]["Change"],2);
      tempPort.CurrentPrice = this.roundTo(this.port_value[i]["CurrentPrice"],2);
      tempPort.MarketValue = this.roundTo(this.port_value[i]["MarketValue"],2);
      tempPort.total_cost = this.roundTo(this.port_value[i]["total_cost"],2);
      this.port_list.push(tempPort);
    }
    //this.update_ticker()
  }








  update_price(ticker:any){
    this.buy_amount = this.amount_share;
    this.estimate_amount =  this.roundTo(this.buy_amount * this.port_info[ticker]["CurrentPrice"],2);
    let money_left = JSON.parse(localStorage.getItem("money"));
    if(this.estimate_amount > money_left){
      this.error_buy = true;
    }else{
      this.error_buy = false;
    }
  }

  buy_stock_port(amount:any, ticker: any, price:any){
    this.current_buy_ticker = ticker;
    this.current_buy_price = price;
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

  transaction(current_buy_ticker:any){
    let money_left = JSON.parse(localStorage.getItem("money"));
    let current_portfolio = this.port_info[current_buy_ticker];
    if(this.buy_amount <= 0 ){
      this.error_buy = true;
      return;
    }
    if(this.estimate_amount > money_left){
      this.error_buy = true;
      return;
    }

    current_portfolio.quantity = current_portfolio.quantity+this.buy_amount;
    current_portfolio.total_cost = this.roundTo(current_portfolio.total_cost + (current_portfolio.CurrentPrice * this.buy_amount),2);
    current_portfolio.AverageCostShare = this.roundTo(current_portfolio.total_cost / current_portfolio.quantity,2);
    current_portfolio.CurrentPrice = current_portfolio.CurrentPrice;
    current_portfolio.Change = this.roundTo(current_portfolio.AverageCostShare - current_portfolio.CurrentPrice,2);
    current_portfolio.MarketValue = this.roundTo(current_portfolio.CurrentPrice * current_portfolio.quantity,2);

    this.port_info[current_buy_ticker] = current_portfolio
    localStorage.setItem("portfolio", JSON.stringify(this.port_info));

    let money_afterbuy = this.roundTo(money_left - this.estimate_amount,2);
    localStorage.setItem("money", JSON.stringify(money_afterbuy));

    this.successMessage = true;
    this.successMessage_buy = current_buy_ticker + " bought successfully";
    setTimeout(() => this.selfClosingAlert1.close(), 5000);
    this.estimate_amount = 0;
    this.ngOnInit();
  }



  sell_stock_port(amount:any, ticker: any, price:any){
    this.current_sell_price = price;
    this.current_sell_ticker = ticker;
    this.sell_amount = 0;
    this.amount_share_sell = 0;
    this.estimate_amount_sell = 0;
    let money_left = JSON.parse(localStorage.getItem("money"));
    this.money_amount_left = money_left;
    this.modalService.open(amount, {ariaLabelledBy: 'modal-basic-title2'}).result.then((result) => {
      this.sell_amount = this.amount_share_sell;
    });
    //this.estimate_amount_sell = this.sell_amount * this.quote.c;
    localStorage.setItem("money", JSON.stringify(money_left));
  }

  update_price_sell(current_sell_ticker:any){
    this.sell_amount = this.amount_share_sell;
    this.estimate_amount_sell = this.roundTo(this.sell_amount * this.port_info[current_sell_ticker]["CurrentPrice"],2);
    let stock_own_temp = JSON.parse(localStorage.getItem("portfolio"));
    let stock_own = stock_own_temp[current_sell_ticker];
    let stock_share_own = stock_own["quantity"];
    if(this.sell_amount > stock_share_own){
      this.error_sell = true;
    }else{
      this.error_sell = false;
    }
  }

  transaction_sell(current_sell_ticker :any){
    let money_left = JSON.parse(localStorage.getItem("money"));
    if(this.sell_amount <= 0 ){
      this.error_sell = true;
      return;
    }
    let left_quantity = this.port_info[current_sell_ticker].quantity;
    if(left_quantity < this.sell_amount){
      this.error_sell = true;
      return;
    }

      let current_portfolio = this.port_info[current_sell_ticker];
      current_portfolio.quantity = current_portfolio.quantity-this.sell_amount;
      current_portfolio.total_cost = this.roundTo(current_portfolio.total_cost - (current_portfolio.CurrentPrice * this.sell_amount) ,2);
      current_portfolio.AverageCostShare = this.roundTo(current_portfolio.total_cost / current_portfolio.quantity,2);
      current_portfolio.CurrentPrice = current_portfolio.CurrentPrice;
      current_portfolio.Change = this.roundTo(current_portfolio.AverageCostShare - current_portfolio.CurrentPrice,2);
      current_portfolio.MarketValue = this.roundTo(current_portfolio.CurrentPrice * current_portfolio.quantity,2);
      if(current_portfolio.quantity == 0){
        delete this.port_info[current_sell_ticker];
      }
      localStorage.setItem("portfolio", JSON.stringify(this.port_info));

    let money_aftersell = this.roundTo(money_left + this.estimate_amount_sell,2);
    localStorage.setItem("money", JSON.stringify(money_aftersell));
    this.successMessage_sell_bool = true;
    this.successMessage_sell = current_sell_ticker + " sold successfully";
    setTimeout(() => this.selfClosingAlert1.close(), 5000);
    this.estimate_amount_sell = 0;
    this.ngOnInit();
  }













}
