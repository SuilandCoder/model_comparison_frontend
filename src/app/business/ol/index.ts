import { NgModule } from '@angular/core';
import { NgxSharedModule } from '@shared';

import { OlService } from './services/ol.service'
import { GlobalSiteComponent } from './global-site/global-site.component';
////////////////////////////////////////////////////////////////////////////////
export * from './services/ol.service'
export * from './global-site/global-site.component'

const modules = [
    NgxSharedModule,
];
const components = [
    GlobalSiteComponent
];
var entryComponents = [];
const services = [
    OlService
];
var exportComponents = components;
@NgModule({
    imports: [...modules],
    declarations: [...components],
    entryComponents: [...entryComponents],
    providers: [...services],
    exports: [...exportComponents]
})
export class OlModule { }
