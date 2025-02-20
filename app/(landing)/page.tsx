export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-48 mt-[-5em]">
      <div className="flex text-6xl gap-2">
        <span className="icon-[eos-icons--installing]"></span>
        <span className="icon-[vs--clock] mb-4"></span>
      </div>
      <h2 className="text-2xl w-[50%] text-center">
        Nuestro sitio web público se encuentra en construcción <br />
        puedes ver nuestros eventos disponibles{" "}
        <a href="/events" className="text-primary">
          Aquí. <br />
        </a>
        Estamos trabajando para ofrecerte las mejores soluciones.
      </h2>
    </main>
  );
}
