import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user;
  successLogOut = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(
      (user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      }
    );
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.authService.user.next(null);
      this.successLogOut = true;
      this.router.navigate(['search']);
      setTimeout(() => {
        this.successLogOut = false;
      }, 500);
    });

  }

}
