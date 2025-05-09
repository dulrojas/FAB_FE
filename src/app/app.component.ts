import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit() {}

    @HostListener('window:beforeunload', ['$event'])
    handleBeforeUnload(event: Event): void {
        this.authService.logout();
    }
}
