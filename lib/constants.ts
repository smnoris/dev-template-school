export type EventItem = {
    image: string;
    title: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

export const events: EventItem[] = [
    {
        title: "React Conf 2026",
        image: "/images/event1.png",
        slug: "react-conf-2026",
        location: "San Francisco, CA",
        date: "March 15, 2026",
        time: "9:00 AM - 6:00 PM"
    },
    {
        title: "JSWorld Conference",
        image: "/images/event2.png",
        slug: "jsworld-conference",
        location: "Amsterdam, Netherlands",
        date: "April 22, 2026",
        time: "10:00 AM - 7:00 PM"
    },
    {
        title: "Hackathon Global 2026",
        image: "/images/event3.png",
        slug: "hackathon-global-2026",
        location: "Online",
        date: "May 10-12, 2026",
        time: "All Day"
    },
    {
        title: "Next.js Meetup",
        image: "/images/event4.png",
        slug: "nextjs-meetup",
        location: "New York, NY",
        date: "June 5, 2026",
        time: "6:00 PM - 9:00 PM"
    },
    {
        title: "AI & ML Summit",
        image: "/images/event5.png",
        slug: "ai-ml-summit",
        location: "London, UK",
        date: "July 18, 2026",
        time: "8:00 AM - 5:00 PM"
    },
    {
        title: "TypeScript Workshop",
        image: "/images/event6.png",
        slug: "typescript-workshop",
        location: "Berlin, Germany",
        date: "August 14, 2026",
        time: "2:00 PM - 5:00 PM"
    }
];