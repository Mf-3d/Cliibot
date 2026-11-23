type AnniversaryNotificationLogTable = {
  anniversary_id: number;
  year: number;
  status: string;
  attempt_count: number;
  created_at: Date;
  updated_at: Date;
};

export type Database = {
  anniversary_notification_logs: AnniversaryNotificationLogTable;
};
