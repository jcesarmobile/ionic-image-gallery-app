import {Component, ElementRef, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'swipe-to-close',
  styles: [
      `

      `
  ],
  template: `
    <div class="stc-wrapper">
        <div class="stc-content" (touchstart)="touchStart($event)" (touchend)="touchEnd($event)"  (touchmove)="touchMove($event)">
            <ng-content></ng-content>
        </div>
    </div>
  `,
})
export class SwipeToClose{

    @Output() dismiss:EventEmitter<any> = new EventEmitter();


    private swipeHappened:boolean;

    constructor(public elementRef:ElementRef){
    }

    ngAfterViewInit(){

    }

    touchStart(event){
        this.initialTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);
        this.mostRecentTouch = this.initialTouch;
    }

    touchMove(event){
        // calculate the difference between the coordinates
        this.mostRecentTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);;
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var percentageDragged = Math.abs(differenceY)/window.innerHeight;
        var element = <HTMLElement> document.querySelector(".stc-content");
        var parent = <HTMLElement> document.querySelector(".stc-wrapper");
        element.style.transform = `translate3d(0px, ${differenceY}px, 0px)`;
    }

    touchEnd(event){
        // figure out if the percentage of the distance traveled exceeds the threshold
        // if it does, dismiss the window,
        // otherwise, reset to the original position
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var percentageDragged = Math.abs(differenceY)/window.innerHeight;
        var dismiss = false;
        var element = <HTMLElement> document.querySelector(".stc-content");
        var parent = <HTMLElement> document.querySelector(".stc-wrapper");
        if ( percentageDragged >= this.TOUCH_DISTANCE_TRAVELED_THRESHOLD ){
            // throw the window away and dismiss
            dismiss = true;
            if ( differenceY < 0 ){
                element.style.transform = `translate3d(0px, ${-window.innerHeight - 20}px, 0px)`;
            }
            else{
                element.style.transform = `translate3d(0px, ${window.innerHeight + 20}px, 0px)`;
            }
            element.style.transition = `300ms ease`;
        }
        else{
            element.style.transform = `translate3d(0px, 0px, 0px)`;
            element.style.transition = `250ms ease`;
            //parent.style.opacity = `1.0`;
        }
        setTimeout(() => {
            if ( dismiss ){
                this.dismissView();
            }
            element.style.transition = null;
        }, 220);
    }

    swipe(event){
      console.log("event: ", event);
      this.swipeHappened = true;
    }
}
