console.log('hello world')
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.fillRect(0,0,1000,1000);

fetch('/foo.txt')
  .then(response => response.text())
  .then((data) => {
    console.log(data)
  })