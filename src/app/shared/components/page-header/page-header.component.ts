import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface HeaderParams {
  title: string,
  btnClass: string,
  btnLink: string,
  btnText: string,
  showButton: string
}

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  @Input() headerParams: HeaderParams;

  constructor() {

  }

  ngOnInit(): void {
  }

}
