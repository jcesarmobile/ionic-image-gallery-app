import {NavController, NavParams, Page, ViewController} from "ionic-angular";

import {UnsplashItUtil} from "../../utils/UnsplashItUtil";
import {ImageEntity} from "../../utils/ImageEntity";

@Page({
  template: `
    <div class="dm-modal-wrapper" >
        <div class="dm-modal" (touchstart)="touchStart($event)" (touchmove)="touchMove($event)" (touchend)="touchEnd($event)">
            <div class="dm-pull-right">
                <button large clear class="show-cursor" (click)="dismiss()">
                    <ion-icon name="close"></ion-icon>
                </button>
            </div>
            <img class="dm-image" [src]="imageEntity.mediumSizeUrl" *ngIf="imageEntity"
                (load)="imageLoaded($event)"
                [style.display]="imageDisplayStyle"/>
        </div>
    </div>
  `
})
export class ModalPage {
    
    private imageDisplayStyle:string;
    private imageEntity:ImageEntity;
    private initialTouch:TouchCoordinate;
    private mostRecentTouch:TouchCoordinate;
    private TOUCH_DISTANCE_TRAVELED_THRESHOLD:number = .40;
    
    constructor(private navController:NavController, private navParams:NavParams, private viewController:ViewController){    
    }
  
    onPageWillEnter(){
        this.imageDisplayStyle = "none";
        this.initialTouch = this.mostRecentTouch = null;
        this.imageEntity = this.navParams.data.imageEntity;
    }
  
    touchStart(event:TouchEvent){
        this.initialTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);
        this.mostRecentTouch = this.initialTouch;
    }
  
    touchMove(event:TouchEvent){
        // calculate the difference between the coordinates
        this.mostRecentTouch = new TouchCoordinate(event.touches[0].clientX, event.touches[0].clientY);;
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var element = <HTMLScriptElement> document.getElementsByClassName("dm-modal")[0];
        element.style.transform = `translate3d(0px, ${differenceY}px, 0px)`;
    }
  
    touchEnd(event:TouchEvent){
        // figure out if the percentage of the distance traveled exceeds the threshold
        // if it does, dismiss the window,
        // otherwise, reset to the original position
        var differenceY = this.mostRecentTouch.y - this.initialTouch.y;
        var element = <HTMLScriptElement> document.getElementsByClassName("dm-modal")[0];
        var percentageDragged = Math.abs(differenceY)/window.innerHeight;
        var dismiss = false;
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
        }
        setTimeout(() => {
            if ( dismiss ){
                this.dismiss();
            }
            element.style.transition = null;
        }, 220);
    }
    
    dismiss(){
        this.viewController.dismiss();
    }
    
    imageLoaded(event){
        var imageElement = <HTMLScriptElement> document.getElementsByClassName("dm-image")[0];
        var imageAspectRatio = event.target.height/event.target.width;
        var parent = document.getElementsByClassName("dm-modal-wrapper")[0];
        var buttonContainerHeight = document.getElementsByClassName("dm-pull-right")[0].clientHeight;
        var imageHeight = Math.floor(imageAspectRatio * parent.clientWidth);
        var imageStartY = parent.clientHeight/2 - imageHeight/2 - buttonContainerHeight;
        imageElement.style.transform = `translate3d(0px, ${imageStartY}px, 0px)`;
        this.imageDisplayStyle = "inline";
    }
}

class TouchCoordinate {
    constructor(public x:number, public y:number){
    }
}