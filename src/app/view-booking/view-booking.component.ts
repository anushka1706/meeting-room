import { Component, OnInit } from '@angular/core';
import { RoomListService } from '../room-list.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss']
})
export class ViewBookingComponent implements OnInit {
  allBooking !: any[]
  allRooms: any[] = []
  selectedDate !: Date
  selectedRoom !: number
  results: any[] = []
  cancel: boolean = false
  hasSearched: boolean = false;

  constructor(private bookingService: BookingService, private roomListService: RoomListService) { }

  ngOnInit(): void {
    this.roomListService.showViewBookings.next(false)
    this.roomListService.roomsObserver.subscribe(rooms => {
      this.allRooms = rooms
    })
    this.bookingService.bookingObservable.subscribe(bookings => {
      this.allBooking = bookings
    })
  }
  showResult() {
    this.hasSearched = true;
    const date = this.selectedDate.toDateString()
    if (this.selectedDate && this.selectedRoom) {
      this.results = this.allBooking.filter(bookings => bookings['roomId'] === this.selectedRoom && bookings['date'] === date)
      this.results = this.results.filter(b => b.bookedSlots?.length > 0)
      this.canCancel()
    }
  }
  onCancel(slot: string, booking: { [key: string]: any }) {
    this.roomListService.cancelSlot(slot, booking)
    this.bookingService.cancelSlot(slot, booking)
    this.results = this.results.filter(b => b.bookedSlots?.length > 0)
    console.log(this.results)
  }
  canCancel() {
    const now = new Date()
    const currentTime = now.getTime()
    for (let i = 0; i <= this.results.length; i++) {
      const date = new Date(this.results[i]?.['date'])
      date.setHours(0, 0, 0, 0)
      const time = date.getTime()
      this.results[i]?.bookedSlots.forEach((slot: any) => {
        if (currentTime > this.getMillisecond(time, slot)) {
          this.results[i][`${slot}`] = false
        }
        else {
          this.results[i][`${slot}`] = true
        }
      })
    }
  }
  getMillisecond(time: number, slot: string) {
    const split = slot.split("-")
    const startTime = split[0].split(":")
    const milliseconds = +startTime[0] * 60 * 60000
    return milliseconds + time
  }
}
