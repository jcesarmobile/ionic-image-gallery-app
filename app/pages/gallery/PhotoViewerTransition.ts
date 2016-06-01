import {Animation, Transition, TransitionOptions, ViewController} from "ionic-angular";

export const TRANSITION_IN_KEY:string = "photoViewerEnter";
export const TRANSITION_OUT_KEY:string = "photoViewerLeave";

export class TwitterStylePhotoInTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = <HTMLElement> enteringView.pageRef().nativeElement;
    ele.classList.add("show-page");
    let image = <HTMLElement> ele.querySelector(".pv-image");
    let backdrop = ele.querySelector(".backdrop");
    let contentContainer = ele.querySelector(".contentContainer");
    let contentContainerRect = contentContainer.getBoundingClientRect();
    let imageAnimation = new Animation(image);
    let backdropAnimation = new Animation(backdrop);
    let contentContainerAnimation = new Animation(contentContainer);

    let originalDisplay = image.style.display;
    image.style.display = "none";
    image.style.position = "absolute";
    image.style.top = `${opts.ev.startY}px`;
    image.style.left = `${opts.ev.startX}px`;
    image.style.width = `${opts.ev.width}px`;
    image.style.height = `${opts.ev.height}px`;
    image.style.display = originalDisplay;

    var modalDimensions = getModalDimensions();

    // figure out the scale to move to
    let scale = modalDimensions.useableWidth/opts.ev.width;

    let centeredXOffset = (modalDimensions.totalWidth - modalDimensions.useableWidth)/2;
    let rectangleCenterX = opts.ev.startX + (opts.ev.width/2);
    let scaledRectangleWidth = opts.ev.width * scale;
    let scaledLeftEdge = rectangleCenterX - scaledRectangleWidth/2;
    let xTransform = (0 - scaledLeftEdge + centeredXOffset + contentContainerRect.left)/scale;

    let centeredYOffset = (modalDimensions.totalHeight - modalDimensions.useableHeight)/2;
    let rectangleCenterY = opts.ev.startY + (opts.ev.height/2);
    let scaledRectangleHeight = opts.ev.height * scale;
    let centerY = modalDimensions.useableHeight/2;
    let yDifference = (centerY - rectangleCenterY + centeredYOffset + contentContainerRect.top)/scale;

    imageAnimation.fromTo('scale', `1.0`, `${scale}`);
    imageAnimation.fromTo('translateX', `${0}px`, `${xTransform}px`);
    imageAnimation.fromTo('translateY', `${0}px`, `${yDifference}px`);
    backdropAnimation.fromTo('opacity', '0.01', '1.0');
    contentContainerAnimation.fromTo('opacity', '0.01', '1.0');

    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(400)
      .before.addClass('show-page')
      .add(imageAnimation)
      .add(backdropAnimation)
      .add(contentContainerAnimation);
  }
}
export class TwitterStylePhotoOutTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let image = ele.querySelector(".pv-image");
    let backdrop = ele.querySelector(".backdrop");
    let contentContainer = ele.querySelector(".contentContainer");
    let contentContainerRect = contentContainer.getBoundingClientRect();
    let imageAnimation = new Animation(image);
    let backdropAnimation = new Animation(backdrop);
    let contentContainerAnimation = new Animation(contentContainer);

    image.style.position = "absolute";
    image.style.top = `${opts.ev.startY}px`;
    image.style.left = `${opts.ev.startX}px`;
    image.style.width = `${opts.ev.width}px`;
    image.style.height = `${opts.ev.height}px`;

    var modalDimensions = getModalDimensions();

    // figure out the scale to move to
    let scale = modalDimensions.useableWidth/opts.ev.width;

    let centeredXOffset = (modalDimensions.totalWidth - modalDimensions.useableWidth)/2;
    let rectangleCenterX = opts.ev.startX + (opts.ev.width/2);
    let scaledRectangleWidth = opts.ev.width * scale;
    let scaledLeftEdge = rectangleCenterX - scaledRectangleWidth/2;
    let xTransform = (0 - scaledLeftEdge + centeredXOffset - contentContainerRect.left)/scale;

    let centeredYOffset = (modalDimensions.totalHeight - modalDimensions.useableHeight)/2;
    let rectangleCenterY = opts.ev.startY + (opts.ev.height/2);
    let scaledRectangleHeight = opts.ev.height * scale;
    let centerY = modalDimensions.useableHeight/2;
    let yDifference = (centerY - rectangleCenterY + centeredYOffset)/scale;

    imageAnimation.fromTo('scale', `${scale}`, `${1.0}`);
    imageAnimation.fromTo('translateX', `${xTransform}px`, `${0}px`);
    imageAnimation.fromTo('translateY', `${yDifference}px`, `${0}px`);
    backdropAnimation.fromTo('opacity', `${backdrop.style.opacity}`, '0.01');
    contentContainerAnimation.fromTo('opacity', `${contentContainer.style.opacity}`, '0.01');

    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(300)
      //.fadeOut()
      .before.addClass('show-page')
      .add(imageAnimation)
      .add(backdropAnimation)
      .add(contentContainerAnimation);
  }
}

export function getModalDimensions(){
  let width  = window.innerWidth;
  let height = window.innerHeight;
  const MIN_WIDTH_INSET = 768;
  const MIN_LARGE_HEIGHT_INSET = 768;
  const INSET_MODAL_WIDTH = 600;
  const INSET_MODAL_HEIGHT = 600;

  if ( width >= MIN_WIDTH_INSET && height >= MIN_LARGE_HEIGHT_INSET ){
    return {
      totalWidth: INSET_MODAL_WIDTH,
      totalHeight:INSET_MODAL_HEIGHT,
      useableWidth: INSET_MODAL_WIDTH - 100,
      useableHeight: INSET_MODAL_HEIGHT - 100
    };
  }
  return {
    totalWidth: width,
    totalHeight: height,
    useableWidth: width,
    useableHeight: height
  };
}


Transition.register(TRANSITION_IN_KEY, TwitterStylePhotoInTransition);
Transition.register(TRANSITION_OUT_KEY, TwitterStylePhotoOutTransition);
