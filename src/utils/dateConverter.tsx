export function convertToReadableDate(isoString: string | number | Date) {
  const date = new Date(isoString)
  return date.toUTCString()
}
export const convertToDateOnly = (isoString: string) => {
  console.log(isoString, "''''''")
  if (!isoString) return 'Invalid Date' // Prevent errors on null/undefined

  try {
    const validISO = isoString.split('.')[0] + 'Z' // Fix nanoseconds issue
    return new Date(validISO).toISOString().split('T')[0]
  } catch (error) {
    console.error('Invalid date format:', isoString)
    return 'Invalid Date' // Fallback for errors
  }
}
export function convertToTimeOnly(isoString: string | number | Date) {
  const date = new Date(isoString)
  return date.toISOString().split('T')[1].split('.')[0] // Extract HH:MM:SS
}
export function convertToEpoch(isoString: string | number | Date) {
  return new Date(isoString).getTime() / 1000
}
export function convertToLocalTime(isoString: string | number | Date) {
  return new Date(isoString).toLocaleString()
}
