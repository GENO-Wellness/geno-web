import { Service } from '@/types'

export const coreServiceSlugs = ['counselling', 'coaching', 'mentorship']
export const specializedServiceSlugs = ['training', 'consultation', 'other']

export function isCoreService(slug?: string | null) {
    return coreServiceSlugs.includes(slug ?? '')
}

export function isSpecializedService(slug?: string | null) {
    return specializedServiceSlugs.includes(slug ?? '')
}

export function isServiceBookable(slug?: string | null) {
    return isCoreService(slug)
}

export function serviceAvailabilityLabel(slug?: string | null) {
    if (isSpecializedService(slug)) return 'Request access'
    return 'Bookable'
}

export function groupServices(services: Service[]) {
    return {
        core: services.filter(service => isCoreService(service.slug)),
        specialized: services.filter(service =>
            isSpecializedService(service.slug),
        ),
    }
}
