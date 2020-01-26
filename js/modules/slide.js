export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = this.s(wrapper);
    this.slide = this.s(slide);
    this.posx = 0;
  }

  s(e) {
    return document.querySelector(e);
  }

  sa(e) {
    return document.querySelectorAll(e);
  }

  ae(target, event, callback) {
    target.addEventListener(event, callback);
  }

  re(target, event, callback) {
    target.removeEventListener(event, callback);
  }

  onStart(e) {
    e.preventDefault();
    this.ae(this.wrapper, 'mousemove', this.onMove);
    this.ae(this.wrapper, 'mouseup', this.onEnd);
  }

  onMove(e) {
    this.posx += e.movementX;
    this.move(this.slide, this.posx);
  }

  onEnd() {
    this.re(this.wrapper, 'mousemove', this.onMove);
  }

  move(target, x) {
    target.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.ae(this.wrapper, 'mousedown', this.onStart);
  }
}
