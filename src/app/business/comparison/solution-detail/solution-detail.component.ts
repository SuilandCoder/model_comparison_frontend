import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { SlnService } from "../../services/sln.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NzNotificationService, NzModalService } from "ng-zorro-antd";
import { DynamicTitleService } from "@common/core/services/dynamic-title.service";
import { ReactiveFormsModule } from "@angular/forms";
import { DocBaseComponent } from '@common/shared';

@Component({
    selector: 'ogms-solution-detail',
    templateUrl: './solution-detail.component.html',
    styleUrls: ['./solution-detail.component.scss']
})
export class SolutionDetailComponent extends DocBaseComponent implements OnInit {
    sln;

    constructor(
        public route: ActivatedRoute,
        public slnService: SlnService,
        public title: DynamicTitleService
    ) { 
        super(route, slnService, title);
    }

    ngOnInit() {
        super.ngOnInit();
        this._subscriptions.push(this.doc.subscribe(doc => {
            this.sln = doc;
        }));
    }
}