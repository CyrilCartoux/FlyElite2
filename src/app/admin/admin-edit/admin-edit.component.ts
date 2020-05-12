import { MessageService } from 'primeng/api';
import { DataStorageService } from './../../services/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Flight } from 'src/app/interfaces/flight';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {

  idToEdit: number;
  allflights: Flight[] = [];
  allKeys = [];

  // Dates :
  rangeDates: Date[];
  minDate: Date;
  maxDate: Date;
  date: Date;
  date1: Date;
  es: any;
  invalidDates: Array<Date>;

  editFlightForm: FormGroup;
  checked = true;

  success = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataStorageService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.idToEdit = +data.get('id');
    });
    this.dataService.allFlightsFromFirebaseSubject.subscribe((flights: Flight[]) => {
      this.allflights.push(...flights);
    });
    this.allKeys = this.dataService.getKeysOfFlights();


    this.editFlightForm = new FormGroup({
      departure: new FormControl('', Validators.required),
      arrival: new FormControl('', Validators.required),
      dates: new FormControl('', Validators.required),
      departureTime: new FormControl('', Validators.required),
      landingTime: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required),
      noEscale: new FormControl('', Validators.required),
      flightNumber: new FormControl('', Validators.required)
    });

    this.initForm();

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

  initForm() {
    const flight = this.allflights[this.idToEdit];
    this.editFlightForm.setValue({
      departure: flight.departure,
      arrival: flight.arrival,
      dates: '',
      departureTime: '',
      landingTime: '',
      company: flight.company,
      noEscale: flight.noEscale,
      flightNumber: flight.flightNumber
    });
  }

  onSubmitEditFlightForm() {
    const key = this.allKeys[this.idToEdit];
    this.dataService.editFlight(key, this.editFlightForm).then(() => {
      this.showSuccess();
    }).catch(error => {
      this.showError(error.message);
    });
    this.editFlightForm.reset();
    setTimeout(() => {
      this.router.navigate(['/admin']);
    }, 2000);
  }

  showSuccess() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Succès ', detail: 'Modification effectuée !' });
  }
  showError(message) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error ', detail: message });
  }
}

