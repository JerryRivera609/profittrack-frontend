import { ActivityCard } from "./activity-card";
import { MetricsGrid } from "./metrics-grid";
import { ProfitabilityChart } from "./profitability-chart";

export function DashboardContent() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <MetricsGrid />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ProfitabilityChart />
        <ActivityCard />
      </div>
    </div>
  );
}
