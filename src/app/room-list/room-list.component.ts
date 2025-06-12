import { Component, OnInit } from '@angular/core';
import { RoomListService } from '../room-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  roomData !: any[]
  capacitySelect !: string
  features !: any[]

  constructor(private roomListService: RoomListService, private router: Router) { }

  ngOnInit(): void {
    this.roomListService.showViewBookings.next(true);
    this.features = this.roomListService.features
    this.roomListService.roomsObserver.subscribe(data => {
      this.roomData = data
    })
    this.roomListService.featuresObservable.subscribe(data => {
      this.features = data
    })
  }

  onSelect() {
    this.roomListService.applySort(this.capacitySelect, this.roomData)
  }

  onCheckboxSelect(i: number, checked: boolean) {
    this.features[i].selected = checked
    this.roomListService.featuresObservable.next(this.features)
    const data = this.roomListService.applyFilters(this.features)
    data ? this.roomData = data : this.roomData

  }
reset() {
  this.features.forEach(feature => feature.selected = false);
  this.roomListService.featuresObservable.next(this.features);
  this.capacitySelect = '';
  this.roomData = [...this.roomListService.roomData];
  this.roomListService.roomsObserver.next(this.roomData);
}

  onBookNow(id: number, index: number) {
    this.router.navigate(['view-room'], { queryParams: { id: id } })
    this.roomListService.viewRoom.next((this.roomData[index]))
  }
}


  // next: () => {
  //           this.snackBar.open('Image deleted', 'Close', { duration: 3000 });
  //           this.fetchImages();
  //           this.images = this.images.filter(image => image.id !== imageId.toString());