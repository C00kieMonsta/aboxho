import { Component, OnInit } from '@angular/core';
import { LeisureService } from '../leisure.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

    photoUrls: Observable<string[]>;

    constructor(private leisureService: LeisureService) {
        this.photoUrls = this.leisureService.getPhotoUrls;
    }

    ngOnInit() { }

}
