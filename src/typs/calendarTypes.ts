//
// Type Imports
import type { ThemeColor } from '@core/types'

export type CalendarFiltersType = 'Personal' | 'Business' | 'Family' | 'Holiday' | 'ETC'

export type CalendarColors = {
  ETC: ThemeColor
  Family: ThemeColor
  Holiday: ThemeColor
  Personal: ThemeColor
  Business: ThemeColor
}

export type CalendarType = {
  events: any[]
  filteredEvents: any[]
  selectedEvent: null | any
  selectedCalendars: CalendarFiltersType[]
}

export type AddEventSidebarType = {
  calendarStore: CalendarType
  calendarApi: any
  dispatch: any
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
}
