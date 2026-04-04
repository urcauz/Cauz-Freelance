import Script from "next/script";
import SiteFrame from "app/components/SiteFrame";
import "./globals.css";

const SOCIAL_PREVIEW_IMAGE = "https://i.ibb.co/Wv5XjYFs/Screenshot-from-2026-04-04-10-49-58.png";

export const metadata = {
  title: "Cauz Product Studio | Freelance Web & Product Engineering",
  description:
    "Independent product studio delivering modern websites, frontend systems, automation workflows, and growth-focused execution.",
  openGraph: {
    title: "Cauz Product Studio",
    description:
      "Portfolio and booking platform for web builds, product systems, and measurable launch outcomes.",
    type: "website",
    images: [
      {
        url: SOCIAL_PREVIEW_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cauz Product Studio preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cauz Product Studio",
    description:
      "Portfolio and booking platform for web builds, product systems, and measurable launch outcomes.",
    images: [SOCIAL_PREVIEW_IMAGE]
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
