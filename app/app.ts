import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GalleryPage} from './pages/gallery/GalleryPage';
import {getProviders} from "./AppFactory";

//import 'rxjs/Rx';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {},
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
