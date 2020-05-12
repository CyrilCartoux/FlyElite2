import { Flight } from './flight';
import { User } from './user';

export interface FlightReservation {
    flightInfos: Flight[];

    category: string;
    reservationNumber: number;
    passenger: User[];
}
