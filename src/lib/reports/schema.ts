import { z } from "zod";

export const FinalReportSchema = z.object({
  rentalPeriod: z.object({
    startDate: z.string(),
    endDate: z.string(),
    assetType: z.enum(["car", "equipment", "home", "storage", "airbnb"]),
  }),

  payment: z.object({
    totalDue: z.number().nonnegative(),
    totalPaid: z.number().nonnegative(),
    latePaymentsCount: z.number().int().nonnegative(),
    missedPaymentsCount: z.number().int().nonnegative(),
  }),

  condition: z.object({
    moveInCondition: z.enum(["excellent", "good", "fair", "poor"]),
    moveOutCondition: z.enum(["excellent", "good", "fair", "poor"]),
    damageReported: z.boolean(),
    damageValue: z.number().nonnegative().optional(),
  }),

  violations: z.object({
    leaseViolation: z.boolean(),
    unauthorizedUse: z.boolean(),
    excessiveWear: z.boolean(),
  }),

  summary: z.object({
    factualSummary: z.string().min(20).max(1000),
  }),

  evidenceRefs: z.array(
    z.object({
      type: z.enum(["photo", "invoice", "contract"]),
      storagePath: z.string(),
    })
  ).optional(),

  acknowledgements: z.object({
    truthful: z.literal(true),
    noBias: z.literal(true),
  }),
});

export type FinalReportData = z.infer<typeof FinalReportSchema>;