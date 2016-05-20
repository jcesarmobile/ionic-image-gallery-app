import {Animation, Transition, TransitionOptions, ViewController} from "ionic-angular";

export const TRANSITION_IN_KEY:string = "photoViewerEnter";
export const TRANSITION_OUT_KEY:string = "photoViewerLeave";

export class TwitterStylePhotoInTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    var image = ele.querySelector(".pv-image");
    let imageAnimation = new Animation(image);
    var imageHeight = window.innerWidth;
    var yPosition = window.innerHeight/2 - imageHeight/2;

    image.style.position = "absolute";
    image.style.top = `${opts.transitionData.startY}px`;
    image.style.left = `${opts.transitionData.startX}px`;
    image.style.width = `${opts.transitionData.width}px`;
    image.style.height = `${opts.transitionData.height}px`;

    // get the difference from the startY and where we want it to be y-positioned
    yPosition = opts.transitionData.startY - yPosition;

    //imageAnimation.fromTo('translateY', `${opts.transitionData.startY}px`, `${imageY}px`);
    //imageAnimation.fromTo('translateX', `${opts.transitionData.startX}px`, `${0}px`);

    imageAnimation.fromTo('width', `${opts.transitionData.width}px`, `${imageHeight}px`);
    imageAnimation.fromTo('height', `${opts.transitionData.height}px`, `${imageHeight}px`);
    imageAnimation.fromTo('translateX', `${0}px`, `${0 - opts.transitionData.startX}px`);
    imageAnimation.fromTo('translateY', `${0}px`, `${0 - yPosition}px`);



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

    console.log("TwitterStylePhotoOutTransition: ", opts);

    let ele = leavingView.pageRef().nativeElement;
    var image = ele.querySelector(".pv-image");
    let imageAnimation = new Animation(image);
    var imageHeight = window.innerWidth;
    var yPosition = window.innerHeight/2 - imageHeight/2;

    yPosition = opts.transitionData.startY - yPosition;

    imageAnimation.fromTo('width', `${imageHeight}px`, `${opts.transitionData.width}px`);
    imageAnimation.fromTo('height', `${imageHeight}px`, `${opts.transitionData.height}px`);
    imageAnimation.fromTo('translateX', `${0 - opts.transitionData.startX}px`, `${0}px`);
    imageAnimation.fromTo('translateY', `${0 - yPosition}px`, `${0}px`);

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
