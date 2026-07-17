import Script from "next/script";
import { getAnalyticsConfig } from "@/lib/analytics-config";

export default function AnalyticsScripts() {
    const { mode, gtmId, googleTagId } = getAnalyticsConfig();
    const fbPixelId =
        process.env.META_PIXEL_ID ||
        process.env.META_CAPI_PIXEL_ID ||
        process.env.FACEBOOK_PIXEL_ID;

    return (
        <>
            {gtmId && (
                <>
                    <Script
                        id="google-tag-manager"
                        strategy="afterInteractive"
                    >
                        {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w.gtag=w.gtag||function(){w[l].push(arguments);};w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','${gtmId}');
                        `}
                    </Script>
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                            title="google-tag-manager"
                        />
                    </noscript>
                </>
            )}

            {mode === "gtag" && googleTagId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                        window.dataLayer = window.dataLayer || [];
                        window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                        window.gtag('js', new Date());
                        window.gtag('config', '${googleTagId}', { page_path: window.location.pathname });
                        `}
                    </Script>
                </>
            )}

            {fbPixelId && (
                <>
                    <Script id="facebook-pixel" strategy="afterInteractive">
                        {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${fbPixelId}');
                        fbq('track', 'PageView');
                        `}
                    </Script>
                    <noscript>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            height="1"
                            width="1"
                            style={{ display: "none" }}
                            src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
                            alt=""
                        />
                    </noscript>
                </>
            )}
        </>
    );
}
