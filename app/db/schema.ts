import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * DEPARTMENTS
 */
export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  code: text("code").unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * PROFILES (Supabase auth.users extension)
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // references auth.users.id (external FK not enforced in Drizzle)
  fullName: text("full_name"),
  role: text("role", {
    enum: [
      "student",
      "officer_library",
      "officer_finance",
      "officer_hostel",
      "registrar",
    ],
  }),
  departmentId: uuid("department_id").references(() => departments.id),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * CLEARANCE REQUESTS
 */
export const clearanceRequests = pgTable("clearance_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => profiles.id),
  status: text("status", {
    enum: [
      "pending",
      "approved",
      "rejected",
    ],
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * CLEARANCE STEPS
 */
export const clearanceSteps = pgTable("clearance_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  clearanceRequestId: uuid("clearance_request_id").references(
    () => clearanceRequests.id
  ),
  departmentId: uuid("department_id").references(() => departments.id),
  status: text("status", {
    enum: [
      "pending",
      "approved",
      "rejected",
    ],
  }).default("pending"),
  comment: text("comment"),
  updatedAt: timestamp("updated_at"),
});


//audit logs for tracking changes and actions in the system
export const auditLogs =
  pgTable("audit_logs", {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    actorId: uuid(
      "actor_id"
    ).notNull(),

    action: text(
      "action"
    ).notNull(),

    entity: text(
      "entity"
    ).notNull(),

    entityId: uuid(
      "entity_id"
    ),

    oldData: jsonb(
      "old_data"
    ),

    newData: jsonb(
      "new_data"
    ),

    createdAt:
      timestamp("created_at")
        .defaultNow(),
  });

//activity logs for tracking user activities in the system
export const activityLogs =
  pgTable("activity_logs", {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid(
      "user_id"
    ).notNull(),

    action: text(
      "action"
    ).notNull(),

    description:
      text("description"),

    createdAt:
      timestamp("created_at")
        .defaultNow(),
  });


/**
 * ROOMS
 */
export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomNumber: varchar("room_number", { length: 20 }).notNull(),
  hostelName: varchar("hostel_name", { length: 100 }).notNull(),
  capacity: integer("capacity").notNull().default(2),
  floor: integer("floor"),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * ROOM ASSIGNMENTS (residents)
 */
export const roomAssignments = pgTable("room_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").notNull().references(() => profiles.id),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  checkInDate: timestamp("check_in_date").defaultNow(),
  checkOutDate: timestamp("check_out_date"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

//notifications table for storing user notifications in the system
export const notifications =
  pgTable("notifications", {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid(
      "user_id"
    ).notNull(),

    title: text("title"),

    message:
      text("message"),

    read: boolean("read")
      .default(false),

    createdAt:
      timestamp("created_at")
        .defaultNow(),
  });