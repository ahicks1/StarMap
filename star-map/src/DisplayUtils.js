export const polarToCart = (rad, dist) => ({
    x: dist * Math.cos(rad),
    y: dist * Math.sin(rad)
})

export const numToHex = (c) => {
  var hex = Math.round(c).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = ({r, g, b}) => "#"+numToHex(r)+numToHex(g)+numToHex(b);


export const colorTemperatureToRGB = kelvin => {
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


export const clamp = ( x, min, max ) => {

  if(x<min){ return min; }
  if(x>max){ return max; }

  return x;

}