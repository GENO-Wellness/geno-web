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

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    )

    const fetchServices = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = selectedCategory
                ? { category: selectedCategory }
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
        { value: 'counselling', label: 'Counselling' },
        { value: 'coaching', label: 'Coaching' },
        { value: 'training', label: 'Training' },
        { value: 'mentorship', label: 'Mentorship' },
        { value: 'consultation', label: 'Consultation' },
        { value: 'other', label: 'Others' },
    ]

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
                    <div className="grid grid-cols-2 gap-4">
                        {services.map(service => {
                            const tone = getServiceTone(service.slug)

                            return (
                                <Link
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    className={cn(
                                        'surface-card surface-card-hover flex min-h-44 flex-col p-4 shadow-lg',
                                        tone.shadow,
                                    )}
                                >
                                    <ServiceVisual
                                        slug={service.slug}
                                        className="size-12"
                                        iconClassName="size-6"
                                    />
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
                                                {service.providers_count}{' '}
                                                provider
                                                {service.providers_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        )}
                                        <ServiceChevron slug={service.slug} />
                                    </div>
                                </Link>
                            )
                        })}
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
