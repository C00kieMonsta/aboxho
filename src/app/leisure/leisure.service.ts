import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LeisureService {

    public photoUrls = new BehaviorSubject<string[]>([]);

    constructor() {}

    get getPhotoUrls(): Observable<string[]> {
        return this.photoUrls.asObservable();
    }

    setPhotoUrls(us: string[]) {
        this.photoUrls.next(us);
    }

}
