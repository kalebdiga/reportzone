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
