"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Select from "@/components/Form/Select";
import { TUser } from "@/types/users";
import { TEvent } from "@/types/events";
import { generateTicket, getTicketing } from "../actions";
import { useUserStore } from "@/store/userStore";
import { Loader } from "@/components/Loader/Loader";

const formInitialValues = {
  eventId: "",
  birthday: "",
  fullName: "",
  gender: "",
  city: "",
  ticketingId: "",
  generatedBy: "",
  idNumber: "",
  email: "",
  phone: "",
};

interface GenerateTicketFormProps {
  events: TEvent[];
  adminUsers: TUser[];
}

function GenerateTicketForm({ events, adminUsers }: GenerateTicketFormProps) {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [eventTicketing, setEventTicketing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useUserStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formInitialValues,
  });

  const handleFormSubmitAction: () => void = handleSubmit(async (data) => {
    setIsLoading(true);
    const dataWithAuthoredBy = { ...data, generatedById: user!.id };
    const response = await generateTicket(dataWithAuthoredBy);
    if (response?.status === "success") {
      alert("Ticket generado con éxito");
    } else {
      alert("Error al generar ticket");
    }
    reset({
      fullName: "",
      birthday: "",
      idNumber: "",
      email: "",
      phone: "",
      gender: "",
      city: "",
    });
    setIsLoading(false);
  });

  useEffect(() => {
    if (!selectedEvent) return;
    (async () => {
      const ticketing = await getTicketing(selectedEvent);
      setEventTicketing(ticketing);
    })();
  }, [selectedEvent]);

  return (
    <div className="flex justify-center items-center w-full bg-gray p-5">
      <div className="flex flex-col gap-9 w-full">
        {isLoading && <Loader message="Generando ticket..." />}
        {/* <!-- Input Fields --> */}
        <form action={handleFormSubmitAction}>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              <Controller
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Evento"
                    value={value}
                    onChange={(value) => {
                      setSelectedEvent(value);
                      onChange(value);
                    }}
                    options={events.map((event) => ({
                      label: event.name,
                      value: event.id,
                    }))}
                  />
                )}
                rules={{ required: true }}
                name="eventId"
                control={control}
              />

              <Controller
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Etapa Ticket"
                    value={value}
                    onChange={onChange}
                    options={eventTicketing.map((ticketing) => ({
                      label: `${ticketing.name} - $${ticketing.price}`,
                      value: ticketing.id,
                    }))}
                  />
                )}
                rules={{ required: true }}
                name="ticketingId"
                control={control}
              />

              <h2 className="text-xl font-bold text-black dark:text-white mb-5">
                Comprador
              </h2>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Nombre & Apellidos: <span className="text-red">*</span>
                </label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  )}
                  rules={{ required: true }}
                  name="fullName"
                  control={control}
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Número de documento: <span className="text-red">*</span>
                </label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  )}
                  rules={{ required: true }}
                  name="idNumber"
                  control={control}
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Email: <span className="text-red">*</span>
                </label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  )}
                  rules={{ required: true }}
                  name="email"
                  control={control}
                />
              </div>
              {
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Fecha de nacimiento:
                  </label>
                  <Controller
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    )}
                    rules={{ required: false }}
                    name="birthday"
                    control={control}
                  />
                </div>
              }
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Género:
                </label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  )}
                  rules={{ required: false }}
                  name="gender"
                  control={control}
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Ciudad:
                </label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  )}
                  rules={{ required: false }}
                  name="city"
                  control={control}
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Teléfono:
                </label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  )}
                  rules={{ required: false }}
                  name="phone"
                  control={control}
                />
              </div>
              <div>
                <button
                  className="w-full py-3 bg-black text-white rounded-lg"
                  type="submit"
                >
                  Generar Ticket
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenerateTicketForm;
