import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LeisureComponent } from './leisure/leisure.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { GalleryComponent } from './leisure/gallery/gallery.component';
import { ProjectsComponent } from './leisure/projects/projects.component';
import { LeisureService } from './leisure/leisure.service';
import { GalleryUiComponent } from './leisure/gallery-ui/gallery-ui.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        LeisureComponent,
        AboutComponent,
        ContactComponent,
        FooterComponent,
        PageNotFoundComponent,
        GalleryComponent,
        ProjectsComponent,
        GalleryUiComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
        LeisureService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {


    @Input() photoUrls: string[];

    constructor() {
        this.photoUrls = [];
    }

}
