import type { Generated } from "kysely";

type AnniversaryNotificationLogTable = {
  anniversary_id: string;
  year: number;
  status: Generated<"pending" | "sent" | "failed">;
  attempt_count: Generated<number>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type Database = {
  anniversary_notification_logs: AnniversaryNotificationLogTable;
};
