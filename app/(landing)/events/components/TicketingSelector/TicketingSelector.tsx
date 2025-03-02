import { Ticketing } from "@prisma/client";
import { useEffect, useState } from "react";

interface TicketingSelectorProps {
  ticketing: Ticketing[];
  handleTicketingSelection: (selectedTickets: Record<string, number>) => void;
}

const TicketingSelector = ({
  ticketing,
  handleTicketingSelection,
}: TicketingSelectorProps) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});

  const calculateTotalAmount = () => {
    let total = 0;
    for (const [ticketingId, amount] of Object.entries(selectedTickets)) {
      const ticket = ticketing.find((ticket) => ticket.id === ticketingId);
      if (ticket) {
        total += ticket.price * amount;
      }
    }
    setTotalAmount(total);
  };

  const handleAmountChange = (ticketingId: string, amount: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketingId]: amount,
    }));
  };

  useEffect(() => {
    calculateTotalAmount();
    handleTicketingSelection(selectedTickets);
  }, [selectedTickets]);

  return (
    <section className="flex flex-col gap-4 mb-4 w-full justify-between items-center">
      <ul className="w-full">
        {ticketing.map((ticketing) => (
          <li
            key={ticketing.id}
            className="flex gap-2 mb-6 items-center justify-between"
          >
            <span className="text-lg text-black px-4">
              {ticketing.name} - ${ticketing.price}
            </span>
            <AmountCounter
              handleCount={(count) => {
                handleAmountChange(ticketing.id, count);
              }}
            />
          </li>
        ))}
      </ul>
      <div className="w-full h-[1px] bg-black mx-4"></div>
      <article className="w-full justify-between">
        <span className="text-black text-2xl font-bold">Total: </span>
        <span className="text-black text-2xl font-bold">
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
          }).format(totalAmount)}
        </span>
      </article>
    </section>
  );
};

const AmountCounter = ({
  handleCount,
}: {
  handleCount: (count: number) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    handleCount(amount);
  }, [amount]);

  return (
    <div className="flex gap-4 bg-primary p-2 rounded-lg text-white items-center">
      <button
        disabled={amount === 0}
        onClick={() => setAmount(amount - 1)}
        className="cursor-pointer w-full text-center"
      >
        <span className="icon-[hugeicons--minus-sign] text-white font-bold"></span>
      </button>
      <div className="text-lg text border-x-2 border-white text-white px-4">
        {amount}
      </div>
      <button
        onClick={() => setAmount(amount + 1)}
        className="cursor-pointer w-full text-center"
      >
        <span className="icon-[hugeicons--plus-sign] text-white font-bold"></span>
      </button>
    </div>
  );
};

export { TicketingSelector };
