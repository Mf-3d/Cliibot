export type AnniversaryNotificationLog = {
  anniversaryId: string;
  year: number;
  status: "pending" | "sent" | "failed";
  attemptCount: number;
  createdAt: Date;
  updatedAt: Date;
};
