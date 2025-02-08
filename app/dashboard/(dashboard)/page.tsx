import { getSession } from "@/utils/auth";
import { getDashboardStatictics } from "./actions";
import { DashboardStatistics } from "./components/DashboardStatistics/DashboardStatistics";

export default async function DashboardPage() {
  const user = await getSession();
  const dashboardStatistics = await getDashboardStatictics(user!.collectiveId!);

  return (
    <>
      <DashboardStatistics {...dashboardStatistics} />
    </>
  );
}
