import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://trinity-health-solution.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Trinity Health Solution | Maternal & Infant Health Care Access (ትሪኒቲ ሄልዝ ሶሉሽን)",
    template: "%s | Trinity Health Solution",
  },
  description:
    "Community-first, evidence-grounded maternal and infant health education for Ethiopian families. Access approved infant nutrition guidance, clean water safety, antenatal care, and Ask Opal AI guidance in English and Amharic (አማርኛ)።",
  applicationName: "Trinity Health Solution",
  authors: [{ name: "Trinity Health Solution", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    // English keywords
    "Trinity Health Solution",
    "Maternal Health Ethiopia",
    "Infant Nutrition Ethiopia",
    "Child Health Care Access",
    "Breastfeeding in Emergencies",
    "Antenatal Care Guidelines 2022",
    "Preconception Care Ethiopia",
    "Clean Drinking Water Household Safety",
    "Ask Opal AI Health Assistant",
    "Community Health Workers Ethiopia",
    "Family Nutrition and Pantry Explorer",
    "UNICEF Maternal Health Ethiopia",
    // Amharic keywords
    "ትሪኒቲ ሄልዝ ሶሉሽን",
    "የእናቶችና ህፃናት ጤና",
    "የህፃናት አመጋገብ",
    "የጡት ማጥባት መመሪያ",
    "የእርግዝና ክትትል",
    "የቅድመ እርግዝና ዝግጅት",
    "አስተማማኝ የመጠጥ ውሃ",
    "የቤተሰብ ጤና ትምህርት",
    "ኦፓል የጤና ረዳት",
    "የኢትዮጵያ ጤና ጥበቃ መመሪያ",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Trinity Health Solution",
  publisher: "Trinity Health Solution",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "am-ET": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["am_ET"],
    url: siteUrl,
    siteName: "Trinity Health Solution | ትሪኒቲ ሄልዝ ሶሉሽን",
    title:
      "Trinity Health Solution | Maternal & Infant Health Care Access (ትሪኒቲ ሄልዝ ሶሉሽን)",
    description:
      "Empowering Ethiopian mothers, children, and families with practical, culturally rooted health learning, verified infant nutrition guidance, and 24/7 Opal AI assistance in English and Amharic (አማርኛ)።",
    images: [
      {
        url: "/images/maternal-care-hero.png",
        width: 1200,
        height: 630,
        alt: "Trinity Health Solution - Maternal & Infant Health Care Access for Ethiopian Families",
      },
      {
        url: "/images/logo-trinity-web.png",
        width: 800,
        height: 800,
        alt: "Trinity Health Solution Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Trinity Health Solution | Maternal & Infant Health Care Access (ትሪኒቲ ሄልዝ)",
    description:
      "Community-first maternal, infant feeding, and clean water education for Ethiopian families in English and Amharic (አማርኛ)።",
    images: ["/images/maternal-care-hero.png"],
  },
  verification: {
    google: "Yo8y7Dmk4XJSO-kSP80EAkyQWLY41l_cv8QrbcPEcd0",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  other: {
    "google-site-verification": "Yo8y7Dmk4XJSO-kSP80EAkyQWLY41l_cv8QrbcPEcd0",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Trinity Health Solution",
      alternateName: "ትሪኒቲ ሄልዝ ሶሉሽን",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo-trinity-web.png`,
      },
      description:
        "Community-first maternal, infant feeding, clean water, and public health learning platform for Ethiopian families.",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+251-98-872-0194",
          contactType: "customer support",
          areaServed: "ET",
          availableLanguage: ["English", "Amharic"],
        },
        {
          "@type": "ContactPoint",
          telephone: "952",
          contactType: "emergency",
          areaServed: "ET",
          availableLanguage: ["Amharic", "English"],
        },
      ],
      sameAs: ["https://github.com/yoh-space/trinity-health-solution"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Trinity Health Solution",
      alternateName: "ትሪኒቲ ሄልዝ ሶሉሽን",
      inLanguage: ["en-US", "am-ET"],
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="Yo8y7Dmk4XJSO-kSP80EAkyQWLY41l_cv8QrbcPEcd0"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(inter.className, montserrat.className, lato.className)}
      >
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
