import React, {useRef, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import entries from './data/1587957625397O-result.json'
import Quadtree from '@timohausmann/quadtree-js';

const polarToCart = (rad, dist) => {
  return {
    x: dist * Math.cos(rad),
    y: dist * Math.sin(rad)
}
}

function componentToHex(c) {
  var hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex({r, g, b}) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function colorTemperatureToRGB(kelvin){

  var temp = kelvin / 100;

  var red, green, blue;

  if( temp <= 66 ){ 
      red = 255; 
      green = temp;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;
      if( temp <= 19){
          blue = 0;
      } else {
          blue = temp-10;
          blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      }

  } else {
      red = temp - 60;
      red = 329.698727446 * Math.pow(red, -0.1332047592);
      green = temp - 60;
      green = 288.1221695283 * Math.pow(green, -0.0755148492 );
      blue = 255;
  }


  return rgbToHex({
      r : clamp(red,   0, 255),
      g : clamp(green, 0, 255),
      b : clamp(blue,  0, 255)
  })

}


function clamp( x, min, max ) {

  if(x<min){ return min; }
  if(x>max){ return max; }

  return x;

}

const parseStar = ([identifier,ra,dec,par,temp, radius, lum]) => {
  const dist = ((1000/par)*Math.cos(dec))*20
  const coords = polarToCart(ra, dist)
  return {
    id: identifier,
    coords,
    temp,
    radius,
    lum,
    dec,
  }
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

const canvasStyle = {    
  position:'absolute',
  left:'0px',
  top:'0px',
}

const myDist = ({x:x1,y:y1}, {x:x2,y:y2}) => ((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2))

const sortPoints = (point, elems) => elems.sort((a,b) => myDist(point, a)-myDist(point, b))
function App() {
  
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);
  //const testArray = entries00.entries.filter(e => e[4]).map(entry => Math.abs(entry[4]))
  //console.log(Math.max.apply(Math,testArray));
  useEffect(() => {
    if(canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      ctx.fillRect(0,0,5000,5000);
      ctx.fillStyle = "#0000FF";
      ctx.fillRect(498,498,3,3);
      ctx.fillStyle = "#FFFFFF66";
      entries.data.forEach(entry => {
        const {coords: {x,y}, temp, dec} = parseStar(entry)
        if(x > 1000 || y > 1000 || Math.abs(dec) > 15 ) return;
        const colorHex = colorTemperatureToRGB(temp)
        ctx.fillStyle = colorHex
        ctx.fillRect(Math.floor(x)+500,Math.floor(y)+500,1,1);
        myTree.insert({
          x: Math.floor(x)+500,
          y: Math.floor(y)+500,
          width: 1,
          height: 1,
          color: colorHex,
          temp,
        })
      });
    }
      
  }, [canvasRef]);

  const myTree = new Quadtree({
    x: 0,
    y: 0,
    width: 1000,
    height: 1000
  }, 50, 8);

  const handleCanvasHover = evt => {
    const mousePos = getMousePos(canvasRef.current, evt);
    const elements = myTree.retrieve({
      x: mousePos.x,
      y: mousePos.y,
      width:8,
      height:8,
    });
    const message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y+' with overlaps: '+elements.length;
    const sortedElems = sortPoints({x: mousePos.x, y: mousePos.y}, elements);
    console.log(message);
    console.log(sortedElems[0]);
    if(canvasRef2.current) {
      const {x=0, y=0} = sortedElems[0];
      const context = canvasRef2.current.getContext("2d");
      context.clearRect(0, 0, canvasRef2.current.width, canvasRef2.current.height);
      context.fillStyle = "#00FF00";
      context.fillRect(x-1,y-1,3,3);
    }

  }
  return (
    <div className="App">
      <header className="App-header">
        <div>
        <canvas style={canvasStyle} ref={canvasRef} width="1000" height="1000"></canvas>
        <canvas style={canvasStyle} onMouseMove={handleCanvasHover} ref={canvasRef2} width="1000" height="1000"></canvas>
        </div>
      
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {JSON.stringify(parseStar(entries.data[0]))}
        </a>
      </header>
    </div>
  );
}

export default App;
