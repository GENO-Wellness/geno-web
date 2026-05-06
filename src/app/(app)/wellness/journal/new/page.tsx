'use client'

import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/layout/app-header'
import { JournalEntryForm } from '@/components/wellness/journal'

export default function NewJournalEntryPage() {
    const router = useRouter()

    const handleSuccess = () => {
        router.push('/wellness/journal')
    }

    const handleCancel = () => {
        router.back()
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <AppHeader
                title="New Journal Entry"
                showBack
                onBack={() => router.back()}
            />

            <main className="app-page-container-tight">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <JournalEntryForm
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </div>
            </main>
        </div>
    )
}
