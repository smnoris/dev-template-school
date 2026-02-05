import LogIn from '@/components/LogIn';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  // El slug puede ser usado para diferentes flujos de login en el futuro
  // Por ejemplo: /login/admin, /login/alumno, etc.

  return (
    <section id="login" className="p-5 sm:px-10">
      <div className="header">
        <h1>Iniciar Sesión</h1>
        <p className="mt-2">Completa tus datos para iniciar sesión</p>
      </div>

      <div className="signup-card max-w-2xl mx-auto mt-8">
        <LogIn />
      </div>
    </section>
  )
}

export default Page