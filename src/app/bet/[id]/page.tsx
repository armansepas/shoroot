import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BetDetails } from "./components/bet-details";
import { AdminControls } from "./components/admin-controls";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BetDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const betId = parseInt(id);

  if (isNaN(betId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">
                Loading bet details...
              </span>
            </div>
          }
        >
          <BetDetails betId={betId} />
          <AdminControls betId={betId} />
        </Suspense>
      </div>
    </div>
  );
}
