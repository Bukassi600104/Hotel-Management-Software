export const HOTEL_LOGO =
  "/hotel-assets/logo.png";

export const HOTEL_LOGO_FOOTER =
  "/hotel-assets/logo-footer.png";

export const siteConfig = {
  name: "Hilton Euphoria Hotel",
  shortName: "Hilton Euphoria",
  tagline: "Unparalleled Comfort and Extraordinary Hospitality",
  description:
    "Welcome to Lagos' premier five-star deluxe hotel. Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel.",
  url: "https://hiltoneuphoriahotel.com",
  contact: {
    address: "Plot 18, 21/22 Road, Gowon Estate, Egbeda, Lagos State, Nigeria",
    addressShort: "Gowon Estate, Egbeda, Lagos",
    phones: [
      { label: "Reservation", number: "+234 806 026 0260" },
      { label: "Front Desk", number: "+234 808 081 4342" },
      { label: "Concierge", number: "+234 905 973 7707" },
      { label: "Events", number: "+234 809 999 0143" },
    ],
    email: "booking@hiltoneuphoriahotel.com",
    whatsapp: "2348060260260",
  },
  socials: [
    { label: "Hilton Euphoria Instagram", href: "https://www.instagram.com/hiltoneuphoriahotel/", icon: "instagram" },
    { label: "Klub Euphoria Instagram", href: "https://www.instagram.com/klubeuphoria/", icon: "instagram" },
    { label: "Hilton Euphoria Hotel Facebook", href: "https://www.facebook.com/HiltonEuphoriaHotel", icon: "facebook" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "About Us", href: "/about" },
    { label: "Conference Room", href: "/conference" },
    { label: "Hotel Menu", href: "/menu" },
    { label: "Contact Us", href: "/contact" },
    { label: "My Booking", href: "/booking/manage" },
  ],
  guestNav: [
    { label: "Guest Guide", href: "/guest-guide" },
    { label: "Drink Menu", href: "/drinks" },
    { label: "Laundry Service", href: "/laundry" },
  ],
  hours: {
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    reception: "24 hours",
  },
};

export type SiteConfig = typeof siteConfig;
