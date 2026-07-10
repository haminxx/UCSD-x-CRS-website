'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BoldHoverText, SpringUnderline } from '@/components/spring-underline'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

const HERO_VIDEO_SRC = '/videos/ucsdxcrs-v4.mp4'

const RESTING_OPACITY = 1
const IDLE_MS = 2500
const FADE_OUT_S = 1.6
const FADE_IN_SPRING = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.75 }
const LOGO_REVEAL = { duration: 1.15, ease: [0.22, 1, 0.36, 1] as const, delay: 0.35 }
const LINE_EASE = [0.16, 1, 0.3, 1] as const

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.17,
            delayChildren: 0.1,
        },
    },
}

const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.78, ease: LINE_EASE },
    },
}

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

/** CTA with bold-on-hover label; width reserved so the pill never grows. */
function JoinTeamButton() {
    const [hovered, setHovered] = useState(false)

    return (
        <Button
            asChild
            size="lg"
            className="h-12 rounded-full border-0 bg-white pl-5 pr-3 text-base font-medium text-black shadow-none hover:bg-white/90 hover:text-black"
        >
            <Link
                href="/recruitment/"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <BoldHoverText active={hovered} from={500} to={800} className="text-nowrap">
                    Join the team
                </BoldHoverText>
                <ChevronRight className="ml-1 shrink-0" />
            </Link>
        </Button>
    )
}

export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null)
    const [contentVisible, setContentVisible] = useState(true)
    const [fadingOut, setFadingOut] = useState(false)

    useEffect(() => {
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
    }, [])

    return (
        <>
            <SiteHeader />

            <main className="overflow-x-hidden">
                <section ref={heroRef} className="relative">
                    {/* Slightly under full viewport so the logo cloud peeks into the first screen */}
                    <div className="relative isolate min-h-[88dvh] w-full overflow-hidden bg-[#0a1218]">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="absolute inset-0 h-full w-full origin-bottom scale-[1.06] object-cover object-[center_bottom] -translate-y-[2vh] sm:scale-[1.08] sm:-translate-y-[2.5vh] md:scale-[1.1] md:-translate-y-[3vh] lg:scale-[1.12] lg:-translate-y-[3.5vh]"
                            src={HERO_VIDEO_SRC}
                        />

                        {/* Blur while UI is visible; clears when idle (synced with text fade) */}
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-[1] bg-black/45 backdrop-blur-[6px]"
                            animate={{
                                opacity: contentVisible ? 1 : 0,
                            }}
                            transition={
                                fadingOut
                                    ? { duration: FADE_OUT_S, ease: 'easeOut' }
                                    : FADE_IN_SPRING
                            }
                        />
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-transparent to-black/55"
                            animate={{
                                opacity: contentVisible ? 1 : 0.35,
                            }}
                            transition={
                                fadingOut
                                    ? { duration: FADE_OUT_S, ease: 'easeOut' }
                                    : FADE_IN_SPRING
                            }
                        />

                        {/* Same max-w-7xl + px rhythm as SiteHeader so copy shares the header column on xl/2xl */}
                        <div className="relative z-10 mx-auto flex min-h-[88dvh] w-full max-w-7xl flex-col justify-center px-6 pb-20 pt-32 lg:px-12 lg:pb-24 lg:pt-40">
                            {/* Centered on mobile/tablet/narrow desktop; left-aligned to header edge from xl up */}
                            <motion.div
                                className="mx-auto w-full max-w-3xl text-center sm:max-w-4xl xl:mx-0 xl:max-w-[min(100%,42rem)] xl:text-left 2xl:max-w-[min(100%,48rem)]"
                                animate={{
                                    opacity: contentVisible ? RESTING_OPACITY : 0,
                                }}
                                transition={
                                    fadingOut
                                        ? { duration: FADE_OUT_S, ease: 'easeOut' }
                                        : FADE_IN_SPRING
                                }
                                style={{
                                    pointerEvents: contentVisible ? 'auto' : 'none',
                                }}
                            >
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <h1 className="mx-auto max-w-2xl text-[clamp(1.75rem,4.2vw,3.25rem)] font-black leading-[1.12] tracking-tight text-white mix-blend-difference md:text-5xl xl:mx-0 xl:max-w-none xl:text-[clamp(3.35rem,2.15rem+1.15vw,4.5rem)]">
                                        <motion.span
                                            variants={staggerItem}
                                            className="block whitespace-nowrap"
                                        >
                                            Engineering the future
                                        </motion.span>
                                        <motion.span
                                            variants={staggerItem}
                                            className="block whitespace-nowrap"
                                        >
                                            of collegiate motorsport
                                        </motion.span>
                                    </h1>
                                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white mix-blend-difference md:mt-6 md:max-w-2xl md:text-lg xl:mx-0 xl:text-[clamp(1.125rem,0.95rem+0.35vw,1.375rem)]">
                                        <motion.span
                                            variants={staggerItem}
                                            className="block whitespace-nowrap"
                                        >
                                            Learning by doing. We run a fully structured,
                                        </motion.span>
                                        <motion.span
                                            variants={staggerItem}
                                            className="block whitespace-nowrap"
                                        >
                                            student-led organization apply hands-on knowledge
                                        </motion.span>
                                        <motion.span
                                            variants={staggerItem}
                                            className="block whitespace-nowrap"
                                        >
                                            to compete in the Collegiate Racing Series.
                                        </motion.span>
                                    </p>

                                    <motion.div
                                        variants={staggerItem}
                                        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:mt-12 xl:justify-start"
                                    >
                                        <JoinTeamButton />
                                        <SponsorLink />
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <motion.section
                    className="bg-background pb-4 pt-2"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={LOGO_REVEAL}
                >
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
                </motion.section>

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
