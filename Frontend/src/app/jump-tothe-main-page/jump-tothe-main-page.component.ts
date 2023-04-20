import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jump-tothe-main-page',
  templateUrl: './jump-tothe-main-page.component.html',
  styleUrls: ['./jump-tothe-main-page.component.css']
})
export class JumpTotheMainPageComponent implements OnInit {

  constructor(
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.router.navigateByUrl('/search/home');
  }

}
