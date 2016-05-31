import {Animation, Transition, TransitionOptions, ViewController} from "ionic-angular";

export const TRANSITION_IN_KEY:string = "photoViewerEnter";
export const TRANSITION_OUT_KEY:string = "photoViewerLeave";

export class TwitterStylePhotoInTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let image = ele.querySelector(".pv-image");
    let backdrop = ele.querySelector(".backdrop");
    let imageAnimation = new Animation(image);
    let backdropAnimation = new Animation(backdrop);

    image.style.position = "absolute";
    image.style.top = `${opts.ev.startY}px`;
    image.style.left = `${opts.ev.startX}px`;
    image.style.width = `${opts.ev.width}px`;
    image.style.height = `${opts.ev.height}px`;

    // figure out the scale to move to
    let scale = window.innerWidth/opts.ev.width;

    let rectangleCenterX = opts.ev.startX + (opts.ev.width/2);
    let scaledRectangleWidth = opts.ev.width * scale;
    let scaledLeftEdge = rectangleCenterX - scaledRectangleWidth/2;
    let xTransform = (0 - scaledLeftEdge)/scale;

    let rectangleCenterY = opts.ev.startY + (opts.ev.height/2);
    let scaledRectangleHeight = opts.ev.height * scale;
    let centerY = window.innerHeight/2;
    let yDifference = (centerY - rectangleCenterY)/scale;

    imageAnimation.fromTo('scale', `1.0`, `${scale}`);
    imageAnimation.fromTo('translateX', `${0}px`, `${xTransform}px`);
    imageAnimation.fromTo('translateY', `${0}px`, `${yDifference}px`);
    backdropAnimation.fromTo('opacity', '0.01', '1.0');

    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(400)
      //.fadeIn()
      .before.addClass('show-page')
      .add(imageAnimation)
      .add(backdropAnimation);
  }
}
export class TwitterStylePhotoOutTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    //console.log("TwitterStylePhotoOutTransition: ", opts);

    let ele = leavingView.pageRef().nativeElement;
    let image = ele.querySelector(".pv-image");
    let backdrop = ele.querySelector(".backdrop");
    let imageAnimation = new Animation(image);
    let backdropAnimation = new Animation(backdrop);

    image.style.position = "absolute";
    image.style.top = `${opts.ev.startY}px`;
    image.style.left = `${opts.ev.startX}px`;
    image.style.width = `${opts.ev.width}px`;
    image.style.height = `${opts.ev.height}px`;

    // figure out the scale to move to
    let scale = window.innerWidth/opts.ev.width;

    let rectangleCenterX = opts.ev.startX + (opts.ev.width/2);
    let scaledRectangleWidth = opts.ev.width * scale;
    let scaledLeftEdge = rectangleCenterX - scaledRectangleWidth/2;
    let xTransform = (0 - scaledLeftEdge)/scale;

    let rectangleCenterY = opts.ev.startY + (opts.ev.height/2);
    let scaledRectangleHeight = opts.ev.height * scale;
    let centerY = window.innerHeight/2;
    let yDifference = (centerY - rectangleCenterY)/scale;

    imageAnimation.fromTo('scale', `${scale}`, `${1.0}`);
    imageAnimation.fromTo('translateX', `${xTransform}px`, `${0}px`);
    imageAnimation.fromTo('translateY', `${yDifference}px`, `${0}px`);
    backdropAnimation.fromTo('opacity', `backdrop.style.opacity`, '0.01');

    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(300)
      //.fadeOut()
      .before.addClass('show-page')
      .add(imageAnimation)
      .add(backdropAnimation);
  }
}

Transition.register(TRANSITION_IN_KEY, TwitterStylePhotoInTransition);
Transition.register(TRANSITION_OUT_KEY, TwitterStylePhotoOutTransition);
