import { notFound } from "next/navigation";
import { CmsPageEditor } from "@/components/cms/cms-page-editor";
import { getCmsFooter, getCmsPage } from "@/lib/cms/content";
import { editablePages, type CmsPageSlug } from "@/lib/cms/defaults";

export default async function CmsEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!editablePages.some((page) => page.slug === slug)) notFound();

  const [page, footer] = await Promise.all([getCmsPage(slug as CmsPageSlug), getCmsFooter()]);
  return <CmsPageEditor page={page} footer={footer} />;
}
