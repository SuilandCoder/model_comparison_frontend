import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { DataInquireService } from '../../core/services/data.inquire.service';
import { APP_CONFIG } from '../../core/config/app.config';
import { ErrorHandle } from '../../core/base/error-handle';

@Injectable()
export class LoginService extends ErrorHandle {
    constructor(
        private http: HttpClient,
        private router: Router,
        private dataInquireService: DataInquireService
    ) {
        super();
    }

    public postLogin(username: string, password: string): Observable<any> {
        return Observable.create(observer => {
            let loginPostData = {
                username: username,
                password: password
            };
            const url = this.dataInquireService.getServiceById('login');
            this.http
                .post(url, loginPostData)
                .subscribe({
                    next: response => {
                        const res = <any>response;
                        if (res.status.code !== '200') {
                            const err = <any>new Error(res.status.desc);
                            err.status = res.status.code;
                            console.log(`#login.service# ${res.status.code} - ${res.status.desc}`);
                            this.router.navigate(['/login']);
                            observer.next(err);
                        } else {
                            console.log(APP_CONFIG.defaultroute);
                            localStorage.setItem('jwt',JSON.stringify(res.data.jwt));
                            this.router.navigate(['/' + APP_CONFIG.defaultroute]);
                        }
                    },
                    error: err => this.handleError(err),
                    complete: () => {}
                });
        });
    }
}
