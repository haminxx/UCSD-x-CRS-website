'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SpringUnderline } from '@/components/spring-underline'
import { PageEnter } from '@/components/page-motion'
import { HomeIntro, shouldSkipHomeIntro } from '@/components/home-intro'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

const RESTING_OPACITY = 1
const IDLE_MS = 2500
const FADE_OUT_S = 1.6
const FADE_IN_SPRING = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.75 }
const CHROME_REVEAL = { duration: 1.35, ease: [0.22, 1, 0.36, 1] as const }

function SponsorLink() {
    return (
        <Link
            href="/sponsors/"
            className="inline-flex items-center px-2 py-2 text-base text-white mix-blend-difference"
        >
            <SpringUnderline className="text-nowrap pb-0.5">
                Become a Sponsor
            </SpringUnderline>
        </Link>
    )
}

export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null)
    const [contentVisible, setContentVisible] = useState(true)
    const [fadingOut, setFadingOut] = useState(false)
    // null = hydrating / checking sessionStorage; avoid content flash
    const [introActive, setIntroActive] = useState<boolean | null>(null)
    const [chromeReady, setChromeReady] = useState(false)

    useEffect(() => {
        const skip = shouldSkipHomeIntro()
        setIntroActive(!skip)
        if (skip) setChromeReady(true)
    }, [])

    const onIntroComplete = useCallback(() => {
        setIntroActive(false)
        // Slow reveal of header + hero copy after expand
        window.setTimeout(() => setChromeReady(true), 80)
    }, [])

    useEffect(() => {
        if (!chromeReady) return

        const hero = heroRef.current
        if (!hero) return

        let idleTimer: ReturnType<typeof setTimeout> | null = null
        let inView = true

        const clearIdle = () => {
            if (idleTimer) {
                clearTimeout(idleTimer)
                idleTimer = null
            }
        }

        const startIdle = () => {
            clearIdle()
            if (!inView) return
            idleTimer = setTimeout(() => {
                setFadingOut(true)
                setContentVisible(false)
            }, IDLE_MS)
        }

        const onActivity = () => {
            if (!inView) return
            setContentVisible(true)
            setFadingOut(false)
            startIdle()
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting
                if (inView) {
                    onActivity()
                } else {
                    clearIdle()
                    setContentVisible(true)
                    setFadingOut(false)
                }
            },
            { threshold: 0.25 }
        )
        observer.observe(hero)

        const events = [
            'mousemove',
            'mousedown',
            'keydown',
            'touchstart',
            'wheel',
            'scroll',
            'pointermove',
            'click',
        ] as const

        for (const event of events) {
            window.addEventListener(event, onActivity, { passive: true })
        }

        startIdle()

        return () => {
            observer.disconnect()
            clearIdle()
            for (const event of events) {
                window.removeEventListener(event, onActivity)
            }
        }
    }, [chromeReady])

    const showIntro = introActive === true
    const awaitingIntroCheck = introActive === null

    return (
        <>
            {/* Solid hold while sessionStorage is checked — prevents hero flash */}
            {awaitingIntroCheck && (
                <div className="fixed inset-0 z-[90] bg-[#0a1218]" aria-hidden />
            )}

            {showIntro && <HomeIntro onComplete={onIntroComplete} />}

            <motion.div
                initial={false}
                animate={{ opacity: chromeReady ? 1 : 0 }}
                transition={CHROME_REVEAL}
                style={{ pointerEvents: chromeReady ? 'auto' : 'none' }}
            >
                <SiteHeader />
            </motion.div>

            <main className="overflow-x-hidden">
                <section ref={heroRef} className="relative">
                    <div className="relative isolate min-h-[min(92vh,56rem)] overflow-hidden sm:min-h-[min(88vh,48rem)]">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="absolute inset-0 size-full scale-125 object-cover"
                            src="/videos/ucsdxcrs-v2.mp4"
                        />

                        {/* Blur while UI is visible; clears when idle (synced with text fade) */}
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-[1] bg-black/45 backdrop-blur-[6px]"
                            animate={{
                                opacity: chromeReady && contentVisible ? 1 : chromeReady ? 0 : 0.55,
                            }}
                            transition={
                                fadingOut
                                    ? { duration: FADE_OUT_S, ease: 'easeOut' }
                                    : chromeReady
                                      ? FADE_IN_SPRING
                                      : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                            }
                        />
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-transparent to-black/55"
                            animate={{
                                opacity: chromeReady && contentVisible ? 1 : chromeReady ? 0.35 : 0.5,
                            }}
                            transition={
                                fadingOut
                                    ? { duration: FADE_OUT_S, ease: 'easeOut' }
                                    : chromeReady
                                      ? FADE_IN_SPRING
                                      : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                            }
                        />

                        <div className="relative z-10 mx-auto flex min-h-[min(92vh,56rem)] max-w-7xl flex-col justify-center px-6 pb-20 pt-32 sm:min-h-[min(88vh,48rem)] lg:px-12 lg:pb-24 lg:pt-40">
                            <motion.div
                                initial={false}
                                animate={{ opacity: chromeReady ? 1 : 0 }}
                                transition={{ ...CHROME_REVEAL, delay: chromeReady ? 0.15 : 0 }}
                            >
                                <PageEnter>
                                    <motion.div
                                        className="mx-auto w-full max-w-3xl text-center sm:max-w-4xl lg:ml-0 lg:max-w-full lg:text-left"
                                        animate={{
                                            opacity: contentVisible ? RESTING_OPACITY : 0,
                                        }}
                                        transition={
                                            fadingOut
                                                ? { duration: FADE_OUT_S, ease: 'easeOut' }
                                                : FADE_IN_SPRING
                                        }
                                        style={{
                                            pointerEvents: contentVisible && chromeReady ? 'auto' : 'none',
                                        }}
                                    >
                                        <h1 className="max-w-2xl text-[clamp(1.75rem,4.2vw,3.25rem)] font-black leading-[1.12] tracking-tight text-white mix-blend-difference md:text-5xl xl:text-[3.35rem]">
                                            <span className="block whitespace-nowrap">Engineering the future</span>
                                            <span className="block">of collegiate motorsport</span>
                                        </h1>
                                        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-white mix-blend-difference md:mt-6 md:max-w-2xl md:text-lg">
                                            Learning by doing. We run a fully structured, student-led organization applying hands-on knowledge to compete in the Collegiate Racing Series.
                                        </p>

                                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:mt-12 lg:justify-start">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="h-12 rounded-full border-0 bg-white pl-5 pr-3 text-base text-black shadow-none hover:bg-white/90 hover:text-black">
                                                <Link href="/recruitment/">
                                                    <span className="text-nowrap">Join the team</span>
                                                    <ChevronRight className="ml-1" />
                                                </Link>
                                            </Button>
                                            <SponsorLink />
                                        </div>
                                    </motion.div>
                                </PageEnter>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-4 pt-2">
                    <div className="group relative m-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:border-white/15 md:pr-6">
                                <p className="text-end text-sm text-white/70">Powering the best teams</p>
                            </div>
                            <div className="relative py-8 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                            alt="Nvidia Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/column.svg"
                                            alt="Column Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/github.svg"
                                            alt="GitHub Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/nike.svg"
                                            alt="Nike Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                            alt="Lemon Squeezy Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/laravel.svg"
                                            alt="Laravel Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-7 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/lilly.svg"
                                            alt="Lilly Logo"
                                            height="28"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-6 w-fit invert"
                                            src="https://html.tailus.io/blocks/customers/openai.svg"
                                            alt="OpenAI Logo"
                                            height="24"
                                            width="auto"
                                        />
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    aria-label="Section placeholder 1"
                    className="flex min-h-dvh items-start bg-background px-6 pt-28 md:px-10 lg:px-12"
                >
                    <div className="mx-auto w-full max-w-7xl">
                        <p className="text-sm tracking-wide text-white/45">
                            Section — coming soon
                        </p>
                    </div>
                </section>

                <section
                    aria-label="Section placeholder 2"
                    className="flex min-h-dvh items-start bg-background px-6 pt-28 md:px-10 lg:px-12"
                >
                    <div className="mx-auto w-full max-w-7xl">
                        <p className="text-sm tracking-wide text-white/45">
                            Section — coming soon
                        </p>
                    </div>
                </section>

                <section
                    aria-label="Section placeholder 3"
                    className="flex min-h-dvh items-start bg-background px-6 pt-28 md:px-10 lg:px-12"
                >
                    <div className="mx-auto w-full max-w-7xl">
                        <p className="text-sm tracking-wide text-white/45">
                            Section — coming soon
                        </p>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </>
    )
}
