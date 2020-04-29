import React, {useRef, useEffect, useState, useCallback} from 'react';
function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

const useBounds = () => {
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setBounds({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 200)

    window.addEventListener('resize', debouncedHandleResize)

    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
    
  });

  
  const [bounds, setBounds] = useState({width:window.innerWidth, height:window.innerHeight})
  return bounds;
}

export default useBounds;