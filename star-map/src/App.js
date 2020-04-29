import React from 'react';
import {polarToCart, colorTemperatureToRGB, clamp, numToHex} from './DisplayUtils';
import './App.css';
import entries from './data/165kEntriesCube.json'
import MainMap from './components/MainMap';



const parseStar = ([identifier,ra,dec,par,temp, radius, lum], scaleFactor=1) => {
  const dist = ((1000/par)*Math.cos(dec))*scaleFactor
  const height = ((1000/par)*Math.sin(dec))*scaleFactor
  const {x,y} = polarToCart(ra, dist)
  const color = colorTemperatureToRGB(temp)//+numToHex(clamp((lum*2)+55, 0, 255));
  const size = lum>100?(clamp(1+(lum/300),0,3)):1
  const isVisible = Math.abs(height) < 2000 && Math.abs(x) < 10000 &&  Math.abs(y) < 10000;
  return {
    x,
    y,
    color,
    size,
    isVisible,
  }
}

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
