import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RoomListComponent } from './room-list/room-list.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';
import { ViewRoomComponent } from './view-room/view-room.component';

const routes: Routes = [

    {
        path: '',
        children: [
            { path: '', redirectTo: 'room-list', pathMatch: 'full' },
            { path: 'room-list', component: RoomListComponent }
        ]
    },
    { path: 'view-room', component: ViewRoomComponent },
    { path: 'view-bookings', component: ViewBookingComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
