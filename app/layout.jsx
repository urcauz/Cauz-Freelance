import Script from "next/script";
import SiteFrame from "app/components/SiteFrame";
import "./globals.css";

export const metadata = {
  title: "Cauz Product Studio | Freelance Web & Product Engineering",
  description:
    "Independent product studio delivering modern websites, frontend systems, automation workflows, and growth-focused execution.",
  openGraph: {
    title: "Cauz Product Studio",
    description:
      "Portfolio and booking platform for web builds, product systems, and measurable launch outcomes.",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="en">
      <body>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}

        {clarityId ? (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        ) : null}

        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
