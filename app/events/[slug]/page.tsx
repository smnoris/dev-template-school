import { notFound } from "next/navigation";
import Image from "next/image";
import { Divide } from "lucide-react";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EvemtDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex-row-gap-2 item-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap ">
    {tags.map((tag) => (
      <div key={tag} className="pill">{tag}</div>
    ))}
  </div>
);
const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event: { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } } = await request.json();

  if (!description) return notFound();

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);


  console.log(similarEvents)
  return (
    <section id="event">
      <div className="header p-5 sm:px-10">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>

      <div className="details">
        { /* Left Side - Event Content*/}
        <div className="content p-5 sm:px-10">
          <Image src={image} alt="event image" width={800} height={400} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EvemtDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EvemtDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EvemtDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EvemtDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EvemtDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2 ">
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />

        </div>
        { /* Right Side - Booking Form*/}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot</p>
            )}

            <BookEvent />

          </div>
        </aside>
      </div>


      <div className="flex w-full flex-col gap-4 pt-20 px-5 sm:px-10 pb-10">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={String(similarEvent.title)} {...similarEvent} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventDetailsPage