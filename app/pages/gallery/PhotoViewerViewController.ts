import {ViewController} from "ionic-angular";
import {PhotoViewer} from "./PhotoViewer";

export class PhotoViewerViewController extends ViewController {

  constructor(opts: any = {}) {
    super(PhotoViewer, opts);
    this.viewType = 'toast';
    this.isOverlay = true;
    this.usePortal = true;

    this.fireOtherLifecycles = true;
  }



  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = 'photoViewer' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} message  Toast message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   *
   *  Toast options
   *
   *  | Property              | Type      | Default         | Description                                                                                                   |
   *  |-----------------------|-----------|-----------------|---------------------------------------------------------------------------------------------------------------|
   *  | message               | `string`  | -               | The message for the toast. Long strings will wrap and the toast container will expand.                        |
   *  | duration              | `number`  | -               | How many milliseconds to wait before hiding the toast. By default, it will show until `dismiss()` is called.  |
   *  | cssClass              | `string`  | -               | Any additional class for custom styles.                                                                       |
   *  | showCloseButton       | `boolean` | false           | Whether or not to show a button to close the toast.                                                           |
   *  | closeButtonText       | `string`  | "Close"         | Text to display in the close button.                                                                          |
   *  | enableBackdropDismiss | `boolean` | true            | Whether the toast should be dismissed by tapping the backdrop.                                                |
   *  | dismissOnPageChange   | `boolean` | false           | Whether to dismiss the toast when navigating to a new page.                                                   |
   *
   * @param {object} opts Toast options. See the above table for available options.
   */
  static create(opts: any = {}) {
    return new PhotoViewerViewController(opts);
  }
}
