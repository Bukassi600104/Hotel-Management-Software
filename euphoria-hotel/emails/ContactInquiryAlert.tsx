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
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  source: "contact" | "conference";
  receivedAt: string;
};

export default function ContactInquiryAlert({
  name = "Adaeze Madu",
  email = "adaeze@example.com",
  phone,
  topic = "Reservation enquiry",
  message = "I would like to enquire about a double room for next weekend.",
  source = "contact",
  receivedAt = "4 May 2026, 14:32",
}: Props) {
  const sourceLabel = source === "conference" ? "Conference Enquiry" : "Contact Form";

  return (
    <Html>
      <Head />
      <Preview>
        New {sourceLabel.toLowerCase()} from {name} — {topic}
      </Preview>
      <Body style={body}>
        <Section style={header}>
          <Text style={hotelName}>HILTON EUPHORIA HOTEL</Text>
          <Text style={badge}>{sourceLabel.toUpperCase()}</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>New enquiry received</Heading>
          <Text style={meta}>
            Received: {receivedAt} · Source: {sourceLabel}
          </Text>

          <Hr style={divider} />

          <Text style={sectionTitle}>FROM</Text>
          <DetailRow label="Name" value={name} />
          <DetailRow label="Email" value={email} />
          {phone && <DetailRow label="Phone" value={phone} />}
          <DetailRow label="Topic" value={topic} />

          <Hr style={divider} />

          <Text style={sectionTitle}>MESSAGE</Text>
          <Text style={messageBox}>{message}</Text>

          <Hr style={divider} />

          <Text style={replyNote}>
            Reply directly to this email or call the guest at{" "}
            {phone ?? "no phone provided"}.
          </Text>
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
  margin: "0 0 8px",
};
const badge: React.CSSProperties = {
  color: "#17181a",
  backgroundColor: "#c9a961",
  fontSize: 10,
  letterSpacing: "0.25em",
  margin: 0,
  display: "inline-block" as const,
  padding: "3px 10px",
  borderRadius: 2,
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: 560,
  margin: "0 auto",
  padding: "32px",
};
const h1: React.CSSProperties = {
  color: "#111827",
  fontSize: 22,
  fontWeight: 700,
  margin: "0 0 6px",
};
const meta: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: 12,
  margin: "0 0 16px",
};
const divider: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "18px 0",
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
  width: 80,
  display: "inline-block" as const,
};
const detailValue: React.CSSProperties = {
  color: "#111827",
  fontSize: 14,
  margin: 0,
};
const messageBox: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  borderLeft: "3px solid #c9a961",
  color: "#374151",
  fontSize: 14,
  lineHeight: 1.6,
  margin: "0 0 8px",
  padding: "14px 16px",
  whiteSpace: "pre-wrap",
};
const replyNote: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 13,
  margin: 0,
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
