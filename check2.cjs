const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let stack = [];
for (let i = 0; i < code.length; i++) {
  let line = code[i];
  
  let pos = 0;
  while (pos < line.length) {
    let divOpen = line.indexOf('<div', pos);
    let divClose = line.indexOf('</div', pos);
    
    if (divOpen !== -1 && (divOpen < divClose || divClose === -1)) {
       stack.push(i + 1);
       pos = divOpen + 4;
    } else if (divClose !== -1) {
       stack.pop();
       pos = divClose + 5;
    } else {
       break;
    }
  }
}

console.log('Unclosed div opened at line:', stack);
