import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

import { HomeHero } from "@/components/public/home-hero";
import { HomeBookingBar } from "@/components/public/home-booking-bar";
import { HomeTestimonials } from "@/components/public/home-testimonials";
import { HomeRoomsGrid } from "@/components/public/home-rooms-grid";
import { HomeFacilitiesGrid } from "@/components/public/home-facilities-grid";
import { rooms } from "@/lib/data/rooms";
import { facilities, secondaryAmenities } from "@/lib/data/facilities";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeBookingBar />
      <AboutSection />
      <HomeRoomsGrid rooms={rooms} />
      <HomeTestimonials />
      <HomeFacilitiesGrid facilities={facilities} />
      <AmenitiesSection />
      <CTABanner />
      <ContactCards />
    </>
  );
}

/* ─── About ─── */
function AboutSection() {
  const about1 = "/hotel-assets/about.webp";
  const about2 = "/hotel-assets/room-287.webp";

  return (
    <section
      id="about"
      className="px-6 py-[60px] md:px-15 md:py-[100px] bg-[var(--color-white-warm)]"
    >
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
        <div className="relative">
          <div className="relative w-[85%] h-[500px]">
            <Image
              src={about1}
              alt="Hotel interior"
              fill
              sizes="(min-width: 1024px) 40vw, 85vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-10 right-0 w-[55%] h-[300px] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <Image
              src={about2}
              alt="Hotel room"
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="absolute top-[30px] right-[60px] w-[120px] h-[120px] flex flex-col items-center justify-center bg-[var(--color-gold)] text-white">
            <span className="font-heading text-4xl font-light leading-none">
              5
            </span>
            <span className="text-[9px] font-semibold tracking-[2px] uppercase mt-1">
              Star
            </span>
          </div>
        </div>

        <div className="pb-10">
          <p className="label-tag mb-4">About Our Hotel</p>
          <h2 className="heading-lg mb-6">
            The Hilton
            <br />
            Euphoria Hotel
          </h2>
          <div className="w-[60px] h-[2px] bg-[var(--color-gold)] mb-8" />
          <h3 className="font-heading text-[22px] italic font-normal text-[var(--color-dark)] mb-5">
            Unparalleled Comfort and Extraordinary Hospitality
          </h3>
          <p className="body-text mb-8">
            Welcome to Lagos&apos; premier five-star deluxe hotel. Experience
            the perfect blend of elegance and comfort at Hilton Euphoria Hotel,
            where every detail is designed to exceed your expectations. Immerse
            yourself in the refined ambiance, with thoughtfully crafted spaces
            that invite relaxation.
          </p>
          <div className="flex items-center gap-5 py-5 border-t border-[#eee]">
            <Phone className="size-6 text-[var(--color-gold)]" strokeWidth={1.5} />
            <div>
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--color-text-light)] mb-1">
                Reservation
              </p>
              <p className="font-heading text-2xl text-[var(--color-dark)]">
                {siteConfig.contact.phones[0].number}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Amenities ─── */
function AmenitiesSection() {
  return (
    <section className="px-6 py-[60px] md:px-15 md:py-[100px] bg-[var(--color-cream)]">
      <div className="mx-auto max-w-[1300px]">
        <div className="text-center mb-15">
          <p className="label-tag mb-4">Services</p>
          <h2 className="heading-lg">More Facilities</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryAmenities.map((a) => (
            <div
              key={a.name}
              className="bg-white p-9 flex flex-col gap-4 transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="size-14 border border-[var(--color-gold)] flex items-center justify-center text-[22px]">
                {a.icon}
              </div>
              <h4 className="font-heading text-[22px] font-normal">
                {a.name}
              </h4>
              <p className="text-sm leading-[1.7] text-[var(--color-text-light)] font-light">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─── */
function CTABanner() {
  const rooftop = "/hotel-assets/facility-rooftop.png";
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      <Image
        src={rooftop}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(23,24,26,0.7)]" />
      <div className="relative text-center text-white px-6">
        <p className="label-tag mb-4">Book Your Stay</p>
        <h2 className="font-heading font-light mb-8 text-balance" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
          Experience Luxury Redefined
        </h2>
        <Link
          href="/rooms"
          className="inline-block px-12 py-4 bg-[var(--color-gold)] text-white text-[11px] font-semibold tracking-[4px] uppercase transition-transform duration-300 hover:-translate-y-0.5"
        >
          Make a Reservation
        </Link>
      </div>
    </section>
  );
}

/* ─── Contact / Location ─── */
function ContactCards() {
  const cards = [
    {
      icon: "📞",
      label: "Reservation",
      value: siteConfig.contact.phones[0].number,
    },
    {
      icon: "✉",
      label: "Email Us",
      value: siteConfig.contact.email,
    },
    {
      icon: "📍",
      label: "Location",
      value: siteConfig.contact.address,
    },
  ];

  return (
    <section
      id="contact"
      className="px-6 py-[60px] md:px-15 md:py-[100px] bg-[var(--color-white-warm)]"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="text-center mb-15">
          <p className="label-tag mb-4">Find Us</p>
          <h2 className="heading-lg">Where You Need To Be</h2>
        </div>

        <div className="grid gap-12 sm:grid-cols-3 text-center">
          {cards.map((c) => (
            <div
              key={c.label}
              className="p-10 border border-[#eee] transition-colors duration-300 hover:border-[var(--color-gold)]"
            >
              <div className="text-[28px] mb-4">{c.icon}</div>
              <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-gold)] mb-3">
                {c.label}
              </p>
              <p className="font-heading text-[18px] text-[var(--color-dark)] leading-[1.5]">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
