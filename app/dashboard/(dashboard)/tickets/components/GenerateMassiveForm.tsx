"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { Loader } from "@/components/Loader/Loader";
import { generateMassiveTickets } from "../actions";
import { useUserStore } from "@/store/userStore";
import { TEvent } from "@/types/events";
import { getEventsByCollectiveId } from "../../events/actions";

interface TForm {
  file: FileList;
  eventId: string;
}

type TPreviewData = string[][];

const GenerateMassiveForm = () => {
  const [previewData, setPreviewData] = useState<any[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<TEvent[]>();

  const { register, handleSubmit, getValues } = useForm<TForm>();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEventsByCollectiveId(user?.collectiveId!);
      setEvents(response);
    };

    fetchEvents();
  }, [user]);

  const handleCSVSubmit = async (formData: TForm) => {
    setIsLoading(true);
    const file = formData.file[0];
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: TPreviewData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // remove the header
      data.shift();
      setPreviewData(data);
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);

    // parse(file, {
    //   header: true,
    //   skipEmptyLines: true,
    //   complete: (result) => {
    //     debugger;
    //     setPreviewData(result.data);
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   },
    // });
  };

  const handleGenerateTickets = async () => {
    if (!previewData || !user) return;
    setIsLoading(true);
    const { eventId } = getValues();
    await generateMassiveTickets(user.id, eventId, previewData);
    setIsLoading(false);
  };

  return (
    <section className="w-full flex gap-4 flex-col p-5">
      <h2 className="text-title-xsm text-black dark:text-white">
        En esta sección podrás generar múltiples tickets a la vez cargando un
        archivo formato CSV con los siguientes campos: Nombre Completo, Email,
        Cedula, Ciudad, Genero, Fecha de Nacimiento, # Celular, Etapa boleta, Es
        muy importante que los campos esten en el orden mencionado y con el
        mismo nombre, El nombre de la etapa debe coincidir con el nombre que se
        creo en el sistema Puedes descargar nuestro formato de inicio para que
        puedas cargar tus datos.
      </h2>
      <h2 className="text-title-xsm italic font-semibold text-black">
        Ten mucho cuidado con esta opción, verifica muy bien la informacion del
        archivo antes de cargarla al sistema. Utiliza la vista previa para
        validar que los datos sean correctos.
      </h2>
      <>
        <a
          href="/assets/files/formato-inicio.csv"
          download
          className="text-primary"
        >
          Descargar formato de inicio
        </a>
      </>
      <form
        className="flex gap-4 mt-4"
        onSubmit={handleSubmit(handleCSVSubmit)}
      >
        <select
          {...register("eventId")}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Selecciona un evento</option>
          {events?.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
        <input
          {...register("file", { required: true })}
          type="file"
          accept=".csv,.xlsx"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
        >
          Generar vista previa
        </button>
      </form>
      <section>
        <h2 className="text-title-md text-black dark:text-white mt-10">
          Vista previa
        </h2>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Cedula</th>
              <th>Ciudad</th>
              <th>Genero</th>
              <th>Fecha de Nacimiento</th>
              <th># Celular</th>
              <th>Etapa boleta</th>
            </tr>
          </thead>
          <tbody>
            {!previewData && (
              <tr>
                <td colSpan={9} className="text-center">
                  No hay datos para mostrar
                </td>
              </tr>
            )}
            {previewData &&
              previewData.map((row, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                  <td>{row[5]}</td>
                  <td>{row[6]}</td>
                  <td>{row[7]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
      {previewData && (
        <section className="w-[75%] rounded-md shadow-4 flex gap-6 fixed bottom-0 p-4 bg-white mb-8">
          <p className="w-[50%] text-title-xsm text-black dark:text-white">
            Cuando estes seguro de que los datos son correctos, da click en el
            botón para confirmar y generar los tickets
          </p>
          <button
            className="w-[50%] bg-primary text-white p-4 rounded-lg"
            onClick={handleGenerateTickets}
          >
            Confirmar y Generar tickets
          </button>
        </section>
      )}
      {isLoading && <Loader message="Generando tickets..." />}
    </section>
  );
};

export { GenerateMassiveForm };
