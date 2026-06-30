const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let hasError = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+.*?\s+from\s+['\"](.*?)['\"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const resolvedPath = path.resolve(path.dirname(file), importPath);
      const dir = path.dirname(resolvedPath);
      const base = path.basename(resolvedPath);
      
      if (fs.existsSync(dir)) {
        const filesInDir = fs.readdirSync(dir);
        const exactMatch = filesInDir.find(f => f === base || f.startsWith(base + '.'));
        
        if (!exactMatch) {
          const caseInsensitiveMatch = filesInDir.find(f => f.toLowerCase() === base.toLowerCase() || f.toLowerCase().startsWith(base.toLowerCase() + '.'));
          if (caseInsensitiveMatch) {
            console.error('Case mismatch in ' + file + ': imported ' + importPath + ', found ' + caseInsensitiveMatch);
            hasError = true;
          }
        }
      }
    }
  }
});

if (!hasError) console.log('No case mismatches found.');
