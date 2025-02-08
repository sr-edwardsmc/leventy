"use client";
import Link from "next/link";
import { useSignUpForm } from "../hooks/useSignUpForm";
import { Notification } from "@/components/Notifications/Notifications";
import { Loader } from "@/components/Loader/Loader";

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    success,
    error,
    isLoading,
  } = useSignUpForm();
  return (
    <>
      <section className="w-full p-4 flex items-center justify-center">
        <div className="w-full mt-[2em] bg-white border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-10 xl:p-15">
            <h2 className="mb-2 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Registro
            </h2>
            <p className="mb-4 italic text-black dark:text-white">
              Crea una cuenta para poder comprar tus ingresos y disfrutar de
              todos los beneficios que tenemos para ti.
            </p>
            <p className="mb-6 text-rose-400">
              Los campos marcados con * son obligatorios
            </p>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 flex items-center gap-8 w-full">
                <div className="w-[50%]">
                  <label
                    htmlFor=""
                    className="mb-2.5 block font-medium text-black dark:text-white"
                  >
                    Tipo ID *
                  </label>
                  <select
                    {...register("idType", { required: true })}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="CC">CC</option>
                    <option value="PASSPORT">Pasaporte</option>
                  </select>
                </div>
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Número ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ingresa tu número de identidad"
                      {...register("idNumber", { required: true })}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-8 w-full">
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    {...register("fullName", { required: true })}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="email@google.com"
                    {...register("email", {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4 flex items-center gap-8 w-full">
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Ciudad *
                  </label>
                  <select
                    {...register("city")}
                    className="w-full rounded-lg border border-stroke bg-transparent
                    py-4 pl-6 pr-10 text-black outline-none focus:border-primary
                    focus-visible:shadow-none dark:border-form-strokedark
                    dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="medellin">Medellín</option>
                    <option value="pereira">Pereira</option>
                    <option value="manizales">Manizales</option>
                    <option value="cali">Cali</option>
                    <option value="bogota">Bogotá</option>
                    <option value="otra">Otra</option>
                  </select>
                </div>
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    # Celular
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa tu número de celular"
                    {...register("phone")}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4 flex items-center gap-8 w-full">
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    placeholder="Enter your date of birth"
                    {...register("birthday")}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Género
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-8 w-full">
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    {...register("password", { required: true })}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-[50%]">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    placeholder="Confirma tu contraseña"
                    {...register("confirmPassword", { required: true })}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-8 mb-2 items-center gap-8 w-full">
                <input
                  type="submit"
                  value="Crear cuenta"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="mt-6 text-center">
                <p>
                  Ya tienes una cuenta? {""}
                  <Link href="/login" className="text-primary">
                    Ingresar
                  </Link>
                </p>
              </div>
              <div className="mt-2 text-center">
                <p>
                  Quieres unirte como organizador de eventos?
                  <Link href="/login" className="text-primary">
                    {" "}
                    Escribenos
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
      <>
        {isLoading && <Loader message="Creando cuenta" />}
        {success && (
          <Notification
            type="success"
            title="Registro exitoso"
            message="Tu cuenta ha sido creata exitosamente"
            handleClose={() => {}}
          />
        )}
        {error && (
          <Notification
            type="error"
            title="Error"
            message={error}
            handleClose={() => {}}
          />
        )}
      </>
    </>
  );
};
