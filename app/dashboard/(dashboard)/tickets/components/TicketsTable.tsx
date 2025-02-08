"use client";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Role, TicketStatus } from "@prisma/client";

import { changeTicketStatus, getGeneratedTicketsByEventId } from "../actions";
import { useUserStore } from "@/store/userStore";
import type { TTicket } from "@/types/events";
import Dropdown from "@/components/Dropdown";
import { Loader } from "@/components/Loader/Loader";
import { createColumnHelper } from "@tanstack/react-table";
import { useParams } from "next/navigation";

const ticketsTableColumnHelper = createColumnHelper<TTicket>();
export const ticketsTableDefs = {
  columns: [
    ticketsTableColumnHelper.accessor("user.name", {
      header: "Nombre Titular",
      cell: (info) =>
        info.row.original.user.name + " " + info.row.original.user.lastName,
    }),
    ticketsTableColumnHelper.accessor("user.email", {
      header: "Email",
      cell: (info) => {
        let email = info.row.original.user.email;
        if (email.includes("duplicated-")) {
          email = email.split("-")[0];
        }
        return email;
      },
    }),
    ticketsTableColumnHelper.accessor("user.idNumber", {
      header: "Identificación",
      cell: (info) => info.row.original.user.idNumber,
    }),
    ticketsTableColumnHelper.accessor("status", {
      header: "Estado del QR",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-[5px] ${
            info.row.original.status === TicketStatus.ACTIVE
              ? "bg-success text-white"
              : info.row.original.status === TicketStatus.ANNULLED
              ? "bg-red text-white"
              : "bg-warning text-white"
          }`}
        >
          {info.row.original.status === TicketStatus.ACTIVE && "Activo"}
          {info.row.original.status === TicketStatus.ANNULLED && "Anulado"}
          {info.row.original.status === TicketStatus.CHECKED && "Usado"}
        </span>
      ),
    }),
    ticketsTableColumnHelper.accessor("ticketing.name", {
      header: "Etapa",
      cell: (info) => info.row.original.ticketing.name,
    }),
    ticketsTableColumnHelper.accessor("generatedBy", {
      header: "Responsable",
      cell: (info) =>
        info.row.original.generatedBy.name +
        " " +
        info.row.original.generatedBy.lastName,
    }),
  ],
};

interface TicketsTableProps {}

const TicketsTable = (props: TicketsTableProps) => {
  const [data, setData] = useState<TTicket[]>([]);
  const [loading, setLoading] = useState(false);

  const { id: eventId } = useParams<{ id: string }>();

  const { user } = useUserStore();

  const table = useReactTable({
    data,
    columns: ticketsTableDefs.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!user || !eventId) return;
    const filterId = user.role === Role.PROMOTER ? user.id : undefined;
    (async () => {
      const response = await getGeneratedTicketsByEventId(eventId, filterId);
      setData(response);
    })();
  }, [eventId, user]);

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte de QRs");

    worksheet.columns = [
      {
        header: "#",
        key: "ID",
      },
      {
        header: "Nombre",
        key: "Nombre",
      },
      {
        header: "Email",
        key: "Email",
      },
      {
        header: "Identificación",
        key: "Identificacion",
      },
      {
        header: "Estado",
        key: "Estado",
      },
      {
        header: "Valor",
        key: "Valor",
      },
      {
        header: "Responsable",
        key: "Responsable",
      },
    ];

    table.getRowModel().rows.forEach((row, index) => {
      let rowEmail = row.original.user.email;
      if (rowEmail.includes("duplicated-")) {
        rowEmail = rowEmail.split("-")[0];
      }
      let rowStatus =
        row.original.status === TicketStatus.ACTIVE
          ? "Activo"
          : row.original.status === TicketStatus.ANNULLED
          ? "Anulado"
          : "Usado";
      worksheet.addRow({
        ID: index + 1,
        Nombre: row.original.user.name + " " + row.original.user.lastName,
        Email: rowEmail,
        Identificacion: row.original.user.idNumber,
        Estado: rowStatus,
        Valor: row.original.ticketing.price,
        Responsable:
          row.original.generatedBy.name +
          " " +
          row.original.generatedBy.lastName,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "reporte_qrs.xlsx");
  };

  const handleStatusChange = async (
    ticketId: string,
    newStatus: TicketStatus
  ) => {
    const response = await changeTicketStatus(ticketId, newStatus);
    if (response) {
      // update local array of tickets
      const newTickets = data.map((ticket) => {
        if (ticket.id === ticketId) {
          return { ...ticket, status: newStatus };
        }
        return ticket;
      });
      setData(newTickets);
    }
  };

  const handleDropdownAction = async (ticketId: string, actionName: string) => {
    if (actionName === "Anular") {
      handleStatusChange(ticketId, TicketStatus.ANNULLED);
    } else if (actionName === "Activar") {
      handleStatusChange(ticketId, TicketStatus.ACTIVE);
    } else if (actionName === "Descargar") {
      setLoading(true);
      const ticketData = data.find((ticket) => ticket.id === ticketId);
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        body: JSON.stringify({
          ticketId: ticketData?.tickedId,
          name: ticketData?.user.name,
          lastName: ticketData?.user.lastName,
          idNumber: ticketData?.user.idNumber,
          eventId,
        }),
      });
      if (response) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket-${ticketData!.user.name}-${
          ticketData!.user.lastName
        }.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <button
        onClick={handleExport}
        className="p-3 mb-4 rounded-md text-center font-medium text-white bg-primary"
      >
        Exportar a Excel
      </button>
      <table className="w-full">
        {/* table header start */}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="rounded-t-lg">
              <th className="text-center font-medium text-white bg-primary px-5 py-4 lg:px-7.5 2xl:px-11">
                #
              </th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-center font-medium text-white bg-primary px-5 py-4 lg:px-7.5 2xl:px-11"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
              <th className="text-center font-medium text-white bg-primary px-5 py-4 lg:px-7.5 2xl:px-11">
                Editar
              </th>
            </tr>
          ))}
        </thead>
        {/* table header end */}

        {/* table body start */}
        <tbody className="bg-white dark:bg-boxdark">
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id}>
              <td className="text-center border-t border-[#EEEEEE] px-5 py-4 dark:border-strokedark lg:px-7.5 2xl:px-11">
                {index + 1}
              </td>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="text-center border-t border-[#EEEEEE] px-5 py-4 dark:border-strokedark lg:px-7.5 2xl:px-11"
                >
                  <p className="text-[#637381] dark:text-bodydark">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </p>
                </td>
              ))}
              <td className="text-center border-t border-[#EEEEEE] px-5 py-4 dark:border-strokedark lg:px-7.5 2xl:px-11">
                {row.original.status === TicketStatus.ACTIVE && (
                  <Dropdown
                    actions={["Anular", "Descargar"]}
                    elementId={row.original.id}
                    handleActionSelected={handleDropdownAction}
                  />
                )}
                {row.original.status === TicketStatus.ANNULLED && (
                  <Dropdown
                    actions={["Activar"]}
                    elementId={row.original.id}
                    handleActionSelected={handleDropdownAction}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
        {/* table body end */}
      </table>
      {loading && <Loader message="Descargando ticket..." />}
    </div>
  );
};

export default TicketsTable;
