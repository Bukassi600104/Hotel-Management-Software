import { differenceInCalendarDays, parseISO, isValid, isBefore, startOfDay } from 'date-fns'

export function calculateNights(checkin: string, checkout: string): number {
  return differenceInCalendarDays(parseISO(checkout), parseISO(checkin))
}

export function formatDateForDB(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isDateInPast(dateStr: string): boolean {
  const date = parseISO(dateStr)
  return !isValid(date) || isBefore(startOfDay(date), startOfDay(new Date()))
}

export function isStayTooLong(checkin: string, checkout: string, maxNights = 30): boolean {
  return calculateNights(checkin, checkout) > maxNights
}

export function isValidDateString(str: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false
  return isValid(parseISO(str))
}
