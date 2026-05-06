'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AppHeader } from '@/components/layout/app-header'
import {
    getServiceTone,
    ServiceChevron,
    ServiceVisual,
} from '@/components/services/service-visual'
import { servicesApi } from '@/lib/api/client'
import { Service } from '@/types'
import { cn } from '@/lib/utils'
import {
    groupServices,
    isServiceBookable,
    serviceAvailabilityLabel,
} from '@/lib/service-catalog'

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    )

    const fetchServices = useCallback(async () => {
        setIsLoading(true)
        try {
            const apiCategory =
                selectedCategory === 'core' ||
                selectedCategory === 'specialized'
                    ? null
                    : selectedCategory
            const params = apiCategory
                ? { category: apiCategory }
                : undefined
            const response = await servicesApi.list(params)
            setServices(response.services as Service[])
        } catch (error) {
            console.error('Failed to fetch services:', error)
            toast.error('Failed to fetch services')
        } finally {
            setIsLoading(false)
        }
    }, [selectedCategory])

    useEffect(() => {
        fetchServices()
    }, [fetchServices])

    const categories = [
        { value: null, label: 'All' },
        { value: 'core', label: 'Core Care' },
        { value: 'specialized', label: 'Specialized' },
        { value: 'counselling', label: 'Counselling' },
        { value: 'coaching', label: 'Coaching' },
        { value: 'mentorship', label: 'Mentorship' },
    ]

    const groupedServices = groupServices(services)
    const displayedGroups =
        selectedCategory === 'core'
            ? [{ title: 'Core care', services: groupedServices.core }]
            : selectedCategory === 'specialized'
              ? [
                    {
                        title: 'Specialized programs',
                        services: groupedServices.specialized,
                    },
                ]
              : selectedCategory
                ? [
                      {
                          title: 'Services',
                          services: services.filter(
                              service => service.slug === selectedCategory,
                          ),
                      },
                  ]
                : [
                      { title: 'Core care', services: groupedServices.core },
                      {
                          title: 'Specialized programs',
                          services: groupedServices.specialized,
                      },
                  ]

    const handleUnavailableService = (title: string) => {
        toast.info(`${title} is available by request`, {
            description:
                'We are preparing structured programs for this service. Please check back soon.',
        })
    }

    return (
        <div>
            <AppHeader title="Services" showGreeting={false} />

            <main className="app-page-container">
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category.value ?? 'all'}
                            onClick={() => setSelectedCategory(category.value)}
                            className={cn(
                                'app-tab whitespace-nowrap',
                                selectedCategory === category.value
                                    ? 'app-tab-active'
                                    : 'app-tab-inactive',
                            )}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Services List */}
                {isLoading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div
                                key={i}
                                className="surface-card min-h-44 p-4 animate-pulse"
                            >
                                <div className="size-12 rounded-2xl bg-gray-200" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {displayedGroups.map(group =>
                            group.services.length > 0 ? (
                                <section key={group.title}>
                                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                        {group.title}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {group.services.map(service => {
                                            const tone = getServiceTone(
                                                service.slug,
                                            )
                                            const bookable = isServiceBookable(
                                                service.slug,
                                            )
                                            const card = (
                                                <>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <ServiceVisual
                                                            slug={service.slug}
                                                            className="size-12"
                                                            iconClassName="size-6"
                                                        />
                                                        <span
                                                            className={cn(
                                                                'rounded-full px-2 py-1 text-[10px] font-semibold',
                                                                bookable
                                                                    ? 'bg-green-50 text-green-700'
                                                                    : 'bg-amber-50 text-amber-700',
                                                            )}
                                                        >
                                                            {serviceAvailabilityLabel(
                                                                service.slug,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="mt-4 min-w-0 flex-1">
                                                        <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-gray-950">
                                                            {service.title}
                                                        </h3>
                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                                                            {service.subtitle}
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between gap-2">
                                                        {service.providers_count !==
                                                            undefined && (
                                                            <span className="app-chip bg-gray-100 text-gray-600">
                                                                {
                                                                    service.providers_count
                                                                }{' '}
                                                                provider
                                                                {service.providers_count !==
                                                                1
                                                                    ? 's'
                                                                    : ''}
                                                            </span>
                                                        )}
                                                        {bookable && (
                                                            <ServiceChevron
                                                                slug={
                                                                    service.slug
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                            )

                                            if (!bookable) {
                                                return (
                                                    <button
                                                        key={service.id}
                                                        type="button"
                                                        onClick={() =>
                                                            handleUnavailableService(
                                                                service.title,
                                                            )
                                                        }
                                                        className={cn(
                                                            'surface-card flex min-h-44 flex-col p-4 text-left opacity-85 shadow-lg',
                                                            tone.shadow,
                                                        )}
                                                    >
                                                        {card}
                                                    </button>
                                                )
                                            }

                                            return (
                                                <Link
                                                    key={service.id}
                                                    href={`/services/${service.slug}`}
                                                    className={cn(
                                                        'surface-card surface-card-hover flex min-h-44 flex-col p-4 shadow-lg',
                                                        tone.shadow,
                                                    )}
                                                >
                                                    {card}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </section>
                            ) : null,
                        )}
                    </div>
                )}

                {!isLoading && services.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No services found</p>
                    </div>
                )}
            </main>
        </div>
    )
}
