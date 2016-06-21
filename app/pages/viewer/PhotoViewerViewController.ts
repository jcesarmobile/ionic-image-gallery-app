import {ViewController} from "ionic-angular";
import {PhotoViewer} from "./PhotoViewer";

export class PhotoViewerViewController extends ViewController {

  constructor(opts: any = {}) {
    super(PhotoViewer, opts);
    this.viewType = 'photoViewer';
    this.isOverlay = true;
    this.usePortal = true;

    this.fireOtherLifecycles = true;
  }

  getTransitionName(direction: string) {
    let key = 'photoViewer' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  static create(opts: any = {}) {
    return new PhotoViewerViewController(opts);
  }
}
