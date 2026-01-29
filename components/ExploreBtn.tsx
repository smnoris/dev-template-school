import Image from "next/image";
import Link from "next/link";

const ExploreBtn = () => {
  return (
    <Link
      href="/inscripcion/nuevo"
      id="explore-btn"
      className="mt-7 mx-auto"
      role="button"
      aria-label="Ir a inscripciones"
    >
      Inscripciones
      <Image src="/icons/arrow-down.svg" alt="Arrow Right" width={24} height={24} />
    </Link>
  )
}

export default ExploreBtn
