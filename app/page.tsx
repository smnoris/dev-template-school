import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async () => {
  'use cache';
  cacheLife({ stale: 3600, revalidate: 1800, expire: 7200 }); // 1 hour stale, 30 min revalidate, 2 hour expire

  let events: IEvent[] = [];

  try {
    if (!BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not defined');
      return (
        <section className="p-5 sm:px-10">
          <h1 className="text-center">Configuration Error</h1>
          <p className="text-center mt-5">Unable to load events. Please check configuration.</p>
        </section>
      );
    }

    const response = await fetch(`${BASE_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    events = data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    // events remains empty array, will show no events
  }

  return (
    <section className="p-5 sm:px-10">
      <h1 className="text-center">Escuela de comedia musical <br /> AndieSay</h1>
      <p className="text-center mt-5">En la escuela Andie Say sabemos que los sueños estan hechos para cumplirse.<br />Cumplí hoy tu sueño de subirte a un escenario con nosotrxs.</p>

      <ExploreBtn />


      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.slug || String(event._id)}>
              <EventCard {...event} />
            </li>

          ))}
        </ul>
      </div>


    </section>
  )
}

export default page