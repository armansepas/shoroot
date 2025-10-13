import { Suspense } from "react";
import { NotificationsPageClient } from "./components/notifications-page-client";

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationsPageClient />
    </Suspense>
  );
}
