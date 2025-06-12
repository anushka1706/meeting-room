import { Component, OnInit } from '@angular/core';
import { RoomListService } from './room-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'meeting-room';
  showViewBookings : boolean = true

  constructor(private roomListService: RoomListService) { }

  ngOnInit(): void {
    this.roomListService.showViewBookings.subscribe(value => {
      this.showViewBookings = value
    })
  }
}
