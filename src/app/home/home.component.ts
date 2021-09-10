import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  optionDisplayed = 'login';
  loginButtonClass = 'btn btn-primary';
  registerButtonClass = 'btn btn-outline-primary';
  user: any = {};
  touched = {username: false, email: false, password: false, confirmPassword: false};
  registerError = '';
  loginError = '';
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  showLogin() {
    this.optionDisplayed = 'login';
    this.loginButtonClass = 'btn btn-primary';
    this.registerButtonClass = 'btn btn-outline-primary';
    this.user = {};
  }

  // tslint:disable-next-line: typedef
  showRegister() {
    this.optionDisplayed = 'register';
    this.loginButtonClass = 'btn btn-outline-primary';
    this.registerButtonClass = 'btn btn-primary';
    this.user = {};
  }

  // tslint:disable-next-line: typedef
  getUsernameError() {
    if (!!this.user.username) {
      this.touched.username = true;
    }
    if (this.touched.username) {
      if (this.user.username === '') {
        return 'Username cannot be empty';
      } else if (this.user.username.length >= 50) {
        return 'Username is too long';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  // tslint:disable-next-line: typedef
  getPasswordError() {
    if (!!this.user.password) {
      this.touched.password = true;
    }
    if (this.touched.password) {
      if (this.user.password === '') {
        return 'Password cannot be empty';
      } else if (this.user.password.length >= 50) {
        return 'Password is too long';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  // tslint:disable-next-line: typedef
  getConfirmPasswordError() {
    if (!!this.user.confirm) {
      this.touched.confirmPassword = true;
    }
    if (this.touched.confirmPassword) {
      if (this.user.confirm === '') {
        return 'Password cannot be empty';
      } else if (this.user.confirm.length >= 50) {
        return 'Password is too long';
      } else if (this.user.confirm !== this.user.password) {
        return 'Passwords must match';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  // tslint:disable-next-line: typedef
  getEmailError() {
    if (!!this.user.email) {
      this.touched.email = true;
    }
    if (this.touched.email) {
      if (this.email.hasError('required')) {
        return 'Email is required';
      }
      return this.email.hasError('email') ? 'Not a valid email' : '';
    } else {
      return '';
    }
  }

  // tslint:disable-next-line: typedef
  register() {
    // tslint:disable-next-line: max-line-length
    if (this.getConfirmPasswordError() === '' && this.getEmailError() === '' && this.getPasswordError() === '' && this.getUsernameError() === '') {
      if (this.user.password !== this.user.confirm) {
        this.registerError = 'Entered passwords must match';
      } else {
        this.memberService.register(this.user).subscribe((resp) => {
          console.log(resp.songs);
          sessionStorage.setItem('songs', JSON.stringify(resp.songs));
          sessionStorage.setItem('user', JSON.stringify(resp.user));
          console.log('User registered');
          this.router.navigate(['songs']);
        }, (err) => {
          this.registerError = err.error.error;
          console.log(err.error.error);
        });
      }
    } else {
      this.registerError = 'Not all fields have been filled out';
    }
  }

  // tslint:disable-next-line: typedef
  login() {
    if (!!this.user.username && !!this.user.password) {
      this.memberService.login(this.user).subscribe((resp) => {
        sessionStorage.setItem('songs', JSON.stringify(resp.songs));
        sessionStorage.setItem('user', JSON.stringify(resp.user));
        console.log('User logged in');
        this.router.navigate(['songs']);
      }, (err) => {
        this.loginError = err.error.error;
        console.log(err.error.error);
      });
    } else {
      this.loginError = 'Not all fields have been filled out';
    }
  }

}
