'use client'

import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("./client-page"), { ssr: false });

export default function Page() {
    return <NoSSR />;
}