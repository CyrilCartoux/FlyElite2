import { DataStorageService } from './../../services/data-storage.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { MessageService } from 'primeng/api';
import * as firebase from 'firebase';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  items: MenuItem[];
  flights = [];
  keysOfFlights = [];

  constructor(
    private dataService: DataStorageService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // load all the flights from firebase
    this.dataService.allFlightsFromFirebaseSubject.subscribe((flights) => {
      this.flights = [];
      this.flights = flights;
    });

    const dates = [];
    const flights = [];

    firebase.database().ref('flights').on('value', (snapshot) => {
      snapshot.forEach(elt => {
        const date = elt.val().dates;
        dates.push(date.split(','));
        flights.push(elt.val());
        for (const flight of flights) {
          for (const day of dates) {
            flight.dates = day;
          }
        }
      });
      this.flights = flights;
      console.log(this.flights);
    });


    this.items = [
      {
        label: 'Editer',
        items: [
          { label: 'Ajouter un vol', icon: 'pi pi-plus', routerLink: 'add' },
        ]
      }];
  }

  onDeleteFlight(index: number) {
    this.dataService.deleteFlight(index).then(() => {
      this.dataService.allFlightsFromFirebaseSubject.subscribe(flights => {
        this.flights = flights;
        this.showSuccess();
      }).unsubscribe();
    }).catch(error => {
      this.showError(error.message);
    });
  }

  async deleteAllFlights() {
    await this.dataService.deleteAllFlights().then(() => {
      this.dataService.allFlightsFromFirebaseSubject.subscribe(flights => {
        this.flights = flights;
        this.showSuccess();
      }).unsubscribe();
    }).catch(error => {
      this.showError(error.message);
    });
  }

  showSuccess() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Succès ', detail: 'Vol supprimé !' });
  }
  showError(message) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error ', detail: message });
  }
}
