import {ElementRef, ViewChild, Component} from "@angular/core";
import {Animation, NavController, NavParams, Transition, TransitionOptions, ViewController} from "ionic-angular";

import {getModalDimensions} from "./PhotoViewerTransition";

import {ImageEntity} from "../../utils/ImageEntity";
import {UnsplashItUtil} from "../../utils/UnsplashItUtil";
import {ViewPortUtil} from "../../utils/ViewPortUtil";

@Component({
  template: `
    <ion-content style="background-color: transparent;">
        <ion-backdrop #backdrop></ion-backdrop>
        <div class="wrapper" #wrapper>
          <div class="btn-container-wrapper" #btnContainer>
            <div class="btn-container">
              <button large clear class="pv-show-cursor" (click)="dismissView()">
                <ion-icon name="close"></ion-icon>
              </button>
            </div>
          </div>
          <div class="contentContainer" #contentContainer (touchstart)="touchStart($event)" (touchend)="touchEnd($event)"  (touchmove)="touchMove($event)">
          </div>
          <img class="scaled-image" #scaledImage [src]="imageEntity?.mediumSizeUrl" style="pointer-events: none"/>
          <img class="non-scaled-image" #nonScaledImage style="pointer-events: none"/>
        </div>
    </ion-content>
  `
})
export class PhotoViewer {

    private imageEntity:ImageEntity;

    protected initialTouch:TouchCoordinate;
    protected mostRecentTouch:TouchCoordinate;
    protected TOUCH_DISTANCE_TRAVELED_THRESHOLD:number = .50;
    protected yTransformValue:number;
    protected contentContainerRect:any;

    @ViewChild("backdrop") backdrop:ElementRef;
    @ViewChild("wrapper") wrapper:ElementRef;
    @ViewChild("contentContainer") contentContainer:ElementRef;
    @ViewChild("btnContainer") btnContainer:ElementRef;
    @ViewChild("scaledImage") scaledImageEle:ElementRef;
    @ViewChild("nonScaledImage") nonScaledImageEle:ElementRef;

    constructor(protected navController:NavController, protected navParams:NavParams, protected viewController:ViewController, protected viewPortUtil:ViewPortUtil){
      this.imageEntity = this.navParams.data.imageEntity;
    }

    onPageWillEnter(){
      this.initialTouch = this.mostRecentTouch = null;
    }

    onPageDidEnter(){
      // give a short buffer to make sure the transition is done
      setTimeout( () => {
          // DOM READ
          this.contentContainerRect = this.contentContainer.nativeElement.getBoundingClientRect();
          // DOM READ, WRITE
          this.showHighResImage();
      }, 100);

    }

    showHighResImage(){
      // DOM READS
      let parentWidth = this.wrapper.nativeElement.clientWidth;
      let parentHeight = this.wrapper.nativeElement.clientHeight;
      let dimensions = getModalDimensions(this.viewPortUtil.getHeight(), this.viewPortUtil.getWidth());
      const WIDTH = dimensions.useableWidth;
      const HEIGHT = dimensions.useableHeight;

      // DOM WRITES
      this.nonScaledImageEle.nativeElement.style.position = "absolute";
      this.nonScaledImageEle.nativeElement.style.width = `${WIDTH}px`;
      this.nonScaledImageEle.nativeElement.style.height = `${HEIGHT}px`;
      this.nonScaledImageEle.nativeElement.style.top = `${Math.floor(parentHeight/2 - HEIGHT/2)}px`;
      this.nonScaledImageEle.nativeElement.style.left = `${Math.floor(parentWidth/2 - WIDTH/2)}px`;
      this.nonScaledImageEle.nativeElement.onload = () => {
        this.scaledImageEle.nativeElement.style.display = "none";
      };
      this.nonScaledImageEle.nativeElement.src = this.imageEntity.mediumSizeUrl;
    }

    dismissView(removeImageBeforeDismiss){
        // DOM WRITES
        if ( removeImageBeforeDismiss ){
          this.wrapper.nativeElement.removeChild(this.scaledImageEle.nativeElement);
        }
        else{
          this.scaledImageEle.nativeElement.style.display = "";
        }
        this.wrapper.nativeElement.removeChild(this.nonScaledImageEle.nativeElement);

        this.viewController.dismiss(null, null, {
          ev: {
            skipImageTransition: removeImageBeforeDismiss
          }
        });
    }

    touchStart(event){
        this.initialTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);
        this.mostRecentTouch = this.initialTouch;
        this.animateButtonContainerOut();
    }

    touchMove(event){
        // calculate the difference between the coordinates
        this.mostRecentTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);
        var previousYTransform = this.yTransformValue;
        this.yTransformValue = this.mostRecentTouch.y - this.initialTouch.y;
        var percentageDragged = Math.abs(this.yTransformValue)/this.viewPortUtil.getHeight();
        this.doMoveAnimation(previousYTransform, this.yTransformValue, percentageDragged);
    }

    touchEnd(event){
        // figure out if the percentage of the distance traveled exceeds the threshold
        // if it does, dismiss the window,
        // otherwise, reset to the original position
        let viewportHeight = this.viewPortUtil.getHeight();
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var percentageDragged = Math.abs(differenceY)/viewportHeight;
        if ( percentageDragged >= this.TOUCH_DISTANCE_TRAVELED_THRESHOLD ){
            this.doSwipeToDismissAnimation(viewportHeight, differenceY);
        }
        else{
            this.doResetAnimation();
        }

    }

    doSwipeToDismissAnimation(viewPortHeight:number, differenceY:number){
      let animation = new Animation(this.nonScaledImageEle);
      if ( differenceY < 0 ){
        animation.fromTo("translateY", `${this.yTransformValue}px`, `${0 - viewPortHeight - 20}px`);
      }
      else{
        animation.fromTo("translateY", `${this.yTransformValue}px`, `${viewPortHeight + 20}px`);
      }
      animation.onFinish( () => {
        this.dismissView(true);
      });
      animation.duration(300).easing("ease").play();
    }

    doMoveAnimation(previousYValue:number, newYalue:number, percentDragged:number){
      let animation = new Animation(this.backdrop);
      let backdropAnimation = new Animation(this.backdrop);
      backdropAnimation.fromTo("opacity", this.backdrop.nativeElement.style.opacity, `${1 - (percentDragged * 1.25)}`);
      let imageAnimation = new Animation(this.nonScaledImageEle);
      imageAnimation.fromTo("translateY", `${previousYValue}px`, `${newYalue}px`);
      animation.add(backdropAnimation).add(imageAnimation).play();
    }

    doResetAnimation(){
      let animation = new Animation(this.backdrop);
      let backdropAnimation = new Animation(this.backdrop);
      backdropAnimation.fromTo("opacity", this.backdrop.nativeElement.style.opacity, "1.0");
      let buttonAnimation = new Animation(this.btnContainer);
      buttonAnimation.fromTo('translateY', `-100px`, `0px`);
      let imageAnimation = new Animation(this.nonScaledImageEle);
      imageAnimation.fromTo("translateY", `${this.yTransformValue}px`, `0px`);
      animation.duration(250).easing("ease").add(backdropAnimation).add(buttonAnimation).add(imageAnimation).play();
    }

    animateButtonContainerOut(){
      let animation = new Animation(this.btnContainer.nativeElement);
      animation.fromTo('translateY', `0px`, `-100px`);
      animation.easing("ease").play();
    }
}



class TouchCoordinate {
    constructor(public x:number, public y:number){}
}
