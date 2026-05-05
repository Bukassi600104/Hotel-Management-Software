import { FacilityCard } from "@/components/public/facility-card";
import type { Facility } from "@/types";

type Props = {
  facilities: Facility[];
};

export function HomeFacilitiesGrid({ facilities }: Props) {
  return (
    <section id="facilities" className="px-6 py-[60px] md:px-15 md:py-[100px] bg-[var(--color-white-warm)]">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-12 text-center">
          <p className="label-tag mb-4">Facilities</p>
          <h2 className="heading-lg">Our Facilities</h2>
          <p className="body-text mx-auto mt-5 max-w-2xl">
            Get a close look on our facilities. We have many advantages for which it is profitable to book an accomodation with us.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility, index) => (
            <FacilityCard key={facility.slug} facility={facility} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
