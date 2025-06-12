import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomListService } from '../room-list.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.scss']
})

export class ViewRoomComponent implements OnInit {
  id !: number
  bookingForm !: FormGroup
  purpose !: string[]
  availableSlots: string[] = []
  showSlots: boolean = false
  bookedSlots !: string[]
  room !: { [key: string]: any }
  disabledSlots: string[] = []
  slotsSelected: string[] = []
  allSlots !: string[]
  selectedSlot !: string
  icons: { [key: string]: string } = {
    TV: 'tv', Sofa: 'weekend', Wifi: 'wifi', Whiteboard: 'draw', AC: 'ac_unit'
  }

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private roomListService: RoomListService, private BookingService: BookingService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id']
    })
    this.roomListService.getRoomByid(this.id)
    this.roomListService.viewRoom.subscribe(data => {
      this.room = data
    })
    this.purpose = this.roomListService.purpose
    this.buildForm()
    this.allSlots = this.roomListService.timeSlots
  }

  buildForm() {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      purpose: [''],
      bookedSlots: ['']
    });
  }

  onSubmit() {
    this.bookingForm.get('bookedSlots')?.setValue(this.slotsSelected)
    this.BookingService.createBooking(this.room['id'], this.room['name'], this.bookingForm.value)
    this.roomListService.updateRooms(this.slotsSelected, this.room['id'], this.bookingForm.value.date)
    this.slotsSelected = []
    this.showSlots = false
    this.bookingForm.reset()
    this.BookingService.confirmationObservable.subscribe(value => {
      if (value) {
        this.snackBar.open('Booking successful', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    })
  }

  onCheckboxSelect(slot: string, checked: boolean) {
    if (checked) {
      this.slotsSelected.push(slot)
    }
  }

  showTimeSlot(e: MatDatepickerInputEvent<Date>) {
    const dateObj = e.value;
    const date = dateObj?.toDateString();

    const entry = this.room?.['avaibility']?.find((item: any) => item.date === date);
    this.availableSlots = entry ? entry.availableSlots : this.roomListService.timeSlots;

    this.disabledSlots = this.allSlots.filter(slot => this.isSlotInPast(dateObj, slot));
    this.showSlots = true;
  }

  isSlotInPast(dateObj: Date | null, slot: string): boolean {
    if (!dateObj) return false;

    const date = new Date(dateObj);
    date.setHours(0, 0, 0, 0);
    const [startHour, startMinute] = slot.split("-")[0].split(":").map(Number);
    date.setHours(startHour, startMinute, 0, 0);

    return date.getTime() < Date.now();
  }

}
