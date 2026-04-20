import { PortfolioShell } from "@/components/portfolio-shell";
import { portfolioData } from "@/lib/portfolio-data";

export default function HomePage() {
  return <PortfolioShell data={portfolioData} />;
}
