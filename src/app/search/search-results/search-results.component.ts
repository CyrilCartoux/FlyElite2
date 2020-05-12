import { Router } from '@angular/router';
import { FlightService } from './../../services/flight.service';
import { Flight } from './../../interfaces/flight';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  flights: Flight[];
  price: number;

  constructor(
    private flightService: FlightService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // load all the flights that matches the user research to display them
    this.flights = this.flightService.getFoundedFlights();
    this.generateRandomPrice();
  }

  onSelectFlight(index: number) {
    this.flightService.getFlightById(index);
    this.router.navigate(['/book-flight']);
  }

  generateRandomPrice() {
    const userFlight = this.flightService.getUserFlightForm();
    console.log(userFlight.category)
    if (userFlight.category.name === 'Economy') {
       this.price = Math.floor(Math.random() * (250 - 50) + 50);
    } else if (userFlight.category.name === 'Business') {
      this.price = Math.floor(Math.random() * (1000 - 250) + 250);
    } else {
      this.price = Math.floor(Math.random() * (2500 - 1000) + 1000);
    }
  }

}
