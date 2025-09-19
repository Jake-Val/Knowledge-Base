const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'content');

function scan(p) {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    return {
      name: path.basename(p),
      type: 'dir',
      children: fs.readdirSync(p).sort((a,b)=>a.localeCompare(b))
        .map(ch => scan(path.join(p, ch)))
    };
  } else {
    return {
      name: path.basename(p),
      type: 'file',
      path: 'content/' + path.relative(ROOT, p).replace(/\\/g,'/')
    };
  }
}

const tree = fs.existsSync(ROOT) ? { name: 'root', type: 'dir', children: fs.readdirSync(ROOT)
  .sort((a,b)=>a.localeCompare(b))
  .map(ch => scan(path.join(ROOT, ch))) } : {name:'root', type:'dir', children:[]};

fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(tree, null, 2));
console.log('Wrote site/manifest.json');
