import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, Routes } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ServiceMetaInfo } from '../../../../core/metainfo/service.metaInfo';
import { ServiceMetaInfoService } from '../../../../core/services/serviceMetaInfo.service';

const ROOT_SERVICE_KEY: string = 'menu';

@Injectable()
export class BaMenuService {
	menuItems = new BehaviorSubject<any[]>([]);
    headerMenuItems = new BehaviorSubject<any[]>([]);

	protected _currentMenuItem = {};

	constructor(
        private http: HttpClient, private _router: Router, 
		private serviceMetaInfoService: ServiceMetaInfoService) { 

		postal.channel('MENU_CHANNEL').subscribe('menu.update', (data, envelope) => {
			this.updateMenu();
		})
	}

	public updateMenu() {
		const serviceMetaInfo: ServiceMetaInfo = this.serviceMetaInfoService.getServiceMetaInfo(ROOT_SERVICE_KEY);

		const uri = this.serviceMetaInfoService.addTicket(serviceMetaInfo.uri);

		this.http.get(uri)
			// .map(res => res.json())
			.toPromise()
			.then(res => {
				let data = _.get(res, 'data');
				this.updateMenuByRoutes(<Routes>data);
                this.updateHeaderMenuByRoutes(<Routes>data)
			})
			.catch(this.handleError);
	}

    public updateHeaderMenuByRoutes(routes: Routes){
        if(routes.length){
            let menuItems = routes[0].children;
            let strcatRoute = (suffixPath, children) => {
                if(children && children.length){
                    _.map(children, child => {
                        child.path = suffixPath + '/' + child.path;
                        strcatRoute(child.path, child.children);
                    });
                }
            };
            _.chain(menuItems)
                .map((menuItem) => {
                    strcatRoute(menuItem.path, menuItem.children);
                })
                .value();
            this.headerMenuItems.next(menuItems);
        }
        else{
            this.headerMenuItems.next([]);
        }
    }

	/**
	 * Updates the routes in the menu
	 *
	 * @param {Routes} routes Type compatible with app.menu.ts
	 */
	public updateMenuByRoutes(routes: Routes) {
		let convertedRoutes = this.convertRoutesToMenus(_.cloneDeep(routes));
		this.menuItems.next(convertedRoutes);
	}

	public convertRoutesToMenus(routes: Routes): any[] {
		let items = this._convertArrayToItems(routes);
		return this._skipEmpty(items);
	}

	public getCurrentItem(): any {
		return this._currentMenuItem;
	}

	public selectMenuItem(menuItems: any[]): any[] {
		let items = [];
		menuItems.forEach((item) => {
			this._selectItem(item);

			if (item.selected) {
				this._currentMenuItem = item;
			}

			if (item.children && item.children.length > 0) {
				item.children = this.selectMenuItem(item.children);
			}
			items.push(item);
		});
		return items;
	}

	protected _skipEmpty(items: any[]): any[] {
		let menu = [];
		items.forEach((item) => {
			let menuItem;
			if (item.skip) {
				if (item.children && item.children.length > 0) {
					menuItem = item.children;
				}
			} else {
				menuItem = item;
			}

			if (menuItem) {
				menu.push(menuItem);
			}
		});

		return [].concat.apply([], menu);
	}

	protected _convertArrayToItems(routes: any[], parent?: any): any[] {
		let items = [];
		routes.forEach((route) => {
			items.push(this._convertObjectToItem(route, parent));
		});
		return items;
	}

	protected _convertObjectToItem(object, parent?: any): any {
		let item: any = {};
		if (object.data && object.data.menu) {
			// this is a menu object
			item = object.data.menu;
			item.route = object;
			delete item.route.data.menu;
		} else {
			item.route = object;
			item.skip = true;
		}

		// we have to collect all paths to correctly build the url then
		if (Array.isArray(item.route.path)) {
			item.route.paths = item.route.path;
		} else {
			item.route.paths = parent && parent.route && parent.route.paths ? parent.route.paths.slice(0) : ['/'];
			if (!!item.route.path) item.route.paths.push(item.route.path);
		}

		if (object.children && object.children.length > 0) {
			item.children = this._convertArrayToItems(object.children, item);
		}

		let prepared = this._prepareItem(item);

		// if current item is selected or expanded - then parent is expanded too
		if ((prepared.selected || prepared.expanded) && parent) {
			parent.expanded = true;
		}

		return prepared;
	}

	protected _prepareItem(object: any): any {
		if (!object.skip) {
			object.target = object.target || '';
			object.pathMatch = object.pathMatch || 'full';
			return this._selectItem(object);
		}

		return object;
	}

	protected _selectItem(object: any): any {
		object.selected = this._router.isActive(this._router.createUrlTree(object.route.paths), object.pathMatch === 'full');
		return object;
	}

	private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
