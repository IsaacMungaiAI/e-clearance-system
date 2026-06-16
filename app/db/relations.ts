import { relations } from "drizzle-orm";
import {
  departments,
  profiles,
  clearanceRequests,
  clearanceSteps,
} from "./schema";

/**
 * DEPARTMENTS
 */
export const departmentsRelations = relations(departments, ({ many }) => ({
  profiles: many(profiles),
  steps: many(clearanceSteps),
}));

/**
 * PROFILES
 */
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  department: one(departments, {
    fields: [profiles.departmentId],
    references: [departments.id],
  }),

  clearanceRequests: many(clearanceRequests),
}));

/**
 * CLEARANCE REQUESTS
 */
export const clearanceRequestsRelations = relations(
  clearanceRequests,
  ({ one, many }) => ({
    student: one(profiles, {
      fields: [clearanceRequests.studentId],
      references: [profiles.id],
    }),

    steps: many(clearanceSteps),
  })
);

/**
 * CLEARANCE STEPS
 */
export const clearanceStepsRelations = relations(
  clearanceSteps,
  ({ one }) => ({
    request: one(clearanceRequests, {
      fields: [clearanceSteps.clearanceRequestId],
      references: [clearanceRequests.id],
    }),

    department: one(departments, {
      fields: [clearanceSteps.departmentId],
      references: [departments.id],
    }),
  })
);