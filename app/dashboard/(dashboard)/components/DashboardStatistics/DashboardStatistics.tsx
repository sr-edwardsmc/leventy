import CardDataStats from "@/components/Cards/CardDataStats";

interface DashboardStatisticsProps {
  totalSoldTickets: number;
  totalEvents: number;
  totalUsers: number;
  totalMoney: number;
}

export const DashboardStatistics = (props: DashboardStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardDataStats
        title="Total Tickets Vendidos"
        total={props.totalSoldTickets.toString()}
      >
        <span className="icon-[hugeicons--ticket-01] text-2xl"></span>
      </CardDataStats>
      <CardDataStats title="Total Usuarios" total={props.totalUsers.toString()}>
        <span className="icon-[hugeicons--user] text-2xl"></span>
      </CardDataStats>
      <CardDataStats
        title="Total Dinero"
        total={`${Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }).format(props.totalMoney)}`}
      >
        <span className="icon-[hugeicons--dollar-square] text-2xl"></span>
      </CardDataStats>
      <CardDataStats title="Total Eventos" total={props.totalEvents.toString()}>
        <span className="icon-[hugeicons--calendar-01] text-2xl"></span>
      </CardDataStats>
    </div>
  );
};
