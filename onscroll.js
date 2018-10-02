const onScroll = {
  _cb: [], _scrollCb: null,
  add: function(cb) {
    if (typeof cb === 'function') {
      this._cb.push([cb, null])
    } else if (typeof cb[0] === 'function') {
      this._cb.push([cb[0], cb[1]])
    } else {
      console.warn("argument is not a callable", cb)
    }
  },
  exec: function() {
    this._cb.forEach(cb => cb[0].call(cb[1]))
  },
  load: function() {
    if (this._scrollCb) {
      window.removeEventListener('scroll', this._scrollCb)
    }
    this._scrollCb = () => {
      this.exec()
    }
    this._scrollCb()
    window.addEventListener('scroll', this._scrollCb)
  }
}

onScroll.load()

export default onScroll