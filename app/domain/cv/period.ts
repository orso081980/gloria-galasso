import type { DateRange, LanguageLevel, PartialDate } from './types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** 'YYYY-MM' -> 'Jun 2026', 'YYYY' -> '2026'. Locale independent so SSR and client always match. */
export function formatPartialDate(date: PartialDate): string {
  const [year, month] = date.split('-')
  const monthIndex = month ? Number(month) - 1 : -1
  return monthIndex >= 0 && monthIndex < 12 ? `${MONTHS[monthIndex]} ${year}` : String(year)
}

export function formatPeriod({ start, end }: DateRange): string {
  if (!end) return `${formatPartialDate(start)} – Present`
  if (start === end) return formatPartialDate(start)
  return `${formatPartialDate(start)} – ${formatPartialDate(end)}`
}

/** Machine readable value for the <time> element. */
export function toIso(date: PartialDate): string {
  return date
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
