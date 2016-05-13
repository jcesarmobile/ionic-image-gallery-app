import {Modal, NavController, Page} from "ionic-angular";

import {PhotoViewer} from "./PhotoViewer";
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
        <div *virtualItem="#imageEntity" class="image-container"
          [style.width]="IMAGE_SIZE + 'px'" [style.height]="IMAGE_SIZE + 'px'"
          (click)="imageClicked(imageEntity)">
          <ion-img [src]="imageEntity.mediumSizeUrl" class="image"></ion-img>
        </div>
      </div>
    </ion-content>
  `
})
export class GalleryPage {
  
  private images:ImageEntity[];
  private NUM_IMAGES:number = 500;
  private NUM_COLUMNS:number = 4;
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
  
  imageClicked(imageEntity:ImageEntity){
    let modal = Modal.create(PhotoViewer, {
    //let modal = FadeModal.create(ModalPage, {
      imageEntity:imageEntity
    });
    this.navController.present(modal);
  }
}