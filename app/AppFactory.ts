/* Utils */
import {UnsplashItUtil} from "./utils/UnsplashItUtil";
import {ViewPortUtil} from "./utils/ViewPortUtil";

export function getProviders(){
    let providers = [];
    /* Utils */
    providers.push(UnsplashItUtil);
    providers.push(ViewPortUtil);

    return providers;
}
