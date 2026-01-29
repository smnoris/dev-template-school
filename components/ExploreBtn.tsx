'use client';

import Image from "next/image";

const ExploreBtn = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const eventsSection = document.querySelector('#events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#events"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={handleClick}
      role="button"
      aria-label="Scroll to events section"
    >
      Inscripciones
      <Image src="/icons/arrow-down.svg" alt="Arrow Down" width={24} height={24} />
    </a>
  )
}

export default ExploreBtn