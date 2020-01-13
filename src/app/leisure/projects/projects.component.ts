import { Component, OnInit } from '@angular/core';
import { LeisureService } from '../leisure.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    cookingUrls: string[];
    uiUrls: string[];

    constructor(private leisureService: LeisureService) {
        this.cookingUrls = [];
    }

    ngOnInit() {}

    setCookingUrls() {
        this.leisureService.setPhotoUrls(this.cookingUrls);
    }

}
