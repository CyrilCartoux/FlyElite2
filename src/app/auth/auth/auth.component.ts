import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmitForm(form: NgForm) {
    this.isLoading = true;

    if (this.isLoginMode) {
      this.authService.signIn(form).then(() => {
        this.isLoading = false;
        this.showSuccess();
        setTimeout(() => {
          this.router.navigate(['search']);
        }, 1000);
      }).catch(e => {
        this.isLoading = false;
        this.showError(e.message);
      });
    } else {
      this.authService.signUp(form).then(() => {
        this.isLoading = false;
        this.showSuccess();
        setTimeout(() => {
          this.router.navigate(['search']);
        }, 1000);
      }).catch(e => {
        this.isLoading = false;
        this.showError(e.message);
      });
    }

    form.reset();
  }

  showSuccess() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Succès ', detail: 'Connecté !' });
  }
  showError(message) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error ', detail: message });
  }

}

