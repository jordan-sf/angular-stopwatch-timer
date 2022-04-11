import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { elementAt } from 'rxjs';
import { timeParts } from 'src/app/timeParts';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements AfterViewInit {
  public doingTimerInput: boolean = false;
  public running: boolean = false;
  public timerInput = {hours: "", minutes: "", seconds: ""};
  public timeParts: timeParts = {hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
  public canStart = false;
  public alarmPlaying = false;
  public inAlarmState = false;
  public isFullscreen = false;
  public progressBarValue = 0;
  private timerLengthInMilliseconds: number = 0;
  private interval!: any;
  private startTime: number = 0;
  private stopTime: number = 0;
  private endTime: number = 0;
  private diff: number = 0;

  @ViewChild('fullScreen', { read: ElementRef }) containerElement!: ElementRef;
  @ViewChild('audioElement', { read: ElementRef }) audioElement!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
  }

  updateDisplayedTime() {
    this.diff = this.endTime ? this.endTime - (this.stopTime || Date.now()) : 0;
    this.diff = Math.max(0, this.diff);
    const diffAsDate = new Date(this.diff);
    const hours = diffAsDate.getUTCHours();
    const minutes = diffAsDate.getUTCMinutes();
    const seconds = diffAsDate.getUTCSeconds();
    const milliseconds = diffAsDate.getUTCMilliseconds();
    this.timeParts = { hours, minutes, seconds, milliseconds };
    if (!this.diff) {
      this.stop();
      this.inAlarmState = true;
      this.rewindAlarm();
      this.playAlarm();
    }
    this.progressBarValue = Math.max(0, (this.diff / this.timerLengthInMilliseconds) * 100);
  }

  start(): void {
    this.running = true;
    this.startTime = Date.now();
    this.stopTime = 0;
    this.endTime = this.startTime + this.timerLengthInMilliseconds;
    this.pauseAlarm();
    this.run();
  }

  stop(): void {
    this.running = false;
    clearInterval(this.interval);
    this.interval = null;
    this.stopTime = Date.now();

    const diffAsDate = new Date(this.diff);
    const hours = diffAsDate.getUTCHours();
    const minutes = diffAsDate.getUTCMinutes();
    const seconds = diffAsDate.getUTCSeconds();
    const milliseconds = diffAsDate.getUTCMilliseconds();
    this.timerInput = { hours: hours.toString(), minutes: minutes.toString(), seconds: seconds.toString() };

    this.timerLengthInMilliseconds = this.diff;
    this.canStart = Boolean(hours || minutes || seconds || milliseconds);
  }

  run(): void {
    this.interval = setInterval(this.updateDisplayedTime.bind(this), 100)
  }

  reset(): void {
    this.startTime = 0;
    this.stopTime = 0;
    this.endTime = 0;
    this.diff = 0;
    this.timerLengthInMilliseconds = 0;
    this.updateDisplayedTime();
    // this hopefully isn't needed, but might be if there are milliseconds b/w the first line of this func and the 1st line in updateDisplayedTime()
    // this.timeParts = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    this.stop();
    this.inAlarmState = false;
    this.pauseAlarm();
  }

  setTimer() {
    this.pauseAlarm();
    this.inAlarmState = false;
    const hours = parseInt(this.timerInput.hours) || 0;
    const minutes = parseInt(this.timerInput.minutes) || 0;
    const seconds = parseInt(this.timerInput.seconds) || 0;

    this.timerLengthInMilliseconds = hours * 3600 + minutes * 60 + seconds;
    this.timerLengthInMilliseconds *= 1000;

    this.timeParts = { hours, minutes, seconds, milliseconds: 0 };

    this.canStart = Boolean(hours || minutes || seconds);
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

  playAlarm() {
    const element = this.audioElement.nativeElement;
    element.play().then(() => this.alarmPlaying = true);
  }

  pauseAlarm() {
    const element = this.audioElement.nativeElement;
    element.pause();
    this.alarmPlaying = false;
  }

  rewindAlarm() {
    const element = this.audioElement.nativeElement;
    element.currentTime = 0.0;
  }
}
