import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { timeParts } from 'src/app/timeParts';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit {

  public running: boolean = false;
  public timeParts: timeParts = {hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
  public isFullscreen = false;
  private interval!: any;
  private startTime: number = 0;
  private stopTime: number = 0;
  private diff: number = 0;

  @ViewChild('fullScreen', { read: ElementRef }) containerElement!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  updateDisplayedTime() {
    this.diff = this.startTime ? (this.stopTime || Date.now()) - this.startTime : 0;
    const diffAsDate = new Date(this.diff);
    const hours = diffAsDate.getUTCHours();
    const minutes = diffAsDate.getUTCMinutes();
    const seconds = diffAsDate.getUTCSeconds();
    const milliseconds = diffAsDate.getUTCMilliseconds();
    this.timeParts = { hours, minutes, seconds, milliseconds };
  }

  start(): void {
    this.running = true;
    this.startTime = Date.now() - this.diff;
    this.stopTime = 0;
    this.run();
  }

  stop(): void {
    this.running = false;
    clearInterval(this.interval);
    this.interval = null;
    this.stopTime = Date.now();
  }

  run(): void {
    this.interval = setInterval(this.updateDisplayedTime.bind(this), 100)
  }

  reset(): void {
    this.startTime = 0;
    this.updateDisplayedTime();
    // this hopefully isn't needed, but might be if there are milliseconds b/w the first line of this func and the 1st line in updateDisplayedTime()
    // this.timeParts = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    this.stop();
  }

  openFullscreen() {
    const elem = this.containerElement.nativeElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    this.isFullscreen = true;
  }

  closeFullscreen() {
    document.exitFullscreen()
  }

  fullScreenChangeHandler(e: Event) {
    if (!document.fullscreenElement) {
      this.isFullscreen = false;
    }
  }

}
