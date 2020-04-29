import React, {useRef, useEffect} from 'react';


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
const myDist = ({x:x1,y:y1}, {x:x2,y:y2}) => ((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2));

const CanvasWrapper = ({onContextChange, onMouseMove, onDoubleClick, onMouseLeave, style, ...props}) => {
  
  const canvasRef = useRef(null);
  console.log('rendering with height', style.height)
  
  useEffect(() => {
    if(canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      ctx.imageSmoothingEnabled = false;
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
    if(onDoubleClick) {
      const mousePos = getMousePos(canvasRef.current, evt);
      onDoubleClick(mousePos, evt)
    }
  }

  return (
    <canvas 
      style={style} 
      ref={canvasRef} 
      width={style.width} 
      height={style.height}
      onMouseMove={handleCanvasHover}
     
      onDoubleClick={handleCanvasClick}
      onMouseLeave={onMouseLeave}
      {...props}
    ></canvas>
  );
}

export default CanvasWrapper;
