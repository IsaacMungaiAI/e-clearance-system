"use server";

import { db } from "@/app/db";
import { systemSettings } from "@/app/db/schema";

export type SettingsData = {
  academicPeriod: string;
  clearanceDeadline: string;
  notificationsEnabled: string;
  maxClearanceRetries: string;
};

const DEFAULTS: SettingsData = {
  academicPeriod: "2025/2026",
  clearanceDeadline: "",
  notificationsEnabled: "true",
  maxClearanceRetries: "3",
};

export async function getSettings(): Promise<SettingsData> {
  try {
    const rows = await db.select().from(systemSettings);

    const map = new Map(rows.map((r) => [r.key, r.value ?? ""]));

    return {
      academicPeriod: map.get("academicPeriod") ?? DEFAULTS.academicPeriod,
      clearanceDeadline:
        map.get("clearanceDeadline") ?? DEFAULTS.clearanceDeadline,
      notificationsEnabled:
        map.get("notificationsEnabled") ?? DEFAULTS.notificationsEnabled,
      maxClearanceRetries:
        map.get("maxClearanceRetries") ?? DEFAULTS.maxClearanceRetries,
    };
  } catch (err) {
    console.error("getSettings failed:", err);
    return DEFAULTS;
  }
}
