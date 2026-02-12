#!/bin/bash
# Remove all references to deleted team handlers from the router

FILE="packages/trpc/server/routers/viewer/teams/_router.tsx"

# Use perl for multi-line regex replacements
perl -i -0pe '
  # Remove createInvite procedure
  s/  createInvite: authedProcedure\.input\(ZCreateInviteInputSchema\)\.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  
  # Remove setInviteExpiration procedure
  s/  setInviteExpiration: authedProcedure\.input\(ZSetInviteExpirationInputSchema\)\.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  
  # Remove deleteInvite procedure
  s/  deleteInvite: authedProcedure\.input\(ZDeleteInviteInputSchema\)\.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  
  # Remove inviteMemberByToken procedure
  s/  inviteMemberByToken: authedProcedure\.input\(ZInviteMemberByTokenSchemaInputSchema\)\.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  
  # Remove resendInvitation procedure
  s/  resendInvitation: authedProcedure\.input\(ZResendInvitationInputSchema\)\.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  
  # Remove roundRobin procedures (multi-line)
  s/  roundRobinReassign: authedProcedure\.input\(ZRoundRobinReassignInputSchema\)\.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  s/  roundRobinManualReassign: authedProcedure\n    \.input\(ZRoundRobinManualReassignInputSchema\)\n    \.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  s/  getRoundRobinHostsToReassign: authedProcedure\.input\(ZGetRoundRobinHostsInputSchema\)\.query\(async \(opts\) => \{[^}]+\}\),\n//g;
  
  # Remove managedEvent procedures (multi-line)
  s/  \/\/ Managed Events Reassignment\n  managedEventReassign: authedProcedure\.input\(ZManagedEventReassignInputSchema\)\.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  s/  managedEventManualReassign: authedProcedure\n    \.input\(ZManagedEventManualReassignInputSchema\)\n    \.mutation\(async \(opts\) => \{[^}]+\}\),\n//g;
  s/  getManagedEventUsersToReassign: authedProcedure\n    \.input\(ZGetManagedEventUsersToReassignInputSchema\)\n    \.query\(async \(opts\) => \{[^}]+\}\),\n//g;
' "$FILE"

echo "✅ Cleaned up team router"
