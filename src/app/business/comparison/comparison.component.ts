import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ogms-comparison',
  template: `
    <div class='section-container'>
        <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
  `]
})
export class ComparisonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
