import {Component, ElementRef, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'swipe-to-close',
  styles: [
      `
        .stc-wrapper{
            height: 100%;
            background-color: #010002;
        }

        .stc-content {
            height: 100%;
        }
      `
  ],
  template: `
    <div class="stc-wrapper">
        <div class="stc-content" (touchstart)="touchStart($event)" (touchmove)="touchMove($event)" (touchend)="touchEnd($event)">
            <ng-content></ng-content>
        </div>
    </div>
  `,
})
export class SwipeToClose{

    @Output() dismiss:EventEmitter<any> = new EventEmitter();
    protected initialTouch:TouchCoordinate;
    protected mostRecentTouch:TouchCoordinate;
    protected TOUCH_DISTANCE_TRAVELED_THRESHOLD:number = .50;


    constructor(public elementRef:ElementRef){
    }

    ngAfterViewInit(){
        this.initialTouch = this.mostRecentTouch = null;
    }

    touchStart(event:TouchEvent){
        this.initialTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);
        this.mostRecentTouch = this.initialTouch;
    }

    touchMove(event:TouchEvent){
        // calculate the difference between the coordinates
        this.mostRecentTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);;
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var percentageDragged = Math.abs(differenceY)/window.innerHeight;
        var element = <HTMLElement> document.querySelector(".stc-content");
        var parent = <HTMLElement> document.querySelector(".stc-wrapper");
        element.style.transform = `translate3d(0px, ${differenceY}px, 0px)`;
        //parent.style.opacity = `${1.0 - (1.0 * percentageDragged)}`;
    }

    touchEnd(event:TouchEvent){
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
            element.style.transition = `400ms ease`;
        }
        else{
            element.style.transform = `translate3d(0px, 0px, 0px)`;
            element.style.transition = `400ms ease`;
            //parent.style.opacity = `1.0`;
        }
        setTimeout(() => {
            if ( dismiss ){
                this.dismiss.emit({dismiss:true});
            }
            element.style.transition = null;
        }, 220);
    }
}

class TouchCoordinate {
    constructor(public x:number, public y:number){}
}
