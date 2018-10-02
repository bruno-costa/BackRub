import onScroll from "./onscroll"

function BackRub($0) {
  const installedOnScroll = {}
  this.onScroll = {
    run: function() {
      for (let key in installedOnScroll) {
        installedOnScroll[key].call(null)
      }
    },
    install: function(key, fn) {
      if (typeof fn === 'function') {
        installedOnScroll[key] = fn
        fn.call(null)
      }
    }
  }
  onScroll.add(this.onScroll.run)
  if ($0) {
    $0.backRub = this
  }
  return this
}

function normalize(v, min = 0, max = 1) {
  return Math.max(Math.min(v, max), min)
}

function addAnimationStyle($0, animationName) {
  $0.style.animationName = animationName;
  $0.style.animationDuration = '1s';
  $0.style.animationDelay = '0s';
  $0.style.animationPlayState = 'paused';
  $0.style.animationTimingFunction = 'linear';
  $0.style.animationFillMode = 'both';
}

function getOffset(offsetValue) {
  const percent = /^(\d\d?\d?)%$/.exec(offsetValue)
  let offset = 0
  if (percent) {
    offset = window.innerHeight * percent[1] / 100
  } else {
    const natural = /^(\d+)$/.exec(offsetValue)
    if (natural) {
      offset = natural[1] * 1
    }
  }
  return offset
}

function getAnimationDimensions($0) {
  const originalRect = $0.getBoundingClientRect()
  const offsetterTop = getOffset(($0.attributes['backrub-scroll-offset-top'] || {value: 0}).value)
  const top = Math.max(originalRect.top + window.scrollY - offsetterTop, 0)
  const height = getOffset(($0.attributes['backrub-scroll-offset-height'] || {value: 0}).value) || originalRect.height
  return {top, height}
}

function getNormalizeScrollRange(top, height) {
  return normalize((window.scrollY - top) / height)
}

function getAnimationFunction($0) {
  const animationName = $0.attributes['backrub-scroll-animation'].value
  const {top, height} = getAnimationDimensions($0)
  addAnimationStyle($0, animationName)
  return function() {
    const percent = getNormalizeScrollRange(top, height)
    $0.style.animationDelay = `${-percent}s`;
  }
}

function backrubScrollAnimation($0) {
  const backrub = $0.backrub || new BackRub($0)
  backrub.onScroll.install('animation', getAnimationFunction($0))
}

export default BackRub