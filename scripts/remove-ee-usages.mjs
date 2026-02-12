#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔍 Removing EE service usages from mixed files...\n');

// EE services/types to remove
const EE_PATTERNS = [
  // Workflow types and services
  { pattern: /workflow:\s*Workflow;?/g, replacement: '' },
  { pattern: /workflows\?\s*:\s*\{[^}]*workflow:\s*Workflow[^}]*\}\[\];?/g, replacement: '' },
  { pattern: /import.*WorkflowService.*from.*;/g, replacement: '' },
  { pattern: /import.*getAllWorkflowsFromEventType.*from.*;/g, replacement: '' },
  { pattern: /import.*scheduleMandatoryReminder.*from.*;/g, replacement: '' },
  { pattern: /import.*sendCancelledReminders.*from.*;/g, replacement: '' },
  { pattern: /import.*allowDisabling\w+Emails.*from.*;/g, replacement: '' },
  { pattern: /import.*WorkflowRepository.*from.*;/g, replacement: '' },
  { pattern: /import.*workflowSelect.*from.*;/g, replacement: '' },
  { pattern: /import.*Workflow.*from.*;/g, replacement: '' },
  { pattern: /import.*WorkflowType.*from.*;/g, replacement: '' },
  
  // Credit/Billing services
  { pattern: /import.*CreditService.*from.*;/g, replacement: '' },
  { pattern: /import.*getTeamBillingServiceFactory.*from.*;/g, replacement: '' },
  { pattern: /import.*getBillingProviderService.*from.*;/g, replacement: '' },
  { pattern: /import.*SeatChangeTrackingService.*from.*;/g, replacement: '' },
  { pattern: /import.*SubscriptionStatus.*from.*;/g, replacement: '' },
  
  // Organization/Team EE services
  { pattern: /import.*getOrgFullOrigin.*from.*;/g, replacement: '' },
  { pattern: /import.*getBookerBaseUrl.*from.*;/g, replacement: '' },
  { pattern: /import.*TeamRepository.*from.*;/g, replacement: '' },
  { pattern: /import.*TeamService.*from.*;/g, replacement: '' },
  { pattern: /import.*getParsedTeam.*from.*;/g, replacement: '' },
  { pattern: /import.*updateNewTeamMemberEventTypes.*from.*;/g, replacement: '' },
  
  // Round-robin and managed events
  { pattern: /import.*roundRobinManualReassignment.*from.*;/g, replacement: '' },
  { pattern: /import.*roundRobinReassignment.*from.*;/g, replacement: '' },
  { pattern: /import.*managedEventManualReassignment.*from.*;/g, replacement: '' },
  { pattern: /import.*managedEventReassignment.*from.*;/g, replacement: '' },
  
  // License/Deployment
  { pattern: /import.*LicenseKeySingleton.*from.*;/g, replacement: '' },
  { pattern: /import.*DeploymentRepository.*from.*;/g, replacement: '' },
  { pattern: /import.*findValidApiKey.*from.*;/g, replacement: '' },
  
  // Misc EE
  { pattern: /import.*UserWithMembership.*from.*;/g, replacement: '' },
  { pattern: /import.*teamQueries.*from.*;/g, replacement: '' },
];

const files = await glob('packages/**/*.{ts,tsx}', {
  ignore: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/ee/**',
  ],
  absolute: true,
});

let totalFiles = 0;
let totalRemovals = 0;

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf-8');
    let modified = false;
    let fileRemovals = 0;
    
    for (const { pattern, replacement } of EE_PATTERNS) {
      const before = content;
      content = content.replace(pattern, replacement);
      if (content !== before) {
        modified = true;
        fileRemovals++;
      }
    }
    
    if (modified) {
      // Clean up multiple empty lines
      content = content.replace(/\n{3,}/g, '\n\n');
      writeFileSync(file, content);
      console.log(`✅ ${file.split('/').slice(-3).join('/')}: removed ${fileRemovals} EE patterns`);
      totalFiles++;
      totalRemovals += fileRemovals;
    }
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err.message);
  }
}

console.log(`\n🎉 Done! Removed ${totalRemovals} EE patterns from ${totalFiles} files.`);
