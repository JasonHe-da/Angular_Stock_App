import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map ,debounceTime} from 'rxjs';
import { ViewChild, AfterViewInit } from '@angular/core';
import { SearchService } from '../search.service';
import { HeaderComponent } from '../header/header.component';
import { ResultStateService } from '../result-state.service';
import { ResultComponent } from '../result/result.component';
import { SearchbarService } from '../searchbar.service';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-search-bar',
  providers:[ResultComponent,HeaderComponent],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit {
  //stock_name: string;
  formGroup : FormGroup | undefined;
  filteredOptions: any;
  constructor(
    private router1:Router,
    private service : SearchService,
    private stateService : ResultStateService,
    private searchbar : SearchbarService,
    private result: ResultComponent,
    private header : HeaderComponent,
    private fb : FormBuilder,
    //private ResultComponent : result_sub : ResultComponent :
  ) { }
  @ViewChild(ResultComponent) child:any;
  @ViewChild(HeaderComponent) child1:any;
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert | undefined;
  ngOnInit(): void {
    if(this.searchbar.getSearchName()!=""){
      this.stockName = this.searchbar.getSearchName();
    }
    this.initForm();
    //this.getNames(this.stockName);
  }
  options: any;
  option: any;
  value : any;
  empty_input: boolean;
  ticker_not_found:boolean;
  loading2: boolean = false;
  ngOnDestroy(){
    this.searchbar.saveSearchName(this.stockName);
  }
  initForm(){
    this.formGroup = this.fb.group({
      'stock' : ['']
    });
  //   console.log(this.formGroup)
    this.formGroup.get('stock').valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(response => {
      // console.log('data is ', response);
      // this.search_autocomplete();
      if (response == ""){
        this.loading2 = false;
      }else{
        this.loading2 = true;
      }
      this.getNames(response);
    })
  }
  search_autocomplete(data:any){
    this.header.temp();
    this.router1.navigateByUrl('/search/' + data);
  }
  filterData(enteredData: string){
    this.filteredOptions = this.options.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }
  // auto complete API request
  stockName: string = "";
  getNames(id: string){
    this.service.getAutoComplete(id).subscribe(response => {
      this.option = response;
      this.options = this.option['result'];
      this.loading2 = false;
    })
  }
  stockNameSearch: string = "";
  onSubmit($event:any){
    this.result.loading_profile= true;
    this.result.loading_quote= true;
    this.result.loading_history= true;
    this.result.loading_recommend= true;
    this.result.loading_peers= true;
    this.result.loading_news= true;
    this.result.loading_social_trend= true;
    this.result.loading_earning = true;
    this.stockNameSearch = this.stockName;
    this.header.temp();
    if($event.keycode === 13){
      this.header.temp();
      console.log(this.stockName);
    }
    if(this.stockNameSearch == ""){
      this.empty_input = true;
      this.ticker_not_found = true;
      setTimeout(() => this.selfClosingAlert.close(), 5000);
      this.router1.navigateByUrl('/search/home');
      this.empty_input = true;
      this.ticker_not_found = true;
    }else{
      this.empty_input = false;
      this.ticker_not_found = false;
      this.stateService.updateStateExist(false);
      if(this.result.timerS15){

        clearTimeout(this.result.timerS15);
      }
      this.router1.navigateByUrl('/search/' + this.stockNameSearch);

    }
    if(this.searchbar.getSearchName() == ""){
      this.searchbar.saveSearchName(this.stockName);
    }
  }

  deleteFn(){
    this.header.removeActive();
    this.stockName = "";
    this.searchbar.saveSearchName("");
    this.stateService.clear_state();
    this.stockNameSearch = "";
    
    this.router1.navigateByUrl('/search/home');
  }
}
