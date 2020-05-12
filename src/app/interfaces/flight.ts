export interface Flight {
    departure: string;
    arrival: string;
    flightNumber?: number;

    departureTime?: Date;
    landingTime?: Date;

    dates: Date[];

    flightTime?: number;
    company?: string;
    noEscale?: boolean;
}
