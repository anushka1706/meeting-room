import { Injectable } from '@angular/core';
import { BehaviorSubject, isEmpty } from 'rxjs';

interface Room {
  id: number;
  name: string;
  capacity: number;
  features: string[];
  imageUrl: string;
  avaibility: any[];
}
@Injectable({
  providedIn: 'root',
})

export class RoomListService {
  timeSlots: string[] = [
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
  ]
  roomData: Room[] = [
    {
      id: 1,
      name: 'RE11',
      capacity: 4,
      imageUrl: '../assets/images/benjamin-child-GWe0dlVD9e0-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC', 'Wifi', 'Sofa'],
    },
    {
      id: 2,
      name: 'RE12',
      capacity: 6,
      imageUrl: '../assets/images/gul-fatima-teZLTlnKNdo-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC', 'Wifi'],
    },
    {
      id: 3,
      name: 'Mercado',
      capacity: 11,
      imageUrl: '../assets//images/nastuh-abootalebi-eHD8Y1Znfpk-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'AC', 'Wifi', 'Sofa'],
    },
    {
      id: 4,
      name: 'RE13',
      capacity: 6,
      imageUrl: '../assets/images/pawel-chu-ULh0i2txBCY-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC', 'Wifi'],
    },
    {
      id: 5,
      name: 'Cubical',
      capacity: 6,
      imageUrl: '../assets/images/s-o-c-i-a-l-c-u-t-1RT4txDDAbM-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC'],
    },
    {
      id: 6,
      name: 'RE14',
      capacity: 6,
      imageUrl: '../assets/images/yann-maignan-rRiAzFkJPMo-unsplash.jpg',
      avaibility: [],
      features: ['Whiteboard', 'AC', 'Wifi'],
    },
    {
      id: 7,
      name: 'RE15',
      capacity: 4,
      imageUrl: '../assets//images/nastuh-abootalebi-eHD8Y1Znfpk-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC', 'Wifi'],
    },
    {
      id: 8,
      name: 'RE116',
      capacity: 11,
      imageUrl: '../assets/images/pawel-chu-ULh0i2txBCY-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC'],
    },
    {
      id: 9,
      name: 'RE17',
      capacity: 4,
      imageUrl: '../assets/images/pawel-chu-ULh0i2txBCY-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC', 'Wifi'],
    },
    {
      id: 10,
      name: 'RE18',
      capacity: 6,
      imageUrl: '../assets/images/pawel-chu-ULh0i2txBCY-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC', 'Wifi'],
    },
    {
      id: 11,
      name: 'RE19',
      capacity: 11,
      imageUrl: '../assets/images/yann-maignan-rRiAzFkJPMo-unsplash.jpg',
      avaibility: [],
      features: ['TV', 'Whiteboard', 'AC', 'Wifi'],
    }
  ];
  showViewBookings: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  featuresObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  features: any[] = [
    { name: 'AC', selected: false },
    { name: 'Whiteboard', selected: false },
    { name: 'Sofa', selected: false },
    { name: 'TV', selected: false },
    { name: 'Wifi', selected: false },
  ];

  purpose: string[] = ["Team meeting", "interiew", "Workshop/Training", "Other"]

  viewRoom: BehaviorSubject<{ [key: string]: any }> =
    new BehaviorSubject<{ [key: string]: any }>({});
  filtersObsrvable: BehaviorSubject<{ [key: string]: any }> =
    new BehaviorSubject<{ [key: string]: any }>({});
  roomsObserver: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
    const data = localStorage.getItem('room-list');
    if (data) {
      this.roomsObserver.next(JSON.parse(data));
      this.roomData = (JSON.parse(data))
    } else {
      this.roomsObserver.next(this.roomData);
      localStorage.setItem('room-list', JSON.stringify(this.roomData))
    }
    this.featuresObservable.next(this.features);
    this.showViewBookings.next(true)
  }
  applyFilters(features: any[]): any[] {
    const filtered: any[] = [];
    const featureName: any[] = [];
    features.forEach((val) => {
      if (val.selected) {
        featureName.push(val.name);
      }
    });
    if (!featureName.length) {
      this.roomsObserver.next(this.roomData);
      return this.roomData;
    } else {
      this.roomsObserver.getValue().forEach((rooms) => {
        if (featureName.every((name) => rooms.features.includes(name))) {
          filtered.push(rooms);
        }
      });
    }
    return filtered;
  }
  applySort(capacity: string, roomData: any[]) {
    switch (capacity) {
      case 'capacity-asc':
        roomData.sort((a, b) => a.capacity - b.capacity);
        this.roomsObserver.next(roomData);
        break;
      case 'capacity-dsc':
        roomData.sort((a, b) => b.capacity - a.capacity);
        this.roomsObserver.next(roomData);
        break;
      case '':
        this.roomsObserver.next(this.roomData);
        break;
    }
  }
  getRoomByid(id: number) {
    const room = this.roomData.find(room => room.id == id)
    room ? this.viewRoom.next(room) : []
  }
  checkAvailableSlots(roomId: number, date: string): any[] {
    const room = this.roomData.find(room => room.id == roomId);

    if (!room || !room.avaibility || room.avaibility.length === 0) {
      return this.timeSlots;
    }
    const availabilityForDate = room.avaibility.find(val => val.date === date);
    if (availabilityForDate) {
      return availabilityForDate['available-timeslot'];
    } else {
      return this.timeSlots;
    }
  }
  checkBookedSlots(roomId: number, date: string): any[] {
    const room = this.roomData.find(room => room.id == roomId);
    if (!room || !room.avaibility || room.avaibility.length === 0) {
      return [];
    }
    const bookedForDate = room.avaibility.find(val => val.date === date);
    if (bookedForDate) {
      return bookedForDate['booked-timeslot'];
    } else {
      return [];
    }
  }
  updateRooms(slots: string[], id: number, date: string) {
    const room = this.roomData.find(room => room.id == id);
    if (!room) return;

    if (!room?.avaibility?.length) {
      const available = this.addAvailableSlots(slots, room);
      room?.avaibility.push({
        date: date,
        bookedSlots: [...slots],
        availableSlots: available
      });
    } else {
      let found = false;

      room?.avaibility.forEach(item => {
        if (item['date'] === date) {
          found = true;
          item['bookedSlots'] = item['bookedSlots'] || [];
          item['availableSlots'] = item['availableSlots'] || [];
          slots.forEach(slot => {
            if (!item['bookedSlots'].includes(slot)) {
              item['bookedSlots'].push(slot);
            }
          });
          item['availableSlots'] = this.updateAvailableSlots(item['bookedSlots'], this.timeSlots);
        }
      });

      if (!found) {
        const available = this.addAvailableSlots(slots, room);
        room.avaibility.push({
          date: date,
          bookedSlots: [...slots],
          availableSlots: available
        });
      }
    }

    localStorage.setItem('room-list', JSON.stringify(this.roomData));
    this.roomsObserver.next(this.roomData);
    this.viewRoom.next(room);
  }

  addAvailableSlots(bookedSlots: string[], room: Room): string[] {
    const availableSlots = this.timeSlots.filter(slot => !bookedSlots.includes(slot));
    return availableSlots;
  }
  updateAvailableSlots(bookedSlots: string[], available: string[]): string[] {
    const updated = available.filter(slot => !bookedSlots.includes(slot))
    return updated
  }
  cancelSlot(slot: string, booking: { [key: string]: any }) {
    const room = this.roomData.find(room => room.id == booking['roomId'])
    console.log(room, "list")
    if (!room) return
    room?.avaibility.forEach(items => {
      if (items['date'] == booking['date']) {
        const index = items.bookedSlots.findIndex((slots: string) => slots === slot)
        items.bookedSlots.splice(index, 1)
        items.availableSlots.push(slot)
      }
    })
    localStorage.setItem('room-list', JSON.stringify(this.roomData))
    this.viewRoom.next(room)
  }
}
