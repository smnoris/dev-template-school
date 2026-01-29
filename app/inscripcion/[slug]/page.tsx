import Inscription from "@/components/Inscription";

const InscripcionPage = () => {
  return (
    <section id="inscripcion" className="p-5 sm:px-10">
      <div className="header">
        <h1>Formulario de Inscripción</h1>
        <p className="mt-2">Completa tus datos para inscribirte</p>
      </div>

      <div className="signup-card max-w-2xl mx-auto mt-8">
        <Inscription />
      </div>
    </section>
  );
};

export default InscripcionPage;
