import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

import {PhotoViewerController} from '../viewer/photo-viewer-view-controller';
import {PhotoViewer} from '../viewer/photo-viewer';
import {TRANSITION_IN_KEY} from '../viewer/photo-viewer-transition';
import {UnsplashItUtil} from '../../utils/unsplash-it-util';
import {ViewPortUtil} from '../../utils/viewport-util';
import {ImageEntity} from '../../utils/image-entity';

@Component({
  template: `
    <ion-header class="transparent-header">
      <ion-navbar primary>
          <ion-title>Image Gallery</ion-title>
          <ion-buttons end>
              <button (press)="loadGallery()">
                  <ion-icon name="refresh"></ion-icon>
              </button>
          </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content #content fullscreen="true">

      <div [virtualScroll]="images" [approxItemHeight]="imageSize + 'px'" [approxItemWidth]="imageSize + 'px'" [bufferRatio]="5">
        <div *virtualItem="let imageEntity" class="image-container"
          [style.width]="imageSize + 'px'" [style.height]="imageSize + 'px'"
          (click)="imageClicked(imageEntity, $event)">
          <ion-img [src]="imageEntity.mediumSizeUrl" class="image" tappable></ion-img>
        </div>
      </div>
    </ion-content>
  `
})
export class GalleryPage {

  @ViewChild('content', { read: ElementRef}) contentRef: ElementRef;
  private images: ImageEntity[] = [];
  private imageSize: number;
  private galleryLoaded: boolean = false;

  constructor(private nav: NavController, private photoViewerController: PhotoViewerController, private unsplashItUtil: UnsplashItUtil, private viewPortUtil: ViewPortUtil) {
  }

  ionViewWillEnter() {
    this.setImageSize();
    if ( ! this.galleryLoaded ) {
      this.loadGallery();
    }
  }

  setImageSize() {
    this.imageSize = this.setDimensions();
  }

  loadGallery() {
    this.galleryLoaded = true;
    this.unsplashItUtil.getListOfImages(this.imageSize).then(imageEntities => {
      this.images = imageEntities;
      for ( let image of this.images ) {
        (<any>image).color = this.generateRandomColor();
      }
    });
  }

  setDimensions() {
    let contentWidth = this.contentRef.nativeElement.offsetWidth;
    let potentialNumColumns = Math.floor(contentWidth / MIN_DESIRED_IMAGE_SIZE);
    let calculatedNumColumns = Math.min(MAX_NUM_COLUMNS, potentialNumColumns);
    let numColumns = Math.max(calculatedNumColumns, MIN_NUM_COLUMNS);
    return Math.floor(contentWidth / numColumns);
  }

  imageClicked(imageEntity: ImageEntity, event: Event) {
    let rect = (<HTMLElement> event.target).getBoundingClientRect();
    let modal = this.photoViewerController.create({
      imageEntity: imageEntity
    });
    modal.present({
      ev: {
        startX: rect.left,
        startY: rect.top,
        width: rect.width,
        height: rect.height,
        viewportHeight: this.viewPortUtil.getHeight(),
        viewportWidth: this.viewPortUtil.getWidth()
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewPortUtil.update();
    this.setImageSize();
    // force a new virtual layout
    this.images = this.images.concat();
  }

  generateRandomColor(){
    let value = Math.random() * 100;
    if ( value < 10 ) {
      return 'yellow';
    }
    else if ( value < 20 ) {
      return 'red';
    }
    else if ( value < 30 ) {
      return 'blue';
    }
    else if ( value < 40 ) {
      return 'green';
    }
    else if ( value < 50 ) {
      return 'rebeccapurple';
    }
    else if ( value < 60 ) {
      return 'orange';
    }
    else if ( value < 70 ) {
      return 'lime';
    }
    else if ( value < 80 ) {
      return 'pink';
    }
    else if ( value < 90 ) {
      return 'black';
    }
    else if ( value < 100 ) {
      return 'grey';
    }
  }
}

const MIN_DESIRED_IMAGE_SIZE = 120;
const NUM_IMAGES: number = 500;
const MIN_NUM_COLUMNS: number = 3;
const MAX_NUM_COLUMNS: number = 5;
const MARGIN: number = 10;
