import { Component, Input, OnInit } from '@angular/core';
import { timeParts } from 'src/app/timeParts';

@Component({
  selector: 'app-time-display',
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.scss']
})
export class TimeDisplayComponent implements OnInit {

  constructor() { }
  @Input() timeParts: timeParts = {hours: 0, minutes: 0, seconds: 0, milliseconds: 0}
  @Input() hideMilliseconds = false;
  @Input() inAlarmState = false;

  ngOnInit(): void {
  }

}
