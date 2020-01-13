import { Component, OnInit, Inject, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(@Optional() @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {}

  openMenu() {
    const burger = document.getElementById('burger-container');
    const header = document.getElementById('site-header');

    this.document.body.classList.toggle('open');

    burger.classList.toggle('open');
    header.classList.toggle('open');
  }

  closeMenu() {
    const burger = document.getElementById('burger-container');
    const header = document.getElementById('site-header');

    this.document.body.classList.remove('open');

    burger.classList.remove('open');
    header.classList.remove('open');
  }

}

