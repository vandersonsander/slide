export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = this.s(wrapper);
    this.slide = this.s(slide);
    this.posx = 0;
    this.touch = { start: 0, move: 0 };
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

  // Mouse Events
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

  // Touch Events
  touchStart(e) {
    this.ae(this.wrapper, 'touchmove', this.touchMove);
    this.ae(this.wrapper, 'touchend', this.touchEnd);
    this.touch.start = e.touches[0].clientX;
  }

  touchMove(e) {
    this.touch.move = e.touches[0].clientX - this.touch.start;
    this.move(this.slide, this.posx + this.touch.move);
  }

  touchEnd() {
    this.posx += this.touch.move;
    this.re(this.wrapper, 'touchmove', this.touchMove);
  }

  move(target, x) {
    target.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  bindEvents() {
    // Bind the Mouse Events
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    // Bind the Touch Events
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    // this.tMove = this.tMove.bind(this);
  }

  init() {
    this.bindEvents();
    this.ae(this.wrapper, 'mousedown', this.onStart);
    this.ae(this.wrapper, 'touchstart', this.touchStart);
  }
}
