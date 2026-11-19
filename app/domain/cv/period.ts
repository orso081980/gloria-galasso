import type { DateRange, LanguageLevel, PartialDate, UiStrings } from './types'

type PeriodTexts = Pick<UiStrings, 'months' | 'present'>

/** 'YYYY-MM' -> 'Jun 2026' (month names of the page language), 'YYYY' -> '2026'. Locale independent code, so SSR and client always match. */
export function formatPartialDate(date: PartialDate, ui: Pick<UiStrings, 'months'>): string {
  const [year, month] = date.split('-')
  const monthIndex = month ? Number(month) - 1 : -1
  return monthIndex >= 0 && monthIndex < 12 ? `${ui.months[monthIndex]} ${year}` : String(year)
}

export function formatPeriod({ start, end }: DateRange, ui: PeriodTexts): string {
  if (!end) return `${formatPartialDate(start, ui)} – ${ui.present}`
  if (start === end) return formatPartialDate(start, ui)
  return `${formatPartialDate(start, ui)} – ${formatPartialDate(end, ui)}`
}

const LEVEL_TO_PERCENT: Record<LanguageLevel, number> = {
  Native: 100,
  C1: 85,
  B2: 70,
  B1: 55,
}

export function levelToPercent(level: LanguageLevel): number {
  return LEVEL_TO_PERCENT[level]
}
