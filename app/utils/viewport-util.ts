import {Injectable} from '@angular/core';

@Injectable()
export class ViewPortUtil {
  private _width: number;
  private _height: number;

  constructor() {
      this._width = window.innerWidth;
      this._height = window.innerHeight;
  }

  getHeight(): number {
    return this._height;
  }

  getWidth(): number {
    return this._width;
  }
}
