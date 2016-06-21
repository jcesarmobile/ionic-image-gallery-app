/* Utils */
import {UnsplashItUtil} from "./utils/UnsplashItUtil";
import {ViewPortUtil} from "./utils/ViewPortUtil";

import {DragGestureRecognizerProvider} from './utils/gestures/drag-gesture-recognizer-provider';
import {PinchGestureRecognizerProvider} from './utils/gestures/pinch-gesture-recognizer-provider';
import {PressGestureRecognizerProvider} from './utils/gestures/press-gesture-recognizer-provider';
import {RotateGestureRecognizerProvider} from './utils/gestures/rotate-gesture-recognizer-provider';
import {SwipeGestureRecognizerProvider} from './utils/gestures/swipe-gesture-recognizer-provider';
import {TapGestureRecognizerProvider} from './utils/gestures/tap-gesture-recognizer-provider';

export function getProviders(){
    let providers = [];
    /* Utils */
    providers.push(UnsplashItUtil);
    providers.push(ViewPortUtil);

    /* Gesture Recognizers */
    providers.push(DragGestureRecognizerProvider);
    providers.push(PinchGestureRecognizerProvider);
    providers.push(PressGestureRecognizerProvider);
    providers.push(RotateGestureRecognizerProvider);
    providers.push(SwipeGestureRecognizerProvider);
    providers.push(TapGestureRecognizerProvider);

    return providers;
}
