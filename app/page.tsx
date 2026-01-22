import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constants";


const page = () => {
  return (
    <section>
      <h1 className="text-center">Escuela de comedia musical <br /> AndieSay</h1>
      <p className="text-center mt-5">En la escuela Andie Say sabemos que los sueños estan hechos para cumplirse.<br/>Cumplí hoy tu sueño de subirte a un escenario con nosotrxs.</p>
    
    <ExploreBtn />

    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>

      <div className="px-5 sm:px-10">
      <ul className="events">
        {events.map((event) => (
          <li key={event.title}>
            <EventCard { ...event} />
          </li>
        
        ))}
      </ul>
    </div>
    
    </div>
    
    </section>
  )
}

export default page