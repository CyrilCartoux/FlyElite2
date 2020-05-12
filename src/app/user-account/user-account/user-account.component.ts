import { DataStorageService } from './../../services/data-storage.service';
import { Users } from './../../interfaces/user';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import * as firebase from 'firebase';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private dataService: DataStorageService,
        private messageService: MessageService
    ) { }

    items: MenuItem[];
    uid;
    passengers: Users[];
    flightsOfUser = [];
    keysOfFlights = [];
    userInfos;

    ngOnInit() {
        this.items = [{
            label: 'Mes vols',
            items: [
                { label: 'Modifier', icon: 'pi pi-pencil', routerLink: 'edit' }
            ]
        },
        {
            label: 'Edit',
            items: [
                { label: 'Ajouter un vol', icon: 'pi pi-plus', routerLink: '/search' },
                { label: 'Annuler mes vols', icon: 'pi pi-trash', }
            ]
        }];
        // get uid from connectedUser
        this.authService.user.subscribe(data => {
            this.uid = data;
        });

        this.emitFlights();
        this.getInfos();
    }

    // load the flights under the current user from firebase, store them in flightOfUser +
    // load the flights keys from the current user, store the in keysOfFlights
    emitFlights() {
        const dates = [];
        const flights = [];
        firebase.database().ref('users').child(this.uid).child('flights').on('value', (snapshot) => {
            snapshot.forEach(elt => {
                const date = elt.val().dates;
                dates.push(date.split(','));
                flights.push(elt.val());
                for (const flight of flights) {
                    for (const day of dates) {
                        flight.dates = day;
                    }
                }
                this.keysOfFlights.push(elt.key);
            });
        });
        this.flightsOfUser = flights;
        console.log(this.flightsOfUser);
    }

    // get the index of flight, search the flight key associated to it, then delete it
    deleteFlight(index: number) {
        const key = this.keysOfFlights[index];
        // connect to database, remove the flight than empty both arrays and call emitFlight again to store the new list of flights
        firebase.database().ref('users').child(this.uid).child('flights').child(key).remove().then(
            () => {
                this.flightsOfUser = [];
                this.keysOfFlights = [];
                this.showSuccess();
                this.emitFlights();
            }
        ).catch(error => {
            this.showError(error.message);
        });
    }

    onDeleteAllFlights(e) {
        if (window.confirm('Êtes-vous sûr ?')) {
            this.dataService.deleteAllFlightsOfUser(this.uid);
            this.flightsOfUser = [];
            this.keysOfFlights = [];
            this.emitFlights();
        } else {
            e.preventDefault();
        }
    }

    async getInfos() {
        await this.dataService.getUserInfos(this.uid).then((data) => {
            this.userInfos = data;
        });
    }

    showSuccess() {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Succès ', detail: 'Vol supprimé !' });
    }
    showError(message) {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error ', detail: message });
    }
}
