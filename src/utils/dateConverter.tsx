import moment from 'moment'
import { DateTime } from 'luxon'

// Converts an ISO string, number, or Date object to a human-readable UTC date string.
// Example: "2025-05-03T12:00:00Z" -> "Sat, 03 May 2025 12:00:00 GMT"
export function convertToReadableDate(isoString: string | number | Date) {
  const date = new Date(isoString)
  return date.toUTCString()
}

// Converts an ISO string to a date-only string in the format "YYYY-MM-DD".
// Example: "2025-05-03T12:00:00.000Z" -> "2025-05-03"
export const convertToDateOnly = (isoString: string, includeTime = false) => {
  const date = new Date(isoString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York' // Optional: adjust based on need
    })
  }

  return date.toLocaleDateString('en-US', options)
}

// Converts an ISO string, number, or Date object to a time-only string in the format "HH:MM:SS".
// Example: "2025-05-03T12:00:00.000Z" -> "12:00:00"
export function convertToTimeOnly(isoString: string | number | Date) {
  const date = new Date(isoString)
  return date.toISOString().split('T')[1].split('.')[0] // Extract HH:MM:SS
}

// Converts an ISO string, number, or Date object to an epoch timestamp (seconds since 1970-01-01).
// Example: "2025-05-03T12:00:00Z" -> 1746273600
export function convertToEpoch(isoString: string | number | Date) {
  return new Date(isoString).getTime() / 1000
}

// Converts an ISO string, number, or Date object to a local date and time string.
// Example: "2025-05-03T12:00:00Z" -> "5/3/2025, 12:00:00 PM" (format depends on locale)
export function convertToLocalTime(isoString: string | number | Date) {
  return new Date(isoString).toLocaleString()
}

export const formatDateToDayAndTime = (dateString: string): string => {
  return moment(dateString).format('dddd [at] h:mm A')
}

const days = [
  { title: 'Monday', value: 1 },
  { title: 'Tuesday', value: 2 },
  { title: 'Wednesday', value: 3 },
  { title: 'Thursday', value: 4 },
  { title: 'Friday', value: 5 },
  { title: 'Saturday', value: 6 },
  { title: 'Sunday', value: 0 },
  { title: 'Everyday', value: 7 }
]

export function convertNewYorkHourToUtc(hour: number, isAm: boolean): number {
  // if (hour < 1 || hour > 12) {
  //   throw new Error('Hour must be between 1 and 12.')
  // }

  // Convert to 24-hour format
  const normalizedHour = isAm ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12

  const now = DateTime.now()
  const newYorkTime = now.setZone('America/New_York').set({
    hour: normalizedHour,
    minute: 0,
    second: 0,
    millisecond: 0
  })

  const utcTime = newYorkTime.toUTC()
  return utcTime.hour
}

export const formatDayTime = (item: { hour: number; minute: number; day: number }): string => {
  // Convert UTC time to New York time
  const utcTime = DateTime.fromObject({ hour: item.hour, minute: item.minute }, { zone: 'UTC' })

  const nyTime = utcTime.setZone('America/New_York')

  const dayName = days.find(day => day.value === item?.day)?.title || 'Everyday'
  const formattedTime = nyTime.toFormat('h:mm a') // e.g. "8:30 AM"

  return `${dayName} at ${formattedTime}`
}

export function convertUtcHourToNewYork(utcHour: number): number {
  if (utcHour < 0 || utcHour > 23) {
    throw new Error('UTC hour must be between 0 and 23.')
  }

  const now = DateTime.now()
  const utcTime = now.setZone('UTC').set({ hour: utcHour, minute: 0, second: 0, millisecond: 0 })

  // Convert UTC to New York time
  const newYorkTime = utcTime.setZone('America/New_York')

  // Normalize hour to 12-hour format
  let hour = newYorkTime.hour

  if (hour > 12) {
    hour -= 12
  } else if (hour === 0) {
    hour = 12 // Midnight case (12 AM)
  }

  return hour
}

//
export const formatDayTimeNewYork = ({ day, hour, minute }: { day: number; hour: number; minute: number }): string => {
  const dayName = days.find(d => d.value === day)?.title || 'Everyday'

  // Use fixed date with UTC base
  const utcTime = DateTime.utc(2023, 1, 1, hour, minute)

  // Convert to New York
  const nyTime = utcTime.setZone('America/New_York')

  return `${dayName} at ${nyTime.toFormat('h:mm a')}` // e.g. "Monday at 1:30 AM"
} // Optional: Extract the rounding logic to a helper
const roundToNearestValidMinute = (minute: number): number => {
  const validMinutes = [0, 15, 30, 45]
  return validMinutes.reduce((prev, curr) => (Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev))
}

export const convertNewYorkHourToUtcs = (hour: number, isAm: boolean) => {
  // Create a DateTime object for New York time
  const newYorkTime = DateTime.fromObject({ hour: hour, minute: 0 }, { zone: 'America/New_York' })

  // If it's AM and hour is 12 (12:00 AM), adjust to 0 hour
  const adjustedTime = isAm && hour === 12 ? newYorkTime.set({ hour: 0 }) : newYorkTime

  // Convert the New York time to UTC
  const utcTime = adjustedTime.toUTC()

  // Return the hour in UTC
  return utcTime.hour
}

export const convertNewYorkHourToUtcss = (hour: number, minute: number, isAm: boolean): string => {
  // Adjust for 12 AM case (since 12 AM is 00 in 24-hour format)
  if (isAm && hour === 12) {
    hour = 0 // 12 AM is 00 in 24-hour format
  }

  // Create a DateTime object for New York time
  const newYorkTime = DateTime.fromObject({ hour, minute }, { zone: 'America/New_York' })

  // Convert the New York time to UTC
  const utcTime = newYorkTime.toUTC()

  // Return the formatted UTC time in HH:mm format
  return utcTime.toFormat('HH:mm')
}

export const convertUtcToNssssewYorkHour = (hour: number, minute: number): string => {
  // Create a UTC DateTime object
  const utcTime = DateTime.fromObject({ hour, minute }, { zone: 'UTC' })

  // Convert to New York time zone
  const newYorkTime = utcTime.setZone('America/New_York')

  // Return formatted time in 12-hour format with AM/PM
  return newYorkTime.toFormat('hh:mm a')
}

export const getNearestValidTime = (hour: number, minute: number): string => {
  const validMinutes = [0, 15, 30, 45]
  const closestMinute = validMinutes.reduce((prev, curr) =>
    Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev
  )

  // Create UTC DateTime and convert to America/New_York
  const utcTime = DateTime.fromObject({ hour, minute: closestMinute }, { zone: 'UTC' })
  const nyTime = utcTime.setZone('America/New_York')

  // Format as "H:mm" to match 0:30, 9:15, etc.
  return nyTime.toFormat('H:mm')
}
