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
  bookingReference: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  totalAmountNaira: string;
  checkInTime: string;
};

export default function ReservationConfirmation({
  guestName = "Adaeze",
  bookingReference = "HEH-2026-A1B2C3",
  roomName = "Deluxe Suite",
  checkInDate = "Monday, 12 May 2026",
  checkOutDate = "Wednesday, 14 May 2026",
  totalNights = 2,
  totalAmountNaira = "₦176,000",
  checkInTime = "3:00 PM",
}: Props) {
  const firstName = guestName.split(" ")[0];

  return (
    <Html>
      <Head />
      <Preview>Your reservation at Hilton Euphoria Hotel is confirmed — {bookingReference}</Preview>
      <Body style={body}>
        <Section style={header}>
          <Text style={hotelName}>HILTON EUPHORIA HOTEL</Text>
          <Text style={hotelTagline}>Lagos · Nigeria</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>Your reservation is confirmed, {firstName}.</Heading>
          <Text style={para}>
            Thank you for choosing Hilton Euphoria Hotel. Your room has been reserved and held
            for you — <strong>payment will be collected at check-in</strong>. We look forward to
            welcoming you.
          </Text>

          <Section style={refBox}>
            <Text style={refLabel}>RESERVATION REFERENCE</Text>
            <Text style={refCode}>{bookingReference}</Text>
            <Text style={refHint}>Quote this reference when you arrive at reception.</Text>
          </Section>

          <Hr style={divider} />

          <Section>
            <DetailRow label="Room" value={roomName} />
            <DetailRow label="Check-in" value={`${checkInDate} from ${checkInTime}`} />
            <DetailRow label="Check-out" value={checkOutDate} />
            <DetailRow
              label="Duration"
              value={`${totalNights} night${totalNights !== 1 ? "s" : ""}`}
            />
            <DetailRow label="Total due" value={`${totalAmountNaira} (payable at check-in)`} />
          </Section>

          <Hr style={divider} />

          <Section style={payAtCheckinBox}>
            <Text style={payAtCheckinTitle}>PAYMENT AT CHECK-IN</Text>
            <Text style={payAtCheckinText}>
              No payment has been collected yet. The full amount of{" "}
              <strong>{totalAmountNaira}</strong> is due upon arrival. We accept cash (Naira)
              and card payments at the front desk.
            </Text>
          </Section>

          <Hr style={divider} />

          <Text style={sectionTitle}>CANCELLATION POLICY</Text>
          <Text style={para}>
            Free cancellation up to 48 hours before your check-in date. Cancellations within 48
            hours may be subject to a one-night charge. To cancel, visit{" "}
            <strong>hiltoneuphoriahotel.com/booking/manage</strong> or call us.
          </Text>

          <Hr style={divider} />

          <Text style={sectionTitle}>FIND US</Text>
          <Text style={para}>
            Plot 18, 21/22 Road, Gowon Estate, Egbeda, Lagos State, Nigeria
          </Text>
          <Text style={para}>
            Phone: +234 806 026 0260 · WhatsApp: +234 806 026 0260{"\n"}
            Email: booking@hiltoneuphoriahotel.com
          </Text>

          <Section style={{ textAlign: "center" as const, marginTop: 32 }}>
            <Button href="https://hiltoneuphoriahotel.com/booking/manage" style={button}>
              Manage my reservation
            </Button>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Hilton Euphoria Hotel · Gowon Estate, Egbeda, Lagos
          </Text>
          <Text style={footerText}>
            You are receiving this email because you made a reservation on our website.
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Section style={detailRow}>
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
  fontSize: 26,
  fontWeight: 400,
  margin: "0 0 16px",
  lineHeight: 1.2,
};
const para: React.CSSProperties = {
  color: "#4a4541",
  fontSize: 15,
  lineHeight: 1.6,
  margin: "0 0 16px",
};
const refBox: React.CSSProperties = {
  backgroundColor: "#17181a",
  borderRadius: 4,
  padding: "24px 28px",
  textAlign: "center",
  margin: "24px 0",
};
const refLabel: React.CSSProperties = {
  color: "#c9a961",
  fontSize: 10,
  letterSpacing: "0.35em",
  margin: "0 0 8px",
  fontFamily: "'Arial', sans-serif",
};
const refCode: React.CSSProperties = {
  color: "#e8d5a0",
  fontSize: 28,
  letterSpacing: "0.18em",
  margin: "0 0 8px",
  fontWeight: 700,
  fontFamily: "'Arial', sans-serif",
};
const refHint: React.CSSProperties = {
  color: "#ffffff60",
  fontSize: 12,
  margin: 0,
  fontFamily: "'Arial', sans-serif",
};
const divider: React.CSSProperties = {
  borderColor: "#e8dfd1",
  margin: "24px 0",
};
const payAtCheckinBox: React.CSSProperties = {
  backgroundColor: "#f0ead8",
  borderRadius: 4,
  padding: "20px 24px",
  margin: "0 0 16px",
};
const payAtCheckinTitle: React.CSSProperties = {
  color: "#7a6540",
  fontSize: 10,
  letterSpacing: "0.35em",
  margin: "0 0 8px",
  fontFamily: "'Arial', sans-serif",
};
const payAtCheckinText: React.CSSProperties = {
  color: "#4a4541",
  fontSize: 14,
  lineHeight: 1.6,
  margin: 0,
};
const sectionTitle: React.CSSProperties = {
  color: "#9a8a6a",
  fontSize: 10,
  letterSpacing: "0.35em",
  margin: "0 0 12px",
  fontFamily: "'Arial', sans-serif",
};
const detailRow: React.CSSProperties = {
  borderBottom: "1px solid #e8dfd1",
  padding: "10px 0",
  display: "flex",
};
const detailLabel: React.CSSProperties = {
  color: "#9a8a6a",
  fontSize: 12,
  letterSpacing: "0.1em",
  margin: 0,
  width: 120,
  fontFamily: "'Arial', sans-serif",
  display: "inline-block" as const,
};
const detailValue: React.CSSProperties = {
  color: "#17181a",
  fontSize: 14,
  margin: 0,
  display: "inline-block" as const,
};
const button: React.CSSProperties = {
  backgroundColor: "#c9a961",
  borderRadius: 24,
  color: "#17181a",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.18em",
  padding: "12px 28px",
  textDecoration: "none",
  fontFamily: "'Arial', sans-serif",
};
const footer: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  padding: "20px 36px 40px",
  textAlign: "center",
};
const footerText: React.CSSProperties = {
  color: "#9a8a6a",
  fontSize: 11,
  lineHeight: 1.5,
  margin: "0 0 4px",
  fontFamily: "'Arial', sans-serif",
};
