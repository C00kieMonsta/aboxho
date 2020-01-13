import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LeisureComponent } from './leisure/leisure.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { ProjectsComponent } from './leisure/projects/projects.component';
import { GalleryComponent } from './leisure/gallery/gallery.component';
import { GalleryUiComponent } from './leisure/gallery-ui/gallery-ui.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'leisure', component: LeisureComponent, children: [
    { path: '', component: ProjectsComponent },
    { path: 'gallery', component: GalleryComponent },
    { path: 'ui', component: GalleryUiComponent },
  ] },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
