import {Animation, Modal, Transition, TransitionOptions, ViewController} from "ionic-angular";

export class FadeModal extends Modal{
  constructor(componentType, data = {}){
    super(componentType, data);
  }
}

class FadeOutModalTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);
    this
      .element(leavingView.pageRef())
      .duration(200)
      //.fromTo('translateY', '0px', '40px')
      .fadeOut();
  }
}

class FadeInModalTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);
    this
      .element(enteringView.pageRef())
      .duration(280)
      //.fromTo('translateY', '40px', '0px')
      .fadeIn()
      .before.addClass('show-page');

    if (enteringView.hasNavbar()) {
      // entering page has a navbar
      let enteringNavBar = new Animation(enteringView.navbarRef());
      enteringNavBar.before.addClass('show-navbar');
      this.add(enteringNavBar);
    }
  }
}

Transition.register('modal-slide-in', FadeInModalTransition);
Transition.register('modal-slide-out', FadeOutModalTransition);
Transition.register('modal-md-slide-in', FadeInModalTransition);
Transition.register('modal-md-slide-out', FadeOutModalTransition);