import { z } from "zod";

import {
  attributeSyncRuleSchema,
  fieldMappingWithOptionalIdSchema,

export const updateAttributeSyncSchema: z.ZodType<IUpdateAttributeSyncInput> = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  credentialId: z.number().optional(),
  enabled: z.boolean(),
  organizationId: z.number(),
  ruleId: z.string(),
  rule: attributeSyncRuleSchema,
  syncFieldMappings: z.array(fieldMappingWithOptionalIdSchema),
});

export type ZUpdateAttributeSyncSchema = IUpdateAttributeSyncInput;
