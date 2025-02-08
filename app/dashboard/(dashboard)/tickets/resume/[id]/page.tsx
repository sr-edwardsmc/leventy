import TicketsTable from "../../components/TicketsTable";

interface TableData {
  name: string;
  position: string;
  email: string;
  role: string;
}

async function TicketsResumePage() {
  return (
    <section className="w-full flex gap-4 flex-col p-5">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        Lista de QR&apos;s
      </h2>
      <TicketsTable />
    </section>
  );
}

export default TicketsResumePage;
