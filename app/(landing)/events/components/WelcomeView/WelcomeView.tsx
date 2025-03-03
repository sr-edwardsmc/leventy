const WelcomeView = () => {
  return (
    <>
      <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
        ¡Bienvenid@! 🎉
      </h3>
      <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
      <p className="text-center text-black dark:text-white">
        Necesitamos algunos datos para el proceso de pago y registrar tu ingreso
        para el evento, por favor{" "}
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
  );
};

export { WelcomeView };
