import { Modal } from "@/components/Modal/Modal";
import Link from "next/link";

export const ApprovedTransactionModal = () => {
  return (
    <Modal opened handleClose={() => {}}>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5
        }`}
      >
        <div className="md:px-17.5 relative w-full max-w-142.5 rounded-lg bg-primary px-8 py-12 text-center md:py-15">
          <span className="mx-auto inline-block">
            <svg
              width="78"
              height="78"
              viewBox="0 0 78 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect opacity="0.1" width="78" height="78" rx="37" fill="white" />
              <path
                d="M39.6114 16.8999C27.0342 16.8999 16.8984 27.0357 16.8984 39.6129C16.8984 52.1901 27.0342 62.3999 39.6114 62.3999C52.1887 62.3999 62.3984 52.1901 62.3984 39.6129C62.3984 27.0357 52.1887 16.8999 39.6114 16.8999ZM39.6114 59.8105C28.5139 59.8105 19.4879 50.7105 19.4879 39.6129C19.4879 28.5154 28.5139 19.4893 39.6114 19.4893C50.709 19.4893 59.809 28.5154 59.809 39.6129C59.809 50.7105 50.709 59.8105 39.6114 59.8105Z"
                fill="white"
              />
              <path
                d="M49.6748 42.2023H29.5513C28.8854 42.2023 28.2935 42.4982 27.8496 43.0161C27.4797 43.534 27.2578 44.1258 27.4057 44.7917C28.5155 50.5624 33.6204 54.8535 39.613 54.8535C45.6057 54.8535 50.7106 50.6364 51.8204 44.7917C51.9683 44.1998 51.7464 43.534 51.3765 43.0161C51.0065 42.4982 50.3407 42.2023 49.6748 42.2023ZM39.613 52.2641C35.1 52.2641 31.1789 49.1567 30.0691 44.7917H49.2309C48.0472 49.1567 44.126 52.2641 39.613 52.2641Z"
                fill="white"
              />
              <path
                d="M30.807 35.6919C32.4346 35.6919 33.7664 34.3602 33.7664 32.7325C33.7664 31.1049 32.4346 29.7732 30.807 29.7732C29.1794 29.7732 27.8477 31.1049 27.8477 32.7325C27.9216 34.4342 29.2533 35.6919 30.807 35.6919Z"
                fill="white"
              />
              <path
                d="M48.4164 35.7659C50.0508 35.7659 51.3757 34.4409 51.3757 32.8065C51.3757 31.1721 50.0508 29.8472 48.4164 29.8472C46.782 29.8472 45.457 31.1721 45.457 32.8065C45.457 34.4409 46.782 35.7659 48.4164 35.7659Z"
                fill="white"
              />
            </svg>
          </span>
          <h3 className="mt-5.5 pb-2 text-xl font-bold text-white sm:text-4xl">
            Transacción Aprobada
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
          <p className="mb-7.5 text-white">
            En unos instantes recibirás un correo con los detalles de tu compra
            y tu código QR que será tu ingreso al evento.
          </p>
          <Link
            href="/events"
            className="inline-block rounded border border-white px-12.5 py-3 text-center font-medium text-white transition hover:bg-white hover:text-primary"
          >
            Regresar
          </Link>
        </div>
      </div>
    </Modal>
  );
};
