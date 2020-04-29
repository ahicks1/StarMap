import React from 'react';
import {polarToCart, colorTemperatureToRGB, clamp, numToHex} from './DisplayUtils';
import './App.css';
import entries from './data/300kEntriesCube.json'
import MainMap from './components/MainMap';



const parseStar = ([identifier,ra,dec,par,temp, radius, lum], scaleFactor=1) => {
  const dist = ((1000/par)*Math.cos(dec))*scaleFactor
  const height = ((1000/par)*Math.sin(dec))*scaleFactor
  const {x,y} = polarToCart(ra, dist)
  const color = colorTemperatureToRGB(temp);
  const size = Math.log10(lum+1)+1;//lum>100?(clamp(1+(Math.l(lum+1)),0,3)):1
  const opacity = numToHex(Math.floor(clamp(Math.log10(lum+1),0.5, 1)*255))
  const isVisible = true//Math.abs(height) < 2000 && Math.abs(x) < 10000 &&  Math.abs(y) < 10000;
  return {
    x,
    y,
    color,
    size,
    opacity,
    isVisible,
  }
}

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MainMap data={entries} parseStar={e => parseStar(e, 10)}/>
      </header>
    </div>
  );
}

export default App;
