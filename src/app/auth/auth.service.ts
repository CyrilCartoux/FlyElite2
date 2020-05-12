import { NgForm } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<any>(null);
  uid;

  constructor() { }

  async signUp(form: NgForm) {
    const email = form.value.email;
    const nom = form.value.nom;
    const prenom = form.value.prenom;
    // create user then
    await firebase.auth().createUserWithEmailAndPassword(form.value.email, form.value.password)
      .then(credentials => {
        // create user in firebase database under its uid
        this.uid = credentials.user.uid;
        firebase.database().ref('users').child(this.uid).set({
          email: email,
          nom: nom,
          prenom: prenom
        });
        // next the new user (current user) in the user subject, used by the entire app to identify current user
        this.user.next(this.uid);
      });
  }

  // log in the user then emit it to the user subject
  async signIn(form: NgForm) {
    await firebase.auth().signInWithEmailAndPassword(form.value.email, form.value.password)
      .then(credentials => {
        this.uid = credentials.user.uid;
        this.user.next(this.uid);
      });
  }
}
