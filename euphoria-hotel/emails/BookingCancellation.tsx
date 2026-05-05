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
  cancellationReason?: string;
};

export default function BookingCancellation({
  guestName = "Adaeze",
  bookingReference = "EUP-2026-A1B2C3",
  roomName = "Deluxe Suite",
  checkInDate = "Monday, 12 May 2026",
  checkOutDate = "Wednesday, 14 May 2026",
  cancellationReason,
}: Props) {
  const firstName = guestName.split(" ")[0];

  return (
    <Html>
      <Head />
      <Preview>Your Hilton Euphoria booking {bookingReference} has been cancelled</Preview>
      <Body style={body}>
        <Section style={header}>
          <Text style={hotelName}>HILTON EUPHORIA HOTEL</Text>
          <Text style={hotelTagline}>Lagos · Nigeria</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>Booking cancelled, {firstName}.</Heading>
          <Text style={para}>
            Your reservation at Hilton Euphoria Hotel has been cancelled.
            {cancellationReason ? ` Reason: ${cancellationReason}.` : ""} We are sorry for any
            inconvenience this may cause.
          </Text>

          <Section style={refBox}>
            <Text style={refLabel}>CANCELLED REFERENCE</Text>
            <Text style={refCode}>{bookingReference}</Text>
          </Section>

          <Hr style={divider} />

          <Text style={sectionTitle}>RESERVATION SUMMARY</Text>
          <DetailRow label="Room" value={roomName} />
          <DetailRow label="Check-in" value={checkInDate} />
          <DetailRow label="Check-out" value={checkOutDate} />

          <Hr style={divider} />

          <Text style={sectionTitle}>REFUND INFORMATION</Text>
          <Text style={para}>
            If a payment was collected, your refund will be processed back to your original payment
            method within <strong>5–7 business days</strong>. The exact timeline depends on your
            bank.
          </Text>
          <Text style={para}>
            If you do not receive your refund within 7 business days, please contact us with your
            booking reference and bank details.
          </Text>

          <Hr style={divider} />

          <Text style={sectionTitle}>NEED HELP?</Text>
          <Text style={para}>
            Phone: +234 806 026 0260{"\n"}
            Email: booking@hiltoneuphoriahotel.com{"\n"}
            WhatsApp: +234 806 026 0260
          </Text>
        </Container>

        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Hilton Euphoria Hotel · Gowon Estate, Egbeda, Lagos
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
  fontFamily: "'Georgia', 'Times New Roman', serif",
  margin: 0,
  padding: 0,
};
const header: React.CSSProperties = {
  backgroundColor: "#17181a",
  padding: "32px 24px",
  textAlign: "center",
};
const hotelName: React.CSSProperties = {
  color: "#c9a961",
  fontSize: 13,
  letterSpacing: "0.35em",
  margin: 0,
  fontFamily: "'Arial', sans-serif",
};
const hotelTagline: React.CSSProperties = {
  color: "#c9a96190",
  fontSize: 11,
  letterSpacing: "0.25em",
  margin: "6px 0 0",
  fontFamily: "'Arial', sans-serif",
};
const container: React.CSSProperties = {
  backgroundColor: "#fffdf8",
  maxWidth: 560,
  margin: "0 auto",
  padding: "40px 36px",
};
const h1: React.CSSProperties = {
  color: "#17181a",
  fontSize: 24,
  fontWeight: 400,
  margin: "0 0 16px",
};
const para: React.CSSProperties = {
  color: "#4a4541",
  fontSize: 15,
  lineHeight: 1.6,
  margin: "0 0 16px",
};
const refBox: React.CSSProperties = {
  backgroundColor: "#4a4541",
  borderRadius: 4,
  padding: "20px 24px",
  textAlign: "center",
  margin: "20px 0",
};
const refLabel: React.CSSProperties = {
  color: "#c9a96190",
  fontSize: 10,
  letterSpacing: "0.35em",
  margin: "0 0 6px",
  fontFamily: "'Arial', sans-serif",
};
const refCode: React.CSSProperties = {
  color: "#e8dfd1",
  fontSize: 22,
  letterSpacing: "0.18em",
  margin: 0,
  fontFamily: "'Arial', sans-serif",
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
  fontFamily: "'Arial', sans-serif",
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
  fontFamily: "'Arial', sans-serif",
};
const detailValue: React.CSSProperties = {
  color: "#17181a",
  fontSize: 14,
  margin: 0,
};
const footer: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  padding: "20px 36px",
  textAlign: "center",
};
const footerText: React.CSSProperties = {
  color: "#9a8a6a",
  fontSize: 11,
  fontFamily: "'Arial', sans-serif",
};
