import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {PhotoViewerViewController} from '../viewer/photo-viewer-view-controller';
import {PhotoViewer} from '../viewer/photo-viewer';
import {TRANSITION_IN_KEY} from '../viewer/photo-viewer-transition';
import {UnsplashItUtil} from '../../utils/unsplash-it-util';
import {ViewPortUtil} from '../../utils/viewport-util';
import {ImageEntity} from '../../utils/image-entity';

@Component({
  template: `
    <ion-navbar *navbar primary>
        <ion-title>Image Gallery</ion-title>
        <ion-buttons end>
            <button (press)="loadGallery()">
                <ion-icon name="refresh"></ion-icon>
            </button>
        </ion-buttons>
    </ion-navbar>
    <ion-content>

      <div [virtualScroll]="images">
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

  private images: ImageEntity[] = [];
  private imageSize: number;
  private galleryLoaded: boolean = false;

  constructor(private nav: NavController, private unsplashItUtil: UnsplashItUtil, private viewPortUtil: ViewPortUtil) {
  }

  ionViewWillEnter() {
    this.imageSize = this.setDimensions();
    if ( ! this.galleryLoaded ) {
      this.loadGallery();
    }
  }

  loadGallery() {
    this.galleryLoaded = true;
    this.unsplashItUtil.getListOfImages(this.imageSize).then(imageEntities => {
      this.images = imageEntities;
    });
  }

  setDimensions() {
    let screenWidth = this.viewPortUtil.getWidth();
    let potentialNumColumns = Math.floor(screenWidth / 120);
    let numColumns = potentialNumColumns > MIN_NUM_COLUMNS ? potentialNumColumns : MIN_NUM_COLUMNS;
    return Math.floor(screenWidth / numColumns);
  }

  imageClicked(imageEntity: ImageEntity, event: Event) {
    let rect = (<HTMLElement> event.target).getBoundingClientRect();
    let modal = PhotoViewerViewController.create({
      imageEntity: imageEntity
    });
    this.nav.present(modal, {
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
}

const NUM_IMAGES: number = 500;
const MIN_NUM_COLUMNS: number = 3;
const MARGIN: number = 10;
