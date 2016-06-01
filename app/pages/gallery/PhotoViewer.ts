import {ElementRef, ViewChild} from "@angular/core";
import {Animation, NavController, NavParams, Page, Transition, TransitionOptions, ViewController} from "ionic-angular";

import {getModalDimensions} from "./PhotoViewerTransition";
import {UnsplashItUtil} from "../../utils/UnsplashItUtil";
import {ImageEntity} from "../../utils/ImageEntity";


@Page({
  template: `
    <ion-content style="background-color: transparent;">
        <div class="backdrop" #backdrop></div>
        <div class="wrapper">
          <div class="contentContainer" #contentContainer (touchstart)="touchStart($event)" (touchend)="touchEnd($event)"  (touchmove)="touchMove($event)">
          </div>
          <img class="pv-image" #image [src]="imageEntity?.mediumSizeUrl"/>
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
    @ViewChild("image") imageEle:ElementRef;

    constructor(private navController:NavController, private navParams:NavParams, private viewController:ViewController){
      this.imageEntity = this.navParams.data.imageEntity;
    }

    onPageWillEnter(){
      this.initialTouch = this.mostRecentTouch = null;
    }

    onPageDidEnter(){
      let tempImage = <HTMLImageElement> document.createElement("IMG");
      tempImage.onload = () => {
        let parentWidth = this.contentContainer.nativeElement.clientWidth;
        let parentHeight = this.contentContainer.nativeElement.clientHeight;
        const SIZE = getModalDimensions().useableWidth;
        this.imageEle.nativeElement.style.transition = null;
        this.imageEle.nativeElement.style.transform = null;
        this.imageEle.nativeElement.style.width = `${SIZE}px`;
        this.imageEle.nativeElement.style.height = `${SIZE}px`;
        this.imageEle.nativeElement.style.top = `${Math.floor(parentHeight/2 - SIZE/2)}px`;
        this.imageEle.nativeElement.style.left = `${Math.floor(parentWidth/2 - SIZE/2)}px`;
        this.imageEle.nativeElement.src = this.imageEntity.fullSizeUrl;
      };
      tempImage.src = this.imageEntity.fullSizeUrl;
    }

    dismissView(){
        this.viewController.dismiss();
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
        this.imageEle.nativeElement.style.transform = `translate3d(0px, ${differenceY}px, 0px)`;
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
                this.imageEle.nativeElement.style.transform = `translate3d(0px, ${-window.innerHeight - 20}px, 0px)`;
            }
            else{
                this.imageEle.nativeElement.style.transform = `translate3d(0px, ${window.innerHeight + 20}px, 0px)`;
            }
            this.imageEle.nativeElement.style.transition = `300ms ease`;
        }
        else{
            this.imageEle.nativeElement.style.transform = `translate3d(0px, 0px, 0px)`;
            this.imageEle.nativeElement.style.transition = `250ms ease`;
            //parent.style.opacity = `1.0`;
            this.animationButtonContainerIn();
            this.animateBackdropFadeReverse();
        }
        setTimeout(() => {
            if ( dismiss ){
                this.dismissView();
            }
            this.imageEle.nativeElement.style.transition = null;
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
