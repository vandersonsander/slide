import debounce from './debounce.js';

export default class Slide {
  constructor(wrapper, slide) {
    this.wrapper = this.s(wrapper);
    this.slide = this.s(slide);
    this.posx = 0;
    this.touch = { start: 0, move: 0 };
    this.mouse = { move: 0 };
    this.activeSlide = 0;
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
    this.transition(false);
    this.ae(this.wrapper, 'mousemove', this.onMove);
    this.ae(this.wrapper, 'mouseup', this.onEnd);
    this.ae(this.wrapper, 'mouseout', this.onEnd);
  }

  onMove(e) {
    this.posx += e.movementX;
    this.mouse.move += e.movementX;
    this.move(this.slide, this.posx);
  }

  onEnd() {
    this.checkPosition(this.mouse.move);
    this.mouse.move = 0;
    this.re(this.wrapper, 'mousemove', this.onMove);
  }

  // Touch Events
  touchStart(e) {
    this.ae(this.wrapper, 'touchmove', this.touchMove);
    this.ae(this.wrapper, 'touchend', this.touchEnd);
    this.touch.start = e.touches[0].clientX;
    this.transition(false);
  }

  touchMove(e) {
    this.touch.move = e.touches[0].clientX - this.touch.start;
    this.move(this.slide, this.posx + this.touch.move);
  }

  touchEnd() {
    this.posx += this.touch.move;
    this.checkPosition(this.touch.move);
    this.touch.move = 0;
    this.re(this.wrapper, 'touchmove', this.touchMove);
  }

  checkPosition(pos) {
    if (pos < -120) this.nextSlide();
    else if (pos > 120) this.prevSlide();
    else this.changeSlide(this.activeSlide);
  }

  move(target, x) {
    target.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  calcPosition(index) {
    const slides = [...this.slide.children].map((elem) => (
      { position: -elem.offsetLeft, width: elem.offsetWidth }));
    const { position, width } = slides[index];
    const margin = (this.wrapper.offsetWidth - width) / 2;
    return { position: () => position + margin, margin };
  }

  changeSlide(index) {
    this.transition(true);
    const { length } = this.slide.children;
    if (index < 0 || index >= length) {
      this.posx = this.calcPosition(this.activeSlide).position();
      this.move(this.slide, this.posx);
      return undefined;
    }
    this.activeSlide = index;
    this.posx = this.calcPosition(index).position();
    this.move(this.slide, this.posx);
    this.active(index);
    return this.activeSlide;
  }

  prevSlide() {
    return this.changeSlide(this.activeSlide - 1);
  }

  nextSlide() {
    return this.changeSlide(this.activeSlide + 1);
  }

  // Add transition effect
  transition(active) {
    this.slide.style.transition = active ? 'transform .4s' : 'none';
  }

  // Add class active to active slide
  active(index) {
    const slides = [...this.slide.children];
    slides.forEach((elem) => elem.classList.remove('active'));
    slides[index].classList.add('active');
  }

  // Control the window resize
  resize() {
    this.changeSlide(this.activeSlide);
  }

  bindEvents() {
    // Binding the Mouse Events
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    // Binding the Touch Events
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    // Binding the Controls
    this.prevSlide = this.prevSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.checkPosition = this.checkPosition.bind(this);
    this.active = this.active.bind(this);
    // Control the window Events
    this.resize = debounce(this.resize.bind(this), 400);
  }

  init() {
    this.active(0);
    this.bindEvents();
    window.addEventListener('resize', this.resize);
    this.transition(true);
    this.ae(this.wrapper, 'mousedown', this.onStart);
    this.ae(this.wrapper, 'touchstart', this.touchStart);
    return this;
  }
}
