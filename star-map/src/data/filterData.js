const fs = require('fs'); 
const data = require('./1587957625397O-result.json')

console.log('hello world');

const readFilePromise = fileName => new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
        if(data) resolve(data);
        else reject(err);
    })
})

const columns = [3,5,6,7,10,11]

console.log(data.data[0])

const filteredData = data.data.filter( ([identifier,ra,dec,par,temp, radius, lum]) => {
    const dist = ((1000/par)*Math.cos(dec))
    const height = ((1000/par)*Math.sin(dec))
    const x = dist * Math.cos(ra)
    const y = dist * Math.sin(ra)
    return Math.abs(x) < 200 && Math.abs(y) < 200 && Math.abs(height) < 50
})

console.log(filteredData.length)
fs.writeFile('165kEntriesCube.json', JSON.stringify(filteredData), data => console.log('Done'))

// readFilePromise('./star-map/src/data/1587957625397O-result.json').then(data => {
//     const rawLines = data.split('\n');
//     console.log(rawLines.length);
//     const splitLines = rawLines.map(line => {
//         return line.split(',');
//     });
//     console.log(splitLines[0].length)
//     const titles = splitLines.shift();
//     const entries = splitLines.map(line => columns.map(i => parseFloat(line[i])))
//     console.log(entries[0])
//     const output = {
//         columns: columns.map(i => titles[i]),
//         entries: entries,
//     }
//     fs.writeFile('entries00.json', JSON.stringify(output), data => console.log('Done'))
// })