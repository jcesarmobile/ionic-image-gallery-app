/* Utils */
import {UnsplashItUtil} from './utils/unsplash-it-util';
import {ViewPortUtil} from './utils/viewport-util';

import {DragGestureRecognizerProvider} from './utils/gestures/drag-gesture-recognizer-provider';

export const APP_PROVIDERS = [
  /* Utils */
  UnsplashItUtil,
  ViewPortUtil,

  /* Gesture Recognizers */
  DragGestureRecognizerProvider
];
