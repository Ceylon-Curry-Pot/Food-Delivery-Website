'use client'

import React from "react"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react"
import LoyaltySessionSync from "@/components/loyalty/LoyaltySessionSync"

function Providers({children}: {children: React.ReactNode}){
    return (
        // refetchInterval keeps the session state (and therefore the loyalty
        // sync below) from going stale in a tab left open past the 8h expiry
        // without ever regaining window focus.
        <SessionProvider refetchInterval={5 * 60}>
            <LoyaltySessionSync />
            <Toaster />
            <ThemeProvider
                attribute={'class'}
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </SessionProvider>
    )
}

export default Providers;