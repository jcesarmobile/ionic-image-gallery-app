import {ElementRef, ViewChild} from "@angular/core";
import {Animation, NavController, NavParams, Page, Transition, TransitionOptions, ViewController} from "ionic-angular";

import {UnsplashItUtil} from "../../utils/UnsplashItUtil";
import {ImageEntity} from "../../utils/ImageEntity";


@Page({
  template: `
    <ion-content style="background-color: transparent;">
        <div class="backdrop" #backdrop></div>
        <div class="wrapper">
          <div class="contentContainer" #contentContainer (touchstart)="touchStart($event)" (touchend)="touchEnd($event)"  (touchmove)="touchMove($event)">
          </div>
          <img class="pv-image" [src]="imageEntity?.mediumSizeUrl"/>
        </div>
    </ion-content>
  `
})
export class PhotoViewer {

    private imageDisplayStyle:string;
    private imageEntity:ImageEntity;

    protected initialTouch:TouchCoordinate;
    protected mostRecentTouch:TouchCoordinate;
    protected TOUCH_DISTANCE_TRAVELED_THRESHOLD:number = .50;

    @ViewChild("backdrop") backdrop:ElementRef;
    @ViewChild("contentContainer") contentContainer:ElementRef;
    @ViewChild("btnContainer") btnContainer:ElementRef;


    constructor(private navController:NavController, private navParams:NavParams, private viewController:ViewController){
      this.imageEntity = this.navParams.data.imageEntity;
    }

    onPageWillEnter(){
      this.initialTouch = this.mostRecentTouch = null;
    }

    dismissView(){
        this.viewController.dismiss();
    }

    imageLoaded(event){
        /*var imageAspectRatio = event.target.height/event.target.width;
        var swipeToCloseElement = (<any>document.querySelector("swipe-to-close")).children[0];
        var buttonContainer = document.querySelector(".pv-btn-container");
        var image = <HTMLElement> document.querySelector(".pv-image");
        var imageHeight = Math.floor(imageAspectRatio * swipeToCloseElement.clientWidth);
        var imageStartY = swipeToCloseElement.clientHeight/2 - imageHeight/2 - buttonContainer.clientHeight;
        image.style.transform = `translate3d(0px, ${imageStartY}px, 0px)`;
        this.imageDisplayStyle = "inline";
        */
    }

    touchStart(event){
        this.initialTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);
        this.mostRecentTouch = this.initialTouch;
        this.animateButtonContainerOut();
    }

    touchMove(event){
        // calculate the difference between the coordinates
        this.mostRecentTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);;
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var percentageDragged = Math.abs(differenceY)/window.innerHeight;
        this.contentContainer.nativeElement.style.transform = `translate3d(0px, ${differenceY}px, 0px)`;
        this.animateBackdropFade(percentageDragged);
    }

    touchEnd(event){
        // figure out if the percentage of the distance traveled exceeds the threshold
        // if it does, dismiss the window,
        // otherwise, reset to the original position
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var percentageDragged = Math.abs(differenceY)/window.innerHeight;
        var dismiss = false;
        if ( percentageDragged >= this.TOUCH_DISTANCE_TRAVELED_THRESHOLD ){
            // throw the window away and dismiss
            dismiss = true;
            if ( differenceY < 0 ){
                this.contentContainer.nativeElement.style.transform = `translate3d(0px, ${-window.innerHeight - 20}px, 0px)`;
            }
            else{
                this.contentContainer.nativeElement.style.transform = `translate3d(0px, ${window.innerHeight + 20}px, 0px)`;
            }
            this.contentContainer.nativeElement.style.transition = `300ms ease`;
        }
        else{
            this.contentContainer.nativeElement.style.transform = `translate3d(0px, 0px, 0px)`;
            this.contentContainer.nativeElement.style.transition = `250ms ease`;
            //parent.style.opacity = `1.0`;
            this.animationButtonContainerIn();
            this.animateBackdropFadeReverse();
        }
        setTimeout(() => {
            if ( dismiss ){
                this.dismissView();
            }
            this.contentContainer.nativeElement.style.transition = null;
        }, 220);
    }

    animateBackdropFade(percentageDragged){
      /*let animation = new Animation(this.backdrop.nativeElement);
      animation.fromTo('opacity', this.backdrop.nativeElement.style.opacity, `0 - ${percentageDragged}`);
      animation.play();
      */
      this.backdrop.nativeElement.style.opacity = 1 - (percentageDragged * 2.0);
    }

    animateBackdropFadeReverse(){
      let animation = new Animation(this.backdrop.nativeElement);
      animation.fromTo('opacity', this.backdrop.nativeElement.style.opacity, `1`);
      animation.easing("ease").duration(250).play();
    }

    animateButtonContainerOut(){
      /*let animation = new Animation(this.btnContainer.nativeElement);
      animation.fromTo('translateY', `0px`, `-100px`);
      animation.easing("ease").duration(250).play();
      */
    }

    animationButtonContainerIn(){
      /*let animation = new Animation(this.btnContainer.nativeElement);
      animation.fromTo('translateY', `-100px`, `0px`);
      animation.easing("ease").duration(250).play();
      */
    }
}

class TouchCoordinate {
    constructor(public x:number, public y:number){}
}
