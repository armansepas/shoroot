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
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <BetDetails betId={betId} />
        <AdminControls betId={betId} />
      </Suspense>
    </div>
  );
}
