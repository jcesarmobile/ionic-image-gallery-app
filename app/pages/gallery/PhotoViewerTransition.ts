import {Animation, Transition, TransitionOptions, ViewController} from "ionic-angular";

export const TRANSITION_IN_KEY:string = "photoViewerEnter";
export const TRANSITION_OUT_KEY:string = "photoViewerLeave";

export class TwitterStylePhotoInTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let image = ele.querySelector(".pv-image");
    let imageAnimation = new Animation(image);

    image.style.position = "absolute";
    image.style.top = `${opts.transitionData.startY}px`;
    image.style.left = `${opts.transitionData.startX}px`;
    image.style.width = `${opts.transitionData.width}px`;
    image.style.height = `${opts.transitionData.height}px`;

    // figure out the scale to move to
    let scale = window.innerWidth/opts.transitionData.width;
    console.log("Scale: ", scale);

    let rectangleCenterX = opts.transitionData.startX + (opts.transitionData.width/2);
    let scaledRectangleWidth = opts.transitionData.width * scale;
    let scaledLeftEdge = rectangleCenterX - scaledRectangleWidth/2;
    let xTransform = (0 - scaledLeftEdge)/scale;

    let rectangleCenterY = opts.transitionData.startY + (opts.transitionData.height/2);
    let scaledRectangleHeight = opts.transitionData.height * scale;
    let centerY = window.innerHeight/2;
    let yDifference = (centerY - rectangleCenterY)/scale;

    imageAnimation.fromTo('scale', `1.0`, `${scale}`);
    imageAnimation.fromTo('translateX', `${0}px`, `${xTransform}px`);
    imageAnimation.fromTo('translateY', `${0}px`, `${yDifference}px`);

    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(300)
      //.fadeIn()
      .before.addClass('show-page')
      .add(imageAnimation);
  }
}
export class TwitterStylePhotoOutTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    //console.log("TwitterStylePhotoOutTransition: ", opts);

    let ele = leavingView.pageRef().nativeElement;
    let image = ele.querySelector(".pv-image");
    let imageAnimation = new Animation(image);

    image.style.position = "absolute";
    image.style.top = `${opts.transitionData.startY}px`;
    image.style.left = `${opts.transitionData.startX}px`;
    image.style.width = `${opts.transitionData.width}px`;
    image.style.height = `${opts.transitionData.height}px`;

    // figure out the scale to move to
    let scale = window.innerWidth/opts.transitionData.width;
    console.log("Scale: ", scale);

    let rectangleCenterX = opts.transitionData.startX + (opts.transitionData.width/2);
    let scaledRectangleWidth = opts.transitionData.width * scale;
    let scaledLeftEdge = rectangleCenterX - scaledRectangleWidth/2;
    let xTransform = (0 - scaledLeftEdge)/scale;

    let rectangleCenterY = opts.transitionData.startY + (opts.transitionData.height/2);
    let scaledRectangleHeight = opts.transitionData.height * scale;
    let centerY = window.innerHeight/2;
    let yDifference = (centerY - rectangleCenterY)/scale;

    imageAnimation.fromTo('scale', `${scale}`, `${1.0}`);
    imageAnimation.fromTo('translateX', `${xTransform}px`, `${0}px`);
    imageAnimation.fromTo('translateY', `${yDifference}px`, `${0}px`);

    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(300)
      //.fadeOut()
      .before.addClass('show-page')
      .add(imageAnimation);
  }
}

Transition.register(TRANSITION_IN_KEY, TwitterStylePhotoInTransition);
Transition.register(TRANSITION_OUT_KEY, TwitterStylePhotoOutTransition);
