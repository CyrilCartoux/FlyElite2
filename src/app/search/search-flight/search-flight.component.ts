import { MessageService } from 'primeng/api';
import { FlightService } from './../../services/flight.service';
import { Category } from './../../interfaces/category';
import { Component, OnInit } from '@angular/core';
import { Airport } from 'src/app/interfaces/airport';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-flight',
  templateUrl: './search-flight.component.html',
  styleUrls: ['./search-flight.component.css']
})
export class SearchFlightComponent implements OnInit {

  // Found flight ?:
  foundflight = false;

  // Departure and landing :
  airports: Airport[];

  // Dates :
  rangeDates: Date[];

  minDate: Date;
  maxDate: Date;
  es: any;
  invalidDates: Array<Date>;

  // Nombre billets :
  nbreBillets = 1;

  // Escales ?
  checked = true;

  // Flight category :
  categories: Category[];
  selectedCategory: Category;

  // Formulaire:
  flightForm: FormGroup;

  constructor(
    private flightService: FlightService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.airports = [
      { label: 'LAX', value: 'Los Angeles' },
      { label: 'DXB', value: 'Dubaï' },
      { label: 'ATL', value: 'Atlanta' },
      { label: 'PEK', value: 'Beijing' },
      { label: 'HND', value: 'Tokyo' },
      { label: 'ORD', value: 'Chicago' },
      { label: 'LHR', value: 'London' },
      { label: 'HKG', value: 'Hong-Kong' },
      { label: 'CDG', value: 'Paris' },
      { label: 'AMS', value: 'Amsterdam' },
      { label: 'FRA', value: 'Frankfurt' },
      { label: 'SIN', value: 'Singapore' },
      { label: 'MRS', value: 'Marseille' }
    ];
    this.categories = [
      { name: 'Economy' },
      { name: 'Business' },
      { name: 'Premiere' }
    ];
  }

  ngOnInit() {

    // Formulaire :
    this.flightForm = new FormGroup({
      departure: new FormControl('', Validators.required),
      arrival: new FormControl('', Validators.required),
      dates: new FormControl('', Validators.required),
      nbrePersonne: new FormControl('', Validators.required),
      noEscale: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    });

    // Calendrier :
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
      monthNamesShort: ['jan', 'fev', 'mar', 'avr', 'may', 'jun', 'jul', 'aou', 'sep', 'oct', 'nov', 'dec'],
      today: 'Hoy',
      clear: 'Borrar'
    };

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const prevMonth = (month === 0) ? 11 : month - 1;
    const prevYear = (prevMonth === 11) ? year - 1 : year;
    const nextMonth = (month === 11) ? 0 : month + 1;
    const nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);

    const invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 1);
    this.invalidDates = [today, invalidDate];
  }

  onSubmitFlightForm() {
    const dates = this.flightForm.value.dates;
    const userform = this.flightForm.value;
    console.log(userform);
    if (userform.arrival === userform.departure) {
      this.sameFlightError();
      return;
    }
    if (dates[0] > new Date()) {
      if (this.flightService.findFlight(this.flightForm.value)) {
        this.foundflight = true;
        this.router.navigate(['search/results']);
      } else {
        this.showError();
      }
    } else {
      this.dateInfError();
    }
  }

  showError() {
    this.messageService.add({
      key: 'tc',
      severity: 'error',
      summary: 'C\'est embarassant ... ',
      detail: ' Aucuns vols ne correspondent à votre recherche !'
    });
  }
  dateInfError() {
    this.messageService.add({
      key: 'tc',
      severity: 'error',
      summary: 'C\'est embarassant ... ',
      detail: ' Voyage dans le temps impossible !'
    });
  }
  sameFlightError() {
    this.messageService.add({
      key: 'tc',
      severity: 'error',
      summary: 'C\'est embarassant ... ',
      detail: ' Les vols doivent être différents !'
    });
  }

}
