import {ElementRef} from '@angular/core';
import {Animation, Transition, TransitionOptions, ViewController} from 'ionic-angular';

import {PhotoViewerViewController} from './photo-viewer-view-controller';

export const TRANSITION_IN_KEY: string = 'photoViewerEnter';
export const TRANSITION_OUT_KEY: string = 'photoViewerLeave';

export class TwitterStylePhotoInTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    // DOM READS
    let ele = <HTMLElement> enteringView.pageRef().nativeElement;
    ele.classList.add('show-page');
    let image = <HTMLElement> ele.querySelector('.scaled-image');
    let backdrop = ele.querySelector('ion-backdrop');
    let contentContainer = ele.querySelector('.contentContainer');
    let contentContainerRect = contentContainer.getBoundingClientRect();
    let imageAnimation = new Animation(image);
    let backdropAnimation = new Animation(backdrop);
    let contentContainerAnimation = new Animation(contentContainer);

    let modalDimensions = getModalDimensions(opts.ev.viewportHeight, opts.ev.viewportWidth);

    let scale = modalDimensions.useableWidth / opts.ev.width;

    let centeredXOffset = (modalDimensions.totalWidth - modalDimensions.useableWidth) / 2;
    let rectangleCenterX = opts.ev.startX + (opts.ev.width / 2);
    let scaledRectangleWidth = opts.ev.width * scale;
    let scaledLeftEdge = rectangleCenterX - (scaledRectangleWidth / 2);
    let xTransform = (0 - scaledLeftEdge + centeredXOffset + contentContainerRect.left) / scale;

    let centeredYOffset = (modalDimensions.totalHeight - modalDimensions.useableHeight) / 2;
    let rectangleCenterY = opts.ev.startY + (opts.ev.height / 2);
    let scaledRectangleHeight = opts.ev.height * scale;
    let centerY = modalDimensions.useableHeight / 2;
    let yDifference = (centerY - rectangleCenterY + centeredYOffset + contentContainerRect.top) / scale;

    // we can skip some complicated math if we store this to re-use later
    opts.ev.transitionData = {
      scale: scale,
      xTransform: xTransform,
      yDifference: yDifference
    };


    // DOM writes
    image.style.position = 'absolute';
    image.style.top = `${opts.ev.startY}px`;
    image.style.left = `${opts.ev.startX}px`;
    image.style.width = `${opts.ev.width}px`;
    image.style.height = `${opts.ev.height}px`;

    imageAnimation.fromTo('scale', `1.0`, `${scale}`);
    imageAnimation.fromTo('translateX', `${0}px`, `${xTransform}px`);
    imageAnimation.fromTo('translateY', `${0}px`, `${yDifference}px`);
    backdropAnimation.fromTo('opacity', '0.01', '1.0');
    contentContainerAnimation.fromTo('opacity', '0.01', '1.0');

    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(300)
      .before.addClass('show-page')
      .add(imageAnimation)
      .add(backdropAnimation)
      .add(contentContainerAnimation);
  }
}
export class TwitterStylePhotoOutTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: PhotoViewerViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    // if we did a swipe to dismiss, skip this transition
    if ( ! leavingView.isAlreadyDismissed ) {
      // DOM reads
      let ele = leavingView.pageRef().nativeElement;
      let image = ele.querySelector('.scaled-image');
      let backdrop = ele.querySelector('ion-backdrop');
      let contentContainer = ele.querySelector('.contentContainer');
      let imageAnimation = new Animation(image);
      let backdropAnimation = new Animation(backdrop);
      let contentContainerAnimation = new Animation(contentContainer);

      let modalDimensions = getModalDimensions(opts.ev.viewportHeight, opts.ev.viewportWidth);

      // figure out the scale to move to
      let scale = modalDimensions.useableWidth / opts.ev.width;

      // DOM writes
      if ( !opts.ev.skipImageTransition ) {
        imageAnimation.fromTo('scale', `${scale}`, `${1.0}`);
        imageAnimation.fromTo('translateX', `${opts.ev.transitionData.xTransform}px`, `${0}px`);
        imageAnimation.fromTo('translateY', `${opts.ev.transitionData.yDifference}px`, `${0}px`);
      }
      backdropAnimation.fromTo('opacity', `${backdrop.style.opacity}`, '0.01');
      contentContainerAnimation.fromTo('opacity', `${contentContainer.style.opacity}`, '0.01');

      this.element(enteringView.pageRef()).easing('ease').duration(300)
        .add(imageAnimation)
        .add(backdropAnimation)
        .add(contentContainerAnimation);
    }
    else{
      // the animation is done, but the transition still needs to run, so let's just fake it
      this.element(enteringView.pageRef()).duration(1);
    }
  }
}

// provide these values to avoid a dom read
export function getModalDimensions(viewportHeight: number, viewportWidth: number) {
  const MIN_WIDTH_INSET = 768;
  const MIN_LARGE_HEIGHT_INSET = 768;
  const INSET_MODAL_WIDTH = 700;
  const INSET_MODAL_HEIGHT = 700;

  if ( viewportHeight >= MIN_WIDTH_INSET && viewportWidth >= MIN_LARGE_HEIGHT_INSET ) {
    return {
      totalWidth: INSET_MODAL_WIDTH,
      totalHeight: INSET_MODAL_HEIGHT,
      useableWidth: INSET_MODAL_WIDTH - 100,
      useableHeight: INSET_MODAL_HEIGHT - 100
    };
  }
  return {
    totalWidth: viewportWidth,
    totalHeight: viewportHeight,
    useableWidth: viewportWidth,
    useableHeight: viewportHeight
  };
}


Transition.register(TRANSITION_IN_KEY, TwitterStylePhotoInTransition);
Transition.register(TRANSITION_OUT_KEY, TwitterStylePhotoOutTransition);
