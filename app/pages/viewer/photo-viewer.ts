import {ElementRef, ViewChild, Component} from "@angular/core";
import {Animation, DragGesture, NavController, NavParams, Transition, TransitionOptions, ViewController} from "ionic-angular";

import {getModalDimensions} from "./photo-viewer-transition";

import {ImageEntity} from "../../utils/image-entity";
import {UnsplashItUtil} from "../../utils/unsplash-it-util";
import {ViewPortUtil} from "../../utils/viewport-util";

import {GestureDirection} from "../../utils/gestures/gesture-direction";
import {DragGestureRecognizer} from "../../utils/gestures/drag-gesture-recognizer";
import {DragGestureRecognizerProvider} from "../../utils/gestures/drag-gesture-recognizer-provider";

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
          <div class="contentContainer" #contentContainer>
          </div>
          <img class="scaled-image" #scaledImage [src]="imageEntity?.mediumSizeUrl" style="pointer-events: none"/>
          <img class="non-scaled-image" #nonScaledImage style="pointer-events: none"/>
        </div>
    </ion-content>
  `
})
export class PhotoViewer {

    private imageEntity:ImageEntity;

    protected contentContainerRect:any;
    protected dragGesture: DragGestureRecognizer;

    protected initialTouch:TouchCoordinate;
    protected mostRecentTouch:TouchCoordinate;
    protected TOUCH_DISTANCE_TRAVELED_THRESHOLD:number = .40;
    protected yTransformValue:number;

    protected onPanStartSubscription: any;
    protected onPanMoveSubscription: any;
    protected onPanEndSubscription: any;

    @ViewChild("backdrop") backdrop:ElementRef;
    @ViewChild("wrapper") wrapper:ElementRef;
    @ViewChild("contentContainer") contentContainer:ElementRef;
    @ViewChild("btnContainer") btnContainer:ElementRef;
    @ViewChild("scaledImage") scaledImageEle:ElementRef;
    @ViewChild("nonScaledImage") nonScaledImageEle:ElementRef;

    constructor(protected navController:NavController, protected navParams:NavParams, protected viewController:ViewController, protected viewPortUtil:ViewPortUtil, protected dragGestureRecognizerProvider:DragGestureRecognizerProvider){
      this.imageEntity = this.navParams.data.imageEntity;
    }

    ionViewWillEnter(){
      //this.dragGesture = new CustomDragGesture(this.contentContainer, this, this.viewPortUtil);
      this.dragGesture = this.dragGestureRecognizerProvider.getGestureRecognizer(this.contentContainer, {threshold: 1, direction: GestureDirection.ALL});
      this.dragGesture.listen();
      this.onPanStartSubscription = this.dragGesture.onPanStart.subscribe(event => this.onDragStart(event));
      this.onPanMoveSubscription = this.dragGesture.onPanMove.subscribe(event => this.onDrag(event));
      this.onPanEndSubscription = this.dragGesture.onPanEnd.subscribe(event => this.onDragEnd(event));
    }

    ionViewDidEnter(){
      // give a short buffer to make sure the transition is done
      setTimeout( () => {
          // DOM READ
          this.contentContainerRect = this.contentContainer.nativeElement.getBoundingClientRect();
          // DOM READ, WRITE
          this.showHighResImage();
      }, 100);
    }

    ionViewWillLeave(){
      this.dragGesture.unlisten();
      this.dragGesture = null;
      this.onPanStartSubscription();
      this.onPanMoveSubscription();
      this.onPanEndSubscription();
    }

    showHighResImage(){
      // DOM READS
      let parentWidth = this.wrapper.nativeElement.clientWidth;
      let parentHeight = this.wrapper.nativeElement.clientHeight;
      let dimensions = getModalDimensions(this.viewPortUtil.getHeight(), this.viewPortUtil.getWidth());
      const WIDTH = dimensions.useableWidth;

      // DOM WRITES
      this.nonScaledImageEle.nativeElement.style.position = "absolute";
      this.nonScaledImageEle.nativeElement.style.width = `${WIDTH}px`;
      this.nonScaledImageEle.nativeElement.style.height = `${WIDTH}px`;
      this.nonScaledImageEle.nativeElement.style.top = `${Math.floor(parentHeight/2 - WIDTH/2)}px`;
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

    doSwipeToDismissAnimation(viewPortHeight:number, differenceY:number, newYValue:number, velocity:number){
      let animation = new Animation(this.nonScaledImageEle, {renderDelay:0 });
      let to: number;
      if ( differenceY < 0 ){
        to = 0 - viewPortHeight - 20;
        animation.fromTo("translateY", `${newYValue}px`, `${to}px`);
      }
      else{
        to = viewPortHeight + 20;
        animation.fromTo("translateY", `${newYValue}px`, `${to}px`);
      }
      animation.onFinish( () => {
        this.dismissView(true);
      });
      let distanceTraveled = Math.abs(to - newYValue);
      let time = distanceTraveled/velocity;
      if ( time > 300 ){
        time = 300;
      }
      animation.duration(time).easing("ease").play();
    }

    doMoveAnimation(previousYValue:number, newYalue:number, percentDragged:number){
      let animation = new Animation(this.backdrop, {renderDelay: 0});
      let backdropAnimation = new Animation(this.backdrop, {renderDelay: 0});
      backdropAnimation.fromTo("opacity", this.backdrop.nativeElement.style.opacity, `${1 - (percentDragged * 1.25)}`);
      let imageAnimation = new Animation(this.nonScaledImageEle, {renderDelay: 0});
      imageAnimation.fromTo("translateY", `${previousYValue}px`, `${newYalue}px`);
      animation.add(backdropAnimation).add(imageAnimation).play();
    }

    doResetAnimation(newYValue:number){
      let animation = new Animation(this.backdrop, {renderDelay: 0});
      let backdropAnimation = new Animation(this.backdrop, {renderDelay: 0});
      backdropAnimation.fromTo("opacity", this.backdrop.nativeElement.style.opacity, "1.0");
      let buttonAnimation = new Animation(this.btnContainer, {renderDelay: 0});
      buttonAnimation.fromTo('translateY', `-100px`, `0px`);
      let imageAnimation = new Animation(this.nonScaledImageEle, {renderDelay: 0});
      imageAnimation.fromTo("translateY", `${newYValue}px`, `0px`);
      animation.duration(250).easing("ease").add(backdropAnimation).add(buttonAnimation).add(imageAnimation).play();
    }

    animateButtonContainerOut(){
      let animation = new Animation(this.btnContainer.nativeElement, {renderDelay: 0});
      animation.fromTo('translateY', `0px`, `-100px`);
      animation.easing("ease").duration(250).play();
    }

    onDragStart(event:HammerInput):void{
      this.initialTouch = new TouchCoordinate(event.center.x, event.center.y);
      this.mostRecentTouch = this.initialTouch;
      this.animateButtonContainerOut();
    }

    onDrag(event:HammerInput):void{
      // calculate the difference between the coordinates
      this.mostRecentTouch = new TouchCoordinate(event.center.x, event.center.y);
      let previousYTransform = this.yTransformValue;
      this.yTransformValue = this.mostRecentTouch.y - this.initialTouch.y;
      let percentageDragged = Math.abs(this.yTransformValue)/this.viewPortUtil.getHeight();
      this.doMoveAnimation(previousYTransform, this.yTransformValue, percentageDragged);
    }

    onDragEnd(event:HammerInput):void{
      // figure out if the percentage of the distance traveled exceeds the threshold
      // if it does, dismiss the window,
      // otherwise, reset to the original position
      let yVelocity = Math.abs(event.velocity);
      let viewportHeight = this.viewPortUtil.getHeight();
      let differenceY = this.mostRecentTouch.y - this.initialTouch.y;
      let percentageDragged = Math.abs(differenceY)/viewportHeight;
      if ( yVelocity > .2 || percentageDragged >= this.TOUCH_DISTANCE_TRAVELED_THRESHOLD ){
          this.doSwipeToDismissAnimation(viewportHeight, differenceY, this.yTransformValue, yVelocity);
      }
      else{
          this.doResetAnimation(this.yTransformValue);
      }
    }
}

class TouchCoordinate {
    constructor(public x:number, public y:number){}
}
