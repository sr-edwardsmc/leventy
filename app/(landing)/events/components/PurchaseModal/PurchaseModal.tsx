import { useState } from "react";
import Image from "next/image";

import { Modal } from "@/components/Modal/Modal";
import { CreditCardForm } from "../CreditCardForm/CreditCardForm";
import { usePurchase } from "./hooks/usePurchase";
import { Loader } from "@/components/Loader/Loader";
import { PAYMENT_METHOD } from "@/types/wompi";
import PSEForm from "../PSEForm/PSEForm";
import { useUserStore } from "@/store/userStore";
import { TEvent } from "@/types/events";
import { Ticketing } from "@prisma/client";

interface PurchaseModalProps {
  selectedEvent: TEvent & { ticketing: Ticketing[] };
  handleClose: () => void;
}

export const PurchaseModal = ({
  selectedEvent,
  handleClose,
}: PurchaseModalProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { processCreditCardPayment, processPSEPayment } = usePurchase({
    selectedEvent,
  });

  const [modalTitle, setModalTitle] = useState<string>(
    "Que método de pago deseas usar?"
  );

  const { user } = useUserStore();

  const processPayment = async (paymentMethod: PAYMENT_METHOD, data: any) => {
    setIsLoading(true);
    const paymentResolver = {
      ["CARD"]: async () => {
        await processCreditCardPayment({
          cardData: {
            card_holder: data.cardHolder,
            number: data.cardNumber,
            cvc: data.cvc,
            exp_month: data.expirationDate.split("/")[0],
            exp_year: data.expirationDate.split("/")[1],
          },
          amount: data.amount,
          installments: data.installments,
        });
      },
      ["NEQUI"]: () => {},
      ["DAVIPLATA"]: () => {},
      ["PSE"]: async () => {
        await processPSEPayment({
          amount: data.amount,
          customerEmail: user?.email,
          paymentMethod: {
            type: PAYMENT_METHOD.PSE,
            user_type: data.personType,
            user_legal_id_type: user?.idType,
            user_legal_id: user?.idNumber,
            financial_institution_code: data.financialInstitutionId,
            payment_description: data.paymentDescription,
          },
          customerData: {
            full_name: user?.name,
            phone_number: user?.phone,
          },
        });
      },
    };
    await paymentResolver[paymentMethod]();
    setIsLoading(false);
  };

  return (
    <Modal opened handleClose={handleClose}>
      <>
        {user && (
          <>
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              {modalTitle}
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            {selectedPaymentMethod === "" && (
              <section className="flex flex-col gap-8 w-full justify-around items-center mb-8">
                <figure
                  className={`w-[160px] h-[60px] border-2 border-transparent hover:border-[rgb(60,80,224)] rounded-xl cursor-pointer shadow-10 overflow-hidden relative`}
                  onClick={() => {
                    setSelectedPaymentMethod(PAYMENT_METHOD.CARD);
                    setModalTitle("Ingresa tu email y los datos de tu tarjeta");
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
                    setModalTitle("Selecciona tu entidad financiera");
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
            )}
            {selectedPaymentMethod === PAYMENT_METHOD.CARD && (
              <CreditCardForm
                orderAmount={selectedEvent.ticketing[0].price}
                onSubmitPayment={processPayment}
              />
            )}
            {selectedPaymentMethod === PAYMENT_METHOD.PSE && (
              <PSEForm
                orderAmount={selectedEvent.ticketing[0].price}
                onSubmitPayment={processPayment}
              />
            )}
            <p className="mt-5 mb-5 text-md font-bold text-black">
              ** Pagarás:{" "}
              {`${Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              }).format(selectedEvent.ticketing[0].price)}`}{" "}
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
                Todas nuestras compras están protegidas y son procesadas
                directamente por Wompi - Bancolombia. No almacenamos los datos
                de tu tarjeta.
              </span>
            </div>
            <div className="-mx-3 flex flex-wrap gap-y-4">
              <div className="w-full px-3">
                <button
                  onClick={() => handleClose()}
                  className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </>
        )}
      </>
      <>
        {!user && (
          <>
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              ¡Bienvenid@! 🎉
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <p className="text-center text-black dark:text-white">
              Necesitamos algunos datos para el proceso de pago y registrar tú
              ingreso para el evento, por favor{" "}
              <a href="/login" className="text-primary">
                inicia sesión
              </a>{" "}
              o{" "}
              <a href="/signup" className="text-primary">
                registrate
              </a>{" "}
              para continuar. Gracias!
            </p>
          </>
        )}
      </>

      {isLoading && <Loader message="Procesando pago..." />}
    </Modal>
  );
};
