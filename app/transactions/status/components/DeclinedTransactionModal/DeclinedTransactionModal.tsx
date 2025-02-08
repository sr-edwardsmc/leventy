import { Modal } from "@/components/Modal/Modal";
import Link from "next/link";

export const DeclinedTransactionModal = ({
  rejectedReason,
}: {
  rejectedReason: string;
}) => {
  return (
    <Modal opened handleClose={() => {}}>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5
        }`}
      >
        <div className="md:px-17.5 relative w-full max-w-142.5 rounded-lg bg-red px-8 py-12 text-center md:py-15">
          <span className="mx-auto inline-block">
            <span className="icon-[fluent-mdl2--error-badge] text-8xl text-white"></span>
          </span>
          <h3 className="mt-5.5 pb-2 text-xl font-bold text-white sm:text-4xl">
            Transaccion Rechazada
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-white"></span>
          <p className="mb-7.5 text-white">
            Lo sentimos mucho, tu banco a declinado la transacción, motivo:{" "}
            {rejectedReason}
          </p>
          <Link
            href="/events"
            className="inline-block rounded border border-white px-12.5 py-3 text-center font-medium text-white transition hover:bg-white hover:text-red"
          >
            Regresar
          </Link>
        </div>
      </div>
    </Modal>
  );
};
