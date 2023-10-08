import { Injectable } from "@angular/core";
import { of } from "rxjs";

export interface IPerson {
    readonly name: string;
    readonly surname: string;
    readonly birthDate: Date;
}

@Injectable()
export class PeopleService {
    private readonly people: IPerson[] = [
        {
            name: 'Pino',
            surname: 'Rossi',
            birthDate: new Date()
        },
        {
            name: 'Maria',
            surname: 'Bianchi',
            birthDate: new Date()
        }
    ]

    public getPeople() {
        return of(this.people);
    }
}