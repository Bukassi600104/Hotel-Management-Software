import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type Props = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingReference: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  totalAmountNaira: string;
  bookingId: string;
};

export default function AdminBookingAlert({
  guestName = "Adaeze Madu",
  guestEmail = "adaeze@example.com",
  guestPhone = "+234 800 000 0000",
  bookingReference = "EUP-2026-A1B2C3",
  roomName = "Deluxe Suite",
  checkInDate = "Monday, 12 May 2026",
  checkOutDate = "Wednesday, 14 May 2026",
  totalNights = 2,
  totalAmountNaira = "₦176,000",
  bookingId = "uuid-here",
}: Props) {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiltoneuphoriahotel.com"}/admin/bookings?id=${bookingId}`;

  return (
    <Html>
      <Head />
      <Preview>
        New booking {bookingReference} — {guestName} · {roomName} · {checkInDate}
      </Preview>
      <Body style={body}>
        <Section style={header}>
          <Text style={hotelName}>HILTON EUPHORIA HOTEL</Text>
          <Text style={alertBadge}>NEW BOOKING ALERT</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>New booking received</Heading>
          <Text style={para}>
            A new booking has been confirmed and payment collected. Details below.
          </Text>

          <Section style={refBox}>
            <Text style={refLabel}>BOOKING REFERENCE</Text>
            <Text style={refCode}>{bookingReference}</Text>
          </Section>

          <Hr style={divider} />

          <Text style={sectionTitle}>GUEST DETAILS</Text>
          <DetailRow label="Name" value={guestName} />
          <DetailRow label="Email" value={guestEmail} />
          <DetailRow label="Phone" value={guestPhone} />

          <Hr style={divider} />

          <Text style={sectionTitle}>RESERVATION DETAILS</Text>
          <DetailRow label="Room" value={roomName} />
          <DetailRow label="Check-in" value={checkInDate} />
          <DetailRow label="Check-out" value={checkOutDate} />
          <DetailRow
            label="Duration"
            value={`${totalNights} night${totalNights !== 1 ? "s" : ""}`}
          />
          <DetailRow label="Total paid" value={totalAmountNaira} />

          <Hr style={divider} />

          <Section style={{ textAlign: "center" as const, marginTop: 8 }}>
            <Button href={adminUrl} style={button}>
              View in Admin Dashboard
            </Button>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={footerText}>Hilton Euphoria Hotel · Internal notification</Text>
        </Section>
      </Body>
    </Html>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Section style={detailRowStyle}>
      <Text style={detailLabel}>{label}</Text>
      <Text style={detailValue}>{value}</Text>
    </Section>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f0f0f0",
  fontFamily: "'Arial', sans-serif",
  margin: 0,
  padding: 0,
};
const header: React.CSSProperties = {
  backgroundColor: "#17181a",
  padding: "24px",
  textAlign: "center",
};
const hotelName: React.CSSProperties = {
  color: "#c9a961",
  fontSize: 12,
  letterSpacing: "0.35em",
  margin: "0 0 6px",
};
const alertBadge: React.CSSProperties = {
  color: "#ffffff",
  fontSize: 10,
  letterSpacing: "0.25em",
  margin: 0,
  backgroundColor: "#c9a961",
  display: "inline-block" as const,
  padding: "4px 12px",
  borderRadius: 2,
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: 560,
  margin: "0 auto",
  padding: "36px 32px",
};
const h1: React.CSSProperties = {
  color: "#17181a",
  fontSize: 22,
  fontWeight: 700,
  margin: "0 0 12px",
};
const para: React.CSSProperties = {
  color: "#555",
  fontSize: 14,
  lineHeight: 1.5,
  margin: "0 0 16px",
};
const refBox: React.CSSProperties = {
  backgroundColor: "#17181a",
  borderRadius: 4,
  padding: "16px 20px",
  textAlign: "center",
  margin: "16px 0",
};
const refLabel: React.CSSProperties = {
  color: "#c9a961",
  fontSize: 10,
  letterSpacing: "0.35em",
  margin: "0 0 6px",
};
const refCode: React.CSSProperties = {
  color: "#e8d5a0",
  fontSize: 22,
  letterSpacing: "0.18em",
  margin: 0,
  fontWeight: 700,
};
const divider: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};
const sectionTitle: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: 10,
  letterSpacing: "0.3em",
  margin: "0 0 10px",
};
const detailRowStyle: React.CSSProperties = {
  borderBottom: "1px solid #f3f4f6",
  padding: "8px 0",
};
const detailLabel: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 12,
  margin: 0,
  width: 100,
  display: "inline-block" as const,
};
const detailValue: React.CSSProperties = {
  color: "#111827",
  fontSize: 14,
  margin: 0,
};
const button: React.CSSProperties = {
  backgroundColor: "#c9a961",
  borderRadius: 24,
  color: "#17181a",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.15em",
  padding: "12px 28px",
  textDecoration: "none",
};
const footer: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  padding: "16px 32px",
  textAlign: "center",
};
const footerText: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: 11,
};
