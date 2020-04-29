import React, {useRef, useEffect} from 'react';


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
const CanvasWrapper = ({onContextChange, onMouseMove, onClick, onMouseLeave, style, ...props}) => {
  
  const canvasRef = useRef(null);
  console.log('rendering with height', style.height)
  
  useEffect(() => {
    if(canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      onContextChange(ctx, {width, height});
    }
  }, [onContextChange]);

  const handleCanvasHover = evt => {
    if(onMouseMove) {
      const mousePos = getMousePos(canvasRef.current, evt);
      onMouseMove(mousePos, evt)
    }
  }

  const handleCanvasClick = evt => {
    if(onClick) {
      const mousePos = getMousePos(canvasRef.current, evt);
      onClick(mousePos, evt)
    }
  }

  return (
    <canvas 
      style={style} 
      ref={canvasRef} 
      width={style.width} 
      height={style.height}
      onMouseMove={handleCanvasHover}
      onClick={handleCanvasClick}
      onMouseLeave={onMouseLeave}
      {...props}
    ></canvas>
  );
}

export default CanvasWrapper;
