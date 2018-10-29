import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewContainerRef, Renderer2 } from '@angular/core';
import { CmpMethodService } from '../../services/cmp-method.service';
import { DocBaseComponent } from '@shared'
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DynamicTitleService } from "@core/services/dynamic-title.service";
import * as simplemed from 'simplemde';

@Component({
    selector: 'ogms-method-detail',
    templateUrl: './method-detail.component.html',
    styleUrls: ['./method-detail.component.scss']
})
export class MethodDetailComponent extends DocBaseComponent implements OnInit, AfterViewInit {
    method;
    @ViewChild('div') div: ElementRef;
    constructor(
        public route: ActivatedRoute,
        public solutionService: CmpMethodService,
        public title: DynamicTitleService,
        private renderer2: Renderer2
    ) {
        super(route, solutionService, title)
    }

    ngOnInit() {
        super.ngOnInit();
        this._subscriptions.push(this.doc.subscribe(doc => {
            this.method = doc;
            let html = (simplemed as any).markdown(this.method.md);
            // let converter = new showdown.Converter();
            // let html = converter.makeHtml(this.method.md);
            console.log(this.method.md)
            this.renderer2.setProperty(this.div.nativeElement, 'innerHTML', html)
        }));
    }

    ngAfterViewInit() {
    }
}