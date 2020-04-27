const fs = require('fs'); 

console.log('hello world');

const readFilePromise = fileName => new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
        if(data) resolve(data);
        else reject(err);
    })
})

const columns = [3,5,6,7,10,11]

readFilePromise('./TgasSource_000-000-000.csv').then(data => {
    const rawLines = data.split('\n');
    console.log(rawLines.length);
    const splitLines = rawLines.map(line => {
        return line.split(',');
    });
    console.log(splitLines[0].length)
    const titles = splitLines.shift();
    const entries = splitLines.map(line => columns.map(i => parseFloat(line[i])))
    console.log(entries[0])
    const output = {
        columns: columns.map(i => titles[i]),
        entries: entries,
    }
    fs.writeFile('entries00.json', JSON.stringify(output), data => console.log('Done'))
})

//[385334123516493600,2015,4.612109310284095,0.2875862660487077,280.74007502567116,0.30550012991926545]