#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔍 Finding files with /ee imports...');

const files = await glob('**/*.{ts,tsx}', {
  ignore: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/ee/**',
  ],
  absolute: true,
});

let totalFiles = 0;
let totalLinesRemoved = 0;

for (const file of files) {
  try {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    const newLines = [];
    let linesRemoved = 0;
    let inMultilineImport = false;
    let importBuffer = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this is an EE import
      const isEEImport = 
        line.match(/from\s+["']@calcom\/(features\/)?ee\//) ||
        line.match(/import.*["']@calcom\/(features\/)?ee\//);
      
      // Handle multiline imports
      if (isEEImport && line.includes('from') && !line.trim().endsWith(';')) {
        inMultilineImport = true;
        importBuffer = line;
        linesRemoved++;
        continue;
      }
      
      if (inMultilineImport) {
        importBuffer += '\n' + line;
        linesRemoved++;
        if (line.includes(';') || line.includes('from')) {
          inMultilineImport = false;
          importBuffer = '';
        }
        continue;
      }
      
      if (isEEImport) {
        linesRemoved++;
        continue;
      }
      
      // Also remove export lines that reference /ee
      const isEEExport = line.match(/export.*from\s+["']@calcom\/(features\/)?ee\//);
      if (isEEExport) {
        linesRemoved++;
        continue;
      }
      
      newLines.push(line);
    }
    
    if (linesRemoved > 0) {
      // Remove consecutive empty lines (cleanup)
      const cleaned = newLines.join('\n').replace(/\n{3,}/g, '\n\n');
      writeFileSync(file, cleaned);
      totalFiles++;
      totalLinesRemoved += linesRemoved;
      console.log(`✅ ${file.split('/').pop()}: removed ${linesRemoved} line(s)`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err.message);
  }
}

console.log(`\n🎉 Done! Updated ${totalFiles} files, removed ${totalLinesRemoved} import lines.`);
