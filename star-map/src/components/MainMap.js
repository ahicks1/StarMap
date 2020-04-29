import React, {useRef, useEffect, useState, useCallback} from 'react';
import Quadtree from '@timohausmann/quadtree-js';
import CanvasWrapper from './CanvasWrapper'

import {clamp} from '../DisplayUtils';
import useBounds from '../useBounds';

const getScaleBar = zoom => {
  let length = zoom/4
  let units = ' Parsec'
  let scale = 0.25
  if(length < 50) {
    while(length < 50) {
      units = ' Parsecs'
      length*=2
      scale*=2
    }
  } else if(length > 100) {
    units = ' AU'
    length /= 206265 
    while(length < 50) {
      length*=2
      scale*=2
    }
    if(length > 100) {
      units = ' Solar Radii'
      length /= 215 
      while(length < 50) {
        length*=2
        scale*=2
      }
    }
  }
  
  return {label: scale+units, length}
}

const myDist = ({x:x1,y:y1}, {x:x2,y:y2}) => ((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2));
const sortPoints = (point, elems) => elems.sort(({loc:a},{loc:b}) => myDist(point, a)-myDist(point, b));

function MainMap({data, parseStar, onStarHover, onStarSelect}) {

  const {width, height} = useBounds();
  const [zoom, setZoom] = useState(1);
  const [mouseDown, setMouseDown] = useState(false);
  const [pan, setPan] = useState({x:0, y:0});
  const [parsedData, setParsedData] = useState([]);
  const [myTree] = useState(new Quadtree({
    x: 0,
    y: 0,
    width: 10000,
    height: 10000,
  }, 50, 8));

  const canvasStyle = {    
    position:'absolute',
    left:'0px',
    top:'0px',
    width,
    height,
  };
  
  const mapCtx = useRef(null);
  const hoverCtx = useRef(null);
  const hoveredStar = useRef({})
  
  const getScreenCoords = useCallback(({x,y}) => ({x:((x+pan.x)*zoom)+(width/2), y:((y+pan.y)*zoom)+(height/2)}),[zoom, width, height, pan])
  const getWorldCoords = useCallback(({x,y}) => ({x:(x-(width/2))/zoom-pan.x, y:(y-(height/2))/zoom-pan.y}),[zoom, width, height, pan])

  useEffect(() => {
    const pData = data.map(entry => ({...parseStar(entry), entry}));
    setParsedData(pData);
    myTree.clear();
    pData.forEach(({x, y, color, size, entry}) => myTree.insert({
      x: Math.abs(x),
      y: Math.abs(y),
      loc: {x, y},
      width: size,
      height: size,
      size,
      color,
      entry,
    }))
  }, [data, myTree, parseStar])

  useEffect(() => {
    if(mapCtx.current) {
      let ctx = mapCtx.current
      
      ctx.fillStyle = "#000000";
      ctx.fillRect(0,0, width, height);
      ctx.fillStyle = "#0000FF";
      const center = getScreenCoords({x:0, y:0})
      ctx.fillRect(center.x,center.y,5,5);
      ctx.fillStyle = "#FFFFFF66";
      let count = 0;
      console.log('redrawing with pan', pan)
      parsedData.forEach(({x, y, color, size, opacity, isVisible, entry}) => {
        if ( isVisible) {
          const {x:sX, y:sY} = getScreenCoords({x,y})
          if(sX > 0 && sX < width && sY > 0 && sY < height) {
            const s = clamp((entry[5]*2*zoom)/4.435e+7, size, 1000)
            ctx.fillStyle = color;
            if(s === size) ctx.fillStyle = color+opacity
            
            ctx.fillRect(sX-s/2,sY-s/2,s,s);
            count++;
          }
        }
      })
      ctx.font = "12px Verdana";
      ctx.fillStyle = "#FFFFFF";
      const {label, length} = getScaleBar(zoom);
      ctx.fillText(label, 20, height-30);
      ctx.fillRect(20, height-20, length , 3);
      if(hoverCtx.current && hoveredStar.current.loc) {
        drawSelectedStar(hoverCtx.current, hoveredStar.current)
      }
    }
      
  });

 
  const drawSelectedStar = (ctx, {loc, entry}) => {
    ctx.clearRect(0, 0, canvasStyle.width, canvasStyle.height);
    ctx.fillStyle = "#00FF00";
    const {x:drawX, y:drawY} = getScreenCoords(loc)
    ctx.fillRect(drawX-1,drawY-1,3,3);
    ctx.font = "12px Verdana";
    ctx.fillStyle = "#FFFFFF";
    if(entry) {
      console.log('Hovered star loc', loc)
      const [identifier,ra,dec,par,temp, radius, lum] = entry;
      ctx.fillText('Star: '+identifier, 20, 20);
      ctx.fillText('Distance: '+(1000/par).toFixed(1)+' Parsecs', 20, 40);
      ctx.fillText('Temp: '+temp.toFixed()+'K', 20, 60);
      ctx.fillText('Radius: '+radius.toFixed(2)+'R☉', 20, 80);
      ctx.fillText('Luminosity : '+lum.toFixed(2)+'L☉', 20, 100);
    }
  }


  const handleCanvasHover = (mousePos, event) => {
    if(mouseDown) {
      
      const {movementX, movementY} = event;
      console.log('movement', movementX, movementY);
      setPan({x:pan.x+movementX/zoom, y:pan.y+movementY/zoom})
    } else {
      const {x,y} = getWorldCoords(mousePos)
      const elements = myTree.retrieve({x:Math.abs(x), y:Math.abs(y), width:8, height:8});
      //const message = 'Mouse position: ' + x + ',' + y// +' with overlaps '+elements.length;
      // console.log('nodes', myTree.nodes, 'objects', myTree.objects);
      //console.log(message);
      const sortedElems = sortPoints({x:x, y:y}, elements);
      if(hoverCtx.current) {
        const [{loc={}, entry}={}]= sortedElems;
        const ctx = hoverCtx.current
        hoveredStar.current = {loc, entry}
        drawSelectedStar(ctx, hoveredStar.current)
        

        if(onStarHover && entry) onStarHover(entry)
      }
    }
    

  }

  const handleScroll = ({deltaMode, deltaY}) => {
    console.log(deltaMode, deltaY)
    setZoom(clamp(zoom+zoom*deltaY/10, 0.1 , 10000000000))
  }
  return (
    <div>
      <CanvasWrapper style={canvasStyle} onContextChange={c => mapCtx.current = c}/>
      <CanvasWrapper 
      style={canvasStyle} 
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseMove={handleCanvasHover} 
      onDoubleClick={(mousePos) => setPan({x:-hoveredStar.current.loc.x, y:-hoveredStar.current.loc.y})}
      onWheel={handleScroll} 
      onContextChange={c => hoverCtx.current = c}
      />
    </div>
  );
}

export default MainMap;
