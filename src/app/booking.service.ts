import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookings: any[] = []
  bookingObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  confirmationObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor() {
    const data = localStorage.getItem('bookings')
    data ? this.bookings = JSON.parse(data) : []
    this.bookingObservable.next(this.bookings)
  }

  createBooking(roomId: number, roomName: string, data: { [key: string]: any }) {
    const date = data['date'].toDateString()
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    data['bookingId'] = now.getTime()
    data['roomId'] = roomId
    data['roomName'] = roomName
    data['date'] = date
    data['time'] = `${hours}:${minutes}`
    this.bookings.push(data)
    localStorage.setItem('bookings', JSON.stringify(this.bookings))
    this.bookingObservable.next(this.bookings)
    this.confirmationObservable.next(true)
  }
  cancelSlot(slot: string, booking: { [key: string]: any }) {
    const rooms = this.bookings.find(rooms => rooms.bookingId == booking['bookingId'])
    const index = rooms.bookedSlots?.findIndex((slots: string) => slots == slot)
    if (index !== -1) {
      console.log(rooms.bookedSlots[index])
      rooms.bookedSlots.splice(index, 1)
      localStorage.setItem('bookings', JSON.stringify(this.bookings))
      this.bookingObservable.next(this.bookings)
    }
  }
}
