import { CmsDashboard } from "@/components/cms/cms-dashboard";
import { getCmsFooter, getCmsPages } from "@/lib/cms/content";

export default async function CmsHomePage() {
  const [pages, footer] = await Promise.all([getCmsPages(), getCmsFooter()]);
  return <CmsDashboard pages={pages} footer={footer} />;
}
