import { DataStorageService } from './data-storage.service';
import { BehaviorSubject } from 'rxjs';
import { FlightToSearch } from './../interfaces/flight-to-search';
import { Flight } from './../interfaces/flight';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FlightService {

  // liste des vols
  flights: Flight[] = [];

  // vols correspondants a la recherche :
  flightsFounded: Flight[] = [];

  // vol selectionné par l'user dans search/results :
  flightSelected = new BehaviorSubject<Flight>(null);

  // formulaire recherche de l'user :
  userFlightForm: FlightToSearch;


  constructor(
    private dataStorage: DataStorageService
  ) { }

  // fetch from firebase, called from app.component.ts
  fetchFlights() {
    this.dataStorage.allFlightsFromFirebaseSubject.subscribe(
      (data: Flight[]) => {
        this.flights = data;
      }
    );
  }

  // tranform data in order to compare flights easily
  transformFlightInfos(flight) {
    return {
      departure: flight.departure,
      arrival: flight.arrival,
      dates: flight.dates.toLocaleString()
    };
  }

  // match flights between user research and flights in database :
  findFlight(flightToSearch: FlightToSearch): boolean {
    // f$cking ugly but had to do it to remove "à 00:00:00"
    const modifiedFlight = this.transformFlightInfos(flightToSearch);
    const newDates = modifiedFlight.dates.split(',');
    const str = [];
    for (const date of newDates) {
      str.push(date.substring(0, 10));
    }
    const strDate = str.toLocaleString();
    flightToSearch.dates = strDate;

    this.flightsFounded = [];
    this.userFlightForm = flightToSearch;
    console.log(flightToSearch)

    

    this.flights.forEach((elt: Flight) => {
      console.log(this.transformFlightInfos(elt))
      if (JSON.stringify(this.transformFlightInfos(elt)) === JSON.stringify(this.transformFlightInfos(flightToSearch))) {
        this.flightsFounded.push(elt);
      }
    });

    if (this.flightsFounded.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  // return list of flights who match user research :
  getFoundedFlights(): Flight[] {
    if (this.flightsFounded === undefined) {
      return;
    } else {
      return this.flightsFounded;
    }
  }

  // used by search-results when one flight is selected :
  getFlightById(index: number) {
    this.flightSelected.next(this.flightsFounded[index]);
  }

  // used by book-flight to display more infos about the user flight :
  getUserFlightForm(): FlightToSearch {
    return this.userFlightForm;
  }

}
