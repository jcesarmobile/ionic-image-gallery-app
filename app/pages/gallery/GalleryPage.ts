import {Modal, NavController, Page} from "ionic-angular";

import {PhotoViewer, TRANSITION_KEY} from "./PhotoViewer";
import {UnsplashItUtil} from "../../utils/UnsplashItUtil";
import {ImageEntity} from "../../utils/ImageEntity";

@Page({
  template: `
    <ion-navbar *navbar primary>
        <ion-title>Image Gallery</ion-title>
        <ion-buttons end>
            <button (click)="loadGallery()">
                <ion-icon name="refresh"></ion-icon>
            </button>
        </ion-buttons>
    </ion-navbar>
    <ion-content>

      <div [virtualScroll]="images">
        <div *virtualItem="let imageEntity" class="image-container"
          [style.width]="IMAGE_SIZE + 'px'" [style.height]="IMAGE_SIZE + 'px'"
          (click)="imageClicked(imageEntity, $event)">
          <ion-img [src]="imageEntity.mediumSizeUrl" class="image" tappable></ion-img>
        </div>
      </div>
    </ion-content>
  `
})
export class GalleryPage {

  private images:ImageEntity[];
  private NUM_IMAGES:number = 500;
  private NUM_COLUMNS:number = 3;
  private MARGIN:number = 10;
  private IMAGE_SIZE:number;
  private galleryLoaded:boolean;

  constructor(private navController:NavController, private unsplashItUtil:UnsplashItUtil) {
    this.images = [];
    this.galleryLoaded = false;
  }

  onPageWillEnter(){
    this.IMAGE_SIZE = this.setDimensions();
    if ( ! this.galleryLoaded ){
      this.loadGallery();
    }
  }

  loadGallery(){
    this.galleryLoaded = true;
    this.unsplashItUtil.getListOfImages(this.IMAGE_SIZE).then(imageEntities =>{
      this.images = imageEntities;
    });
  }

  setDimensions(){
    return Math.floor(window.innerWidth/this.NUM_COLUMNS);
  }

  imageClicked(imageEntity:ImageEntity, event:Event){
    var coordinate = this.getLocationOfTouch(event);
    let modal = Modal.create(PhotoViewer, {
    //let modal = FadeModal.create(ModalPage, {
      imageEntity:imageEntity
    });
    this.navController.present(modal, {
      animation: TRANSITION_KEY,
      /*transitionData: {
        startX: coordinate.x,
        startY: coordinate.y,
        width: (<any>event.target).clientWidth,
        hieght: (<any>event.target).clientHeight
      }
      */
    });
  }

  getLocationOfTouch(event:Event){
    if ( event instanceof MouseEvent ){
      let mouseEvent = <MouseEvent> event;
      return {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      };
    }
    else{
      let touchEvent = <TouchEvent> event;
      if ( touchEvent.touches && touchEvent.touches.length > 0 ){
        return {
          x: touchEvent.touches[0].clientX,
          y: touchEvent.touches[0].clientY
        };
      }
      throw new Error("Could not get touches");
    }
  }
}
