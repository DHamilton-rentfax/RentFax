'use client'
import { useTranslations } from 'next-intl'

export default function GetStartedModal() {
  const t = useTranslations()
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{t('search_reports')}</h2>
      <label>{t('first_name')}</label>
      <input className="border rounded p-1" />
    </div>
  )
}
