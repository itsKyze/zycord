const fs = require('fs');
const c = fs.readFileSync('assets/cache/web.d3978f1210c00a8f.js', 'utf8');

const match1 = c.match(/if\(null==(\w+)\)\{let \w+=Error\("Couldn't find price"\);throw .*?,\w+\}return \1/);
console.log('Match 1 (Couldn\'t find price):', !!match1);

const match2 = c.match(/let (\w+)=Error\("Plan not found"\);throw .*?,\1/);
console.log('Match 2 (Plan not found):', !!match2);
if (match2) console.log('Match 2 text:', match2[0]);
