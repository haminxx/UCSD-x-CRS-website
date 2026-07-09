'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { SiteHeader } from '@/components/site-header'
import { ChevronRight } from 'lucide-react'

export function HeroSection() {
    return (
        <>
            <SiteHeader />
            <main className="overflow-x-hidden">
                <section className="px-1 pt-1">
                    <div className="relative isolate min-h-[min(92vh,56rem)] overflow-hidden rounded-3xl border border-black/10 sm:min-h-[min(88vh,48rem)] lg:rounded-[3rem] dark:border-white/5">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 size-full scale-125 object-cover"
                            src="/videos/ucsdxcrs.mp4"
                        />

                        <div className="relative z-10 mx-auto flex min-h-[min(92vh,56rem)] max-w-7xl flex-col justify-center px-6 pb-16 pt-28 sm:min-h-[min(88vh,48rem)] lg:px-12 lg:pb-20 lg:pt-36">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="max-w-2xl text-balance text-5xl font-bold tracking-tight text-white mix-blend-difference md:text-6xl xl:text-7xl">
                                    Engineering the future of collegiate motorsport
                                </h1>
                                <p className="mt-6 max-w-2xl text-balance text-lg text-white mix-blend-difference md:mt-8">
                                    Learning by doing. We run a fully structured, student-led organization applying hands-on knowledge to compete in the Collegiate Racing Series.
                                </p>

                                <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:mt-10 lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full border-0 bg-black pl-5 pr-3 text-base text-white shadow-none hover:bg-black/90 hover:text-white">
                                        <Link href="/recruitment/">
                                            <span className="text-nowrap">Join the team</span>
                                            <ChevronRight className="ml-1" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full border border-white/80 bg-transparent px-5 text-base text-white shadow-none hover:bg-white/10 hover:text-white">
                                        <Link href="/sponsors/">
                                            <span className="text-nowrap">Become a Sponsor</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-2">
                    <div className="group relative m-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">Powering the best teams</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                            alt="Nvidia Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/column.svg"
                                            alt="Column Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/github.svg"
                                            alt="GitHub Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nike.svg"
                                            alt="Nike Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                            alt="Lemon Squeezy Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/laravel.svg"
                                            alt="Laravel Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-7 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lilly.svg"
                                            alt="Lilly Logo"
                                            height="28"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-6 w-fit dark:invert"
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
            </main>
        </>
    )
}
