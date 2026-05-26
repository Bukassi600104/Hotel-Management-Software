import {
  Body,
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
  bookingReference: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  totalAmountNaira: string;
  guestEmail: string;
  guestPhone: string;
};

export default function AdminReservationAlert({
  guestName = "Adaeze Okafor",
  bookingReference = "HEH-2026-A1B2C3",
  roomName = "Deluxe Suite",
  checkInDate = "Monday, 12 May 2026",
  checkOutDate = "Wednesday, 14 May 2026",
  totalNights = 2,
  totalAmountNaira = "₦176,000",
  guestEmail = "guest@example.com",
  guestPhone = "+234 800 000 0000",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>[RESERVATION] {guestName} — {bookingReference} — {checkInDate}</Preview>
      <Body style={body}>
        <Section style={header}>
          <Text style={hotelName}>HILTON EUPHORIA — STAFF ALERT</Text>
          <Text style={hotelTagline}>New reservation (pay at check-in)</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>New reservation received</Heading>
          <Text style={para}>
            A guest has made a <strong>pay-at-check-in reservation</strong>. No payment has been collected online.
            Ensure the room is held and payment is collected upon arrival.
          </Text>

          <Section style={refBox}>
            <Text style={refLabel}>RESERVATION REFERENCE</Text>
            <Text style={refCode}>{bookingReference}</Text>
          </Section>

          <Hr style={divider} />

          <Text style={sectionTitle}>GUEST DETAILS</Text>
          <DetailRow label="Name" value={guestName} />
          <DetailRow label="Email" value={guestEmail} />
          <DetailRow label="Phone" value={guestPhone} />

          <Hr style={divider} />

          <Text style={sectionTitle}>STAY DETAILS</Text>
          <DetailRow label="Room" value={roomName} />
          <DetailRow label="Check-in" value={checkInDate} />
          <DetailRow label="Check-out" value={checkOutDate} />
          <DetailRow label="Duration" value={`${totalNights} night${totalNights !== 1 ? "s" : ""}`} />
          <DetailRow label="Amount due" value={`${totalAmountNaira} (collect at check-in)`} />

          <Hr style={divider} />

          <Text style={actionNote}>
            Action required: update the room calendar and ensure the room is ready by check-in date.
          </Text>
        </Container>

        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Hilton Euphoria Hotel Staff Portal
          </Text>
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
  backgroundColor: "#f5f0e8",
  fontFamily: "'Arial', sans-serif",
  margin: 0,
  padding: 0,
};
const header: React.CSSProperties = {
  backgroundColor: "#1a2a1a",
  padding: "28px 24px",
  textAlign: "center",
};
const hotelName: React.CSSProperties = {
  color: "#7adb78",
  fontSize: 12,
  letterSpacing: "0.3em",
  margin: 0,
};
const hotelTagline: React.CSSProperties = {
  color: "#7adb7880",
  fontSize: 11,
  letterSpacing: "0.2em",
  margin: "6px 0 0",
};
const container: React.CSSProperties = {
  backgroundColor: "#fffdf8",
  maxWidth: 560,
  margin: "0 auto",
  padding: "36px 32px",
};
const h1: React.CSSProperties = {
  color: "#17181a",
  fontSize: 22,
  fontWeight: 700,
  margin: "0 0 14px",
};
const para: React.CSSProperties = {
  color: "#4a4541",
  fontSize: 14,
  lineHeight: 1.6,
  margin: "0 0 16px",
};
const refBox: React.CSSProperties = {
  backgroundColor: "#17181a",
  borderRadius: 4,
  padding: "20px 24px",
  textAlign: "center",
  margin: "20px 0",
};
const refLabel: React.CSSProperties = {
  color: "#c9a961",
  fontSize: 10,
  letterSpacing: "0.35em",
  margin: "0 0 6px",
};
const refCode: React.CSSProperties = {
  color: "#e8d5a0",
  fontSize: 24,
  letterSpacing: "0.18em",
  margin: 0,
  fontWeight: 700,
};
const divider: React.CSSProperties = {
  borderColor: "#e8dfd1",
  margin: "20px 0",
};
const sectionTitle: React.CSSProperties = {
  color: "#9a8a6a",
  fontSize: 10,
  letterSpacing: "0.35em",
  margin: "0 0 10px",
};
const detailRowStyle: React.CSSProperties = {
  borderBottom: "1px solid #e8dfd1",
  padding: "8px 0",
};
const detailLabel: React.CSSProperties = {
  color: "#9a8a6a",
  fontSize: 12,
  margin: 0,
  width: 100,
  display: "inline-block" as const,
};
const detailValue: React.CSSProperties = {
  color: "#17181a",
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
};
const actionNote: React.CSSProperties = {
  backgroundColor: "#fff8e8",
  border: "1px solid #e8d5a0",
  borderRadius: 4,
  color: "#7a6540",
  fontSize: 13,
  lineHeight: 1.6,
  padding: "12px 16px",
  margin: 0,
};
const footer: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  padding: "16px 32px 32px",
  textAlign: "center",
};
const footerText: React.CSSProperties = {
  color: "#9a8a6a",
  fontSize: 11,
};
