import { useState } from "react";
import Image from "next/image";

import { Modal } from "@/components/Modal/Modal";
import { CreditCardForm } from "../CreditCardForm/CreditCardForm";
import { Loader } from "@/components/Loader/Loader";
import { PAYMENT_METHOD } from "@/types/wompi";
import PSEForm from "../PSEForm/PSEForm";
import { useUserStore } from "@/store/userStore";
import { Ticketing } from "@prisma/client";
import { TicketingSelector } from "../TicketingSelector/TicketingSelector";
import { usePaymentsStore } from "@/store/payments";
import { WelcomeView } from "../WelcomeView/WelcomeView";
import { usePurchase } from "./hooks/usePurchase";

interface PurchaseModalProps {
  handleClose: () => void;
}

export const PurchaseModal = ({ handleClose }: PurchaseModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { selectedEvent, paymentStep, setPaymentStep } = usePaymentsStore();

  const { user } = useUserStore();

  return (
    <Modal opened handleClose={handleClose}>
      <>
        {user && (
          <>
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              {paymentStepToComponentMap[paymentStep].title}
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            {paymentStepToComponentMap[paymentStep].component}

            <div className="-mx-3 flex flex-wrap gap-y-4">
              {/* <div className="w-full px-3 flex justify-between">
                <button
                  className="px-4 py-2 bg-primary rounded-full text-white"
                  onClick={() => setPaymentStep(paymentStep - 1)}
                >
                  {" "}
                  {"<"}{" "}
                </button>
                <button
                  className="px-4 py-2 bg-primary rounded-full text-white"
                  onClick={() => setPaymentStep(paymentStep + 1)}
                >
                  {" "}
                  {">"}{" "}
                </button>
              </div> */}
              {paymentStep !== 3 && (
                <div className="w-full px-3">
                  <button
                    className="block w-full rounded border border-stroke bg-primary p-3 text-center font-medium text-white transition"
                    onClick={() => setPaymentStep(paymentStep + 1)}
                  >
                    Continuar
                  </button>
                </div>
              )}
              <div className="w-full px-3">
                <button
                  onClick={() => handleClose()}
                  className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <p className="mt-5 mb-5 text-md font-bold text-black">
              ** Pagarás:{" "}
              {`${Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              }).format(selectedEvent!.ticketing[0].price)}`}{" "}
              {/* {""}+ 5% de comisión = {""}
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              }).format(
                selectedEvent.ticketing[0].price * 0.05 +
                  selectedEvent.ticketing[0].price
              )}{" "} */}
              **
            </p>
            <div className="mt-4 mb-4 flex items-center">
              <span className="icon-[wpf--security-checked] text-4xl flex-[15]"></span>
              <span className="text-sm flex-[80] text-justify">
                Todas nuestras compras estan protegidas y son procesadas
                directmente por Wompi - Bancolombia. No almacenamos los datos de
                tu tarjeta.
              </span>
            </div>
          </>
        )}
      </>
      <>{!user && <WelcomeView />}</>

      {isLoading && <Loader message="Procesando pago..." />}
    </Modal>
  );
};

const PurchaseTicketingSelectorStep = () => {
  const { selectedEvent, setSelectedTicketing } = usePaymentsStore();

  const handleTicketingSelection = (ticketing: Record<string, number>) => {
    console.log(ticketing);
  };

  return (
    <>
      <TicketingSelector
        ticketing={selectedEvent!.ticketing}
        handleTicketingSelection={handleTicketingSelection}
      />
    </>
  );
};

const PurchasePaymentMethodSelectorStep = () => {
  const { setSelectedPaymentMethod } = usePaymentsStore();

  return (
    <section className="flex flex-col gap-8 w-full justify-around items-center mb-8">
      <figure
        className={`w-[160px] h-[60px] border-2 border-transparent hover:border-[rgb(60,80,224)] rounded-xl cursor-pointer shadow-10 overflow-hidden relative`}
        onClick={() => {
          setSelectedPaymentMethod(PAYMENT_METHOD.CARD);
        }}
      >
        <Image
          src="/cards-logo.png"
          alt="Tarjetas Visa - Mastercard"
          layout="fill"
          objectFit="contain"
        />
      </figure>
      <figure
        className={`w-[160px] h-[60px] border-2 border-transparent hover:border-[rgb(60,80,224)] rounded-xl cursor-pointer shadow-10 overflow-hidden relative`}
        onClick={() => {
          setSelectedPaymentMethod(PAYMENT_METHOD.PSE);
        }}
      >
        <Image
          src="/logo-pse.png"
          alt="PSE"
          layout="fill"
          objectFit="contain"
        />
      </figure>
    </section>
  );
};

const PurchasePaymentFormStep = () => {
  const { selectedEvent, selectedPaymentMethod } = usePaymentsStore();
  const { resolvePaymentProcess } = usePurchase();

  return (
    <>
      {selectedPaymentMethod === PAYMENT_METHOD.CARD && (
        <CreditCardForm
          orderAmount={selectedEvent!.ticketing[0].price}
          onSubmitPayment={resolvePaymentProcess}
        />
      )}
      {selectedPaymentMethod === PAYMENT_METHOD.PSE && (
        <PSEForm
          orderAmount={selectedEvent!.ticketing[0].price}
          onSubmitPayment={resolvePaymentProcess}
        />
      )}
    </>
  );
};

const paymentStepToComponentMap: Record<
  number,
  { title: string; component: JSX.Element }
> = {
  1: {
    title: "Selecciona la etapa",
    component: <PurchaseTicketingSelectorStep />,
  },
  2: {
    title: "Selecciona el método de pago",
    component: <PurchasePaymentMethodSelectorStep />,
  },
  3: {
    title: "Ingresa los datos de pago",
    component: <PurchasePaymentFormStep />,
  },
};
