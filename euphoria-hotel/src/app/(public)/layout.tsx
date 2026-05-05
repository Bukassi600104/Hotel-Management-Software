import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { FloatingActions } from "@/components/public/floating-actions";
import { SmoothScrollProvider } from "@/components/public/smooth-scroll-provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-clip">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <FloatingActions />
      </div>
    </SmoothScrollProvider>
  );
}
