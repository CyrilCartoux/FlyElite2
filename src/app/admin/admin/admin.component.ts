import { DataStorageService } from './../../services/data-storage.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { MessageService } from 'primeng/api';

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
    // load the unique keys of flights
    this.keysOfFlights = this.dataService.getKeysOfFlights();

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
