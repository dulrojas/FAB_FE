import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private logoutTimeout: any;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        window.addEventListener('unload', this.handleUnload.bind(this));
    }

    ngOnDestroy() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        window.removeEventListener('unload', this.handleUnload.bind(this));
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.logoutTimeout = setTimeout(() => {
            this.authService.logout();
        }, 300000);
        } else {
        if (this.logoutTimeout) {
            clearTimeout(this.logoutTimeout);
            this.logoutTimeout = null;
        }
        }
    }

    handleUnload() {
    }
}
