import {Injectable} from '@angular/core';

@Injectable()
export class ViewPortUtil {
  private _width: number;
  private _height: number;

  constructor() {
    this.update();
  }

  getHeight(): number {
    return this._height;
  }

  getWidth(): number {
    return this._width;
  }

  update() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
  }
}
