import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';
import { AddComponent } from './admin/add/add.component';
import { AdminComponent } from './admin/admin/admin.component';
import { EditComponent } from './user-account/edit/edit.component';
import { UserAccountComponent } from './user-account/user-account/user-account.component';
import { AuthGuard } from './auth/auth/auth.guard';
import { AuthComponent } from './auth/auth/auth.component';
import { BookFlightComponent } from './book-flight/book-flight.component';
import { SearchResultsComponent } from './search/search-results/search-results.component';
import { CheckInComponent } from './check-in/check-in.component';
import { SearchFlightComponent } from './search/search-flight/search-flight.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: SearchFlightComponent },
  {
    path: 'search', component: SearchFlightComponent,
    children: [
      { path: 'results', component: SearchResultsComponent }
    ]
  },
  { path: 'checkin', component: CheckInComponent, canActivate: [AuthGuard] },
  { path: 'book-flight', component: BookFlightComponent, canActivate: [AuthGuard] },
  {
    path: 'account', component: UserAccountComponent, canActivate: [AuthGuard],
    children: [
      { path: 'edit/:id', component: EditComponent }
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
      { path: 'add', component: AddComponent },
      { path: 'edit/:id', component: AdminEditComponent }
    ]
  },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: 'search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
