import { Category } from './category';

export interface FlightToSearch {
    departure: string;
    arrival: string;
    dates: Date[] | string;
    nbrePersonnes?: number;
    noEscale?: boolean;
    category?: Category;
}
