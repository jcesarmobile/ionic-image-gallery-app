/* Utils */
import { UnsplashItUtil } from './utils/unsplash-it-util';
import { ViewPortUtil } from './utils/viewport-util';

import { PanGestureController } from './utils/gestures/pan-gesture';
import { HammerFactory } from './utils/gestures/hammer-factory';

import { PhotoViewerController } from './pages/viewer/photo-viewer-view-controller';

export const APP_PROVIDERS = [
  /* Utils */
  UnsplashItUtil,
  ViewPortUtil,

  /* Gesture Recognizers */
  PanGestureController,
  HammerFactory,

  /* Controllers */
  PhotoViewerController
];
