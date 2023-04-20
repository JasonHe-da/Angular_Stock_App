import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes,RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ResultComponent } from './result/result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule} from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from './footer/footer.component';
import { SearchService } from './search.service';
import { JumpTotheMainPageComponent } from './jump-tothe-main-page/jump-tothe-main-page.component';
//import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
  { path: '', component: JumpTotheMainPageComponent },
  { path: 'search/home', component: SearchBarComponent },
  { path: 'search', component: SearchBarComponent },
  { path: 'search/:id', component: ResultComponent},
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
];
if(localStorage.getItem("money")===null){
  localStorage.setItem("money", "25000");
  localStorage.setItem("watch_list1", "{}");
  localStorage.setItem("portfolio", "{}");
}
// localStorage.setItem("money", "25000");
// localStorage.setItem("watch_list1", "{}");
// localStorage.setItem("portfolio", "{}");
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchBarComponent,
    WatchlistComponent,
    PortfolioComponent,
    ResultComponent,
    FooterComponent,
    JumpTotheMainPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    HighchartsChartModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private service : SearchService,
    //private ResultComponent : result_sub : ResultComponent :
  ) { }

  ngOnInit(): void {
    //this.getNames(this.stockName);
  }
 }
