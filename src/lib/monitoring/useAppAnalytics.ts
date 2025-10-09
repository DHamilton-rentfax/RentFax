'use client'
import { useEffect } from 'react'
import { logEvent } from './logEvent'
import { auth } from '@/firebase/client'

export function useAppAnalytics(page: string) {
  useEffect(() => {
    const user = auth.currentUser
    logEvent('page_view', { page, uid: user?.uid || 'anon' })
  }, [page])
}
