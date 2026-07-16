import Script from "next/script";

const parseTagIds = (...inputs: Array<string | undefined>) =>
    Array.from(
        new Set(
            inputs
                .flatMap((value) => String(value || "").split(","))
                .map((value) => value.trim())
                .filter(Boolean)
        )
    );

export default function AnalyticsScripts() {
    const analyticsMode = process.env.NEXT_PUBLIC_ANALYTICS_MODE
        ?.trim()
        .toLowerCase();
    const gtmId = analyticsMode === "gtag"
        ? undefined
        : process.env.NEXT_PUBLIC_GTM_ID ||
          process.env.GTM_ID ||
          "GTM-P45XTFCS";
    const configuredGoogleTagIds = parseTagIds(
        process.env.GOOGLE_ANALYTICS_ID,
        process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
        process.env.GOOGLE_TAG_IDS,
        process.env.NEXT_PUBLIC_GOOGLE_TAG_IDS
    );
    const directGoogleTagIds = parseTagIds(
        process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
        process.env.NEXT_PUBLIC_GOOGLE_TAG_IDS
    );
    const googleTagIds =
        analyticsMode === "gtag" && directGoogleTagIds.length
            ? directGoogleTagIds
            : configuredGoogleTagIds;
    const primaryGoogleTagId = googleTagIds[0];
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

            {!gtmId && primaryGoogleTagId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${primaryGoogleTagId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                        window.dataLayer = window.dataLayer || [];
                        window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                        window.gtag('js', new Date());
                        ${googleTagIds
                            .map((tagId, index) =>
                                index === 0
                                    ? `window.gtag('config', '${tagId}', { page_path: window.location.pathname });`
                                    : `window.gtag('config', '${tagId}', { send_page_view: false });`
                            )
                            .join("\n")}
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
