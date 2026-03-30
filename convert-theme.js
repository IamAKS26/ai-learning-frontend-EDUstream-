const fs = require('fs');
const path = require('path');

const replacements = {
  // text
  'text-white': 'text-slate-900',
  'text-slate-300': 'text-slate-700',
  'text-slate-400': 'text-slate-500',
  // borders
  'border-white/10': 'border-black/5',
  'border-white/5': 'border-black/5',
  'border-white/20': 'border-black/10',
  'border-white/30': 'border-black/10',
  'border-t-white/10': 'border-t-black/5',
  // bg
  'bg-white/5': 'bg-slate-50',
  'bg-white/10': 'bg-slate-100',
  'bg-white/20': 'bg-slate-200',
  'hover:bg-white/5': 'hover:bg-slate-100',
  'hover:bg-white/10': 'hover:bg-slate-200',
  // specific dark bgs
  'bg-[#1a1a1a]': 'bg-white',
  'bg-black/20': 'bg-slate-50',
  'bg-[#121212]/95': 'bg-white/95',
  'bg-background-dark/80': 'bg-white/80',
  'bg-surface-dark': 'bg-white',
  // misc
  'text-background-dark': 'text-slate-900',
  'bg-slate-800': 'bg-slate-100'
};

function walk(dir, callback) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      let filepath = path.join(dir, file);
      fs.stat(filepath, (err, stats) => {
        if (stats.isDirectory()) {
          walk(filepath, callback);
        } else if (stats.isFile() && (filepath.endsWith('.tsx') || filepath.endsWith('.ts'))) {
          callback(filepath);
        }
      });
    });
  });
}

const targetDir = path.join(__dirname, 'src');

walk(targetDir, (filepath) => {
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) throw err;
    let modified = data;
    
    // We already manually rewrote dashboard/page.tsx, module/page.tsx, learn/page.tsx, not-found.tsx, globals.css, TopNav.tsx
    // Skip them to avoid messing up the new light design which already has correct classes
    const skipFiles = ['dashboard', 'module', 'learn', 'not-found', 'TopNav.tsx'];
    if (skipFiles.some(skip => filepath.includes(skip))) {
        return;
    }

    for (const [key, value] of Object.entries(replacements)) {
      // Split by space or quotation marks to replace exact classes
      // A simple split and join or regex wrapper
      const regex = new RegExp(`(?<=["'\\s>])` + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + `(?=["'\\s<])`, 'g');
      modified = modified.replace(regex, value);
    }
    
    if (data !== modified) {
      fs.writeFile(filepath, modified, 'utf8', (err) => {
        if (err) throw err;
        console.log(`Updated ${filepath}`);
      });
    }
  });
});
