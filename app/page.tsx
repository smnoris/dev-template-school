import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async () => {
  'use cache';
  cacheLife('hours')
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section className="p-5 sm:px-10">
      <h1 className="text-center">Escuela de comedia musical <br /> AndieSay</h1>
      <p className="text-center mt-5">En la escuela Andie Say sabemos que los sueños estan hechos para cumplirse.<br />Cumplí hoy tu sueño de subirte a un escenario con nosotrxs.</p>

      <ExploreBtn />


      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>

          ))}
        </ul>
      </div>


    </section>
  )
}

export default page