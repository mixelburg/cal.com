#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔍 Finding files with broken imports...');

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
let totalFixed = 0;

for (const file of files) {
  try {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    let modified = false;
    const newLines = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check for broken import patterns:
      // 1. Line that starts with "import type {" or "import {" but line after starts with "import"
      if ((line.trim().startsWith('import {') || line.trim().startsWith('import type {')) && 
          !line.includes('}') && 
          !line.includes(' from ')) {
        
        // Look ahead to see if next line is another import (broken multi-line)
        let j = i + 1;
        let foundClosing = false;
        const importLines = [line];
        
        while (j < lines.length && !foundClosing) {
          const nextLine = lines[j];
          
          // If we hit another import statement, the previous import was broken
          if (nextLine.trim().startsWith('import ')) {
            // Remove the broken import block
            console.log(`🔧 ${file.split('/').pop()}: Removing broken import at line ${i + 1}`);
            modified = true;
            i = j - 1; // Skip to just before the next import
            totalFixed++;
            break;
          }
          
          importLines.push(nextLine);
          
          // Check if this line closes the import
          if (nextLine.includes(' from ') && nextLine.includes(';')) {
            foundClosing = true;
            // Add all the import lines
            newLines.push(...importLines);
            i = j;
          }
          
          j++;
        }
        
        if (!foundClosing && j >= lines.length) {
          // EOF reached without closing, skip the broken import
          console.log(`🔧 ${file.split('/').pop()}: Removing incomplete import at line ${i + 1}`);
          modified = true;
          totalFixed++;
          break;
        }
      } else {
        newLines.push(line);
      }
      
      i++;
    }
    
    if (modified) {
      writeFileSync(file, newLines.join('\n'));
      totalFiles++;
    }
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err.message);
  }
}

console.log(`\n🎉 Done! Fixed ${totalFixed} broken imports in ${totalFiles} files.`);
