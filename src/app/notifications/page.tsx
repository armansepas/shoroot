import { Suspense } from "react";
import { NotificationsPageClient } from "./components/notifications-page-client";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">
                Loading notifications...
              </span>
            </div>
          }
        >
          <NotificationsPageClient />
        </Suspense>
      </div>
    </div>
  );
}
