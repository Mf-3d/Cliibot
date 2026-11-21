export type AnniversaryNotificationLogTable = {
  anniversary_id: string;
  year: number;
  status: "pending" | "sent" | "failed";
  attempt_count: number;
  created_at: any; // 不明
  updated_at: any; // 不明
};

export type Database = {
  anniversary_notification_logs: AnniversaryNotificationLogTable;
};
