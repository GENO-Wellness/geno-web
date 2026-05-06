import { FiChevronRight } from 'react-icons/fi'

import { cn } from '@/lib/utils'

type ServiceVisualProps = {
    slug: string
    className?: string
    iconClassName?: string
}

export type ServiceTone = {
    accent: string
    soft: string
    shadow: string
}

const serviceIcons: Record<string, string> = {
    counselling: '/images/services/mental_wellness.svg',
    coaching: '/images/services/spiritual.svg',
    training: '/images/services/diary.svg',
    mentorship: '/images/services/pregnancy.svg',
    consultation: '/images/services/medical.svg',
    other: '/images/services/spiritual.svg',
}

const serviceTones: Record<string, ServiceTone> = {
    counselling: {
        accent: 'text-purple-600',
        soft: 'bg-purple-50',
        shadow: 'shadow-purple-500/10',
    },
    coaching: {
        accent: 'text-pink-600',
        soft: 'bg-pink-50',
        shadow: 'shadow-pink-500/10',
    },
    training: {
        accent: 'text-teal-600',
        soft: 'bg-teal-50',
        shadow: 'shadow-teal-500/10',
    },
    mentorship: {
        accent: 'text-blue-600',
        soft: 'bg-blue-50',
        shadow: 'shadow-blue-500/10',
    },
    consultation: {
        accent: 'text-cyan-600',
        soft: 'bg-cyan-50',
        shadow: 'shadow-cyan-500/10',
    },
    other: {
        accent: 'text-orange-600',
        soft: 'bg-orange-50',
        shadow: 'shadow-orange-500/10',
    },
}

export function getServiceTone(slug: string): ServiceTone {
    return (
        serviceTones[slug] ?? {
            accent: 'text-primary',
            soft: 'bg-primary/10',
            shadow: 'shadow-primary/10',
        }
    )
}

export function ServiceVisual({
    slug,
    className,
    iconClassName,
}: ServiceVisualProps) {
    const tone = getServiceTone(slug)
    const iconPath = serviceIcons[slug] ?? serviceIcons.other

    return (
        <div
            className={cn(
                'flex items-center justify-center rounded-2xl',
                tone.soft,
                tone.accent,
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cn('block size-7 bg-current', iconClassName)}
                style={{
                    WebkitMaskImage: `url(${iconPath})`,
                    maskImage: `url(${iconPath})`,
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                }}
            />
        </div>
    )
}

export function ServiceChevron({ slug }: { slug: string }) {
    return (
        <FiChevronRight
            className={cn('size-5 flex-shrink-0', getServiceTone(slug).accent)}
        />
    )
}
