import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GalleryPage} from './pages/gallery/GalleryPage';
import {getProviders} from "./AppFactory";

import {TRANSITION_IN_KEY, TRANSITION_OUT_KEY} from "./pages/gallery/PhotoViewerTransition";

//import 'rxjs/Rx';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {
    photoViewerEnter: TRANSITION_IN_KEY,
    photoViewerLeave: TRANSITION_OUT_KEY
  },
  providers: getProviders(),
  //prodMode: true
})
export class MyApp {
  rootPage: any = GalleryPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
}
