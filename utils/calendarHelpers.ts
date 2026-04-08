export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
  dayNumber: number;
  fullDate: string;
};

export type MonthYear = {
  month: number;
  year: number;
  monthName: string;
  yearNumber: number;
};

export type DateRange = {
  start: Date;
  end: Date;
  days: Date[];
  count: number;
  includes: (date: Date) => boolean;
  overlaps: (otherRange: { start: Date; end: Date }) => boolean;
};

/**
 * Get the number of days in a specific month
 * @param {number} year - The year (e.g., 2024)
 * @param {number} month - The month (0-11, where 0 is January)
 * @returns {number} Number of days in the month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get the first day of the month (0 = Sunday, 6 = Saturday)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} Day index (0-6)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * Get the last day of the month (0 = Sunday, 6 = Saturday)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} Day index (0-6)
 */
export const getLastDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDay();
};

/**
 * Check if a year is a leap year
 * @param {number} year - The year to check
 * @returns {boolean} True if leap year
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Get month name
 * @param {number} month - Month index (0-11)
 * @param {string} format - 'long' (January) or 'short' (Jan)
 * @returns {string} Month name
 */
export const getMonthName = (month: number, format: 'long' | 'short' = 'long'): string => {
  const months = {
    long: ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  return months[format][month];
};

/**
 * Get day name
 * @param {number} day - Day index (0-6)
 * @param {string} format - 'long' (Sunday) or 'short' (Sun)
 * @returns {string} Day name
 */
export const getDayName = (day: number, format: 'long' | 'short' = 'short'): string => {
  const days = {
    long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  };
  return days[format][day];
};

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateToYMD = (date: Date | null): string => {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Parse YYYY-MM-DD string to Date object
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} Date object
 */
export const parseYMDToDate = (dateString: string | null): Date | null => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
};

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Check if a date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if a date is in the future
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

/**
 * Get all dates in a range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array<Date>} Array of dates between start and end (inclusive)
 */
export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Calculate number of days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of days between (inclusive)
 */
export const getDaysDifference = (startDate: Date | null, endDate: Date | null): number => {
  if (!startDate || !endDate) return 0;
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Add days to a date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtract days from a date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to subtract
 * @returns {Date} New date
 */
export const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

/**
 * Get the week number of a date (1-53)
 * @param {Date} date - Date object
 * @returns {number} Week number
 */
export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

/**
 * Get the quarter of the year (1-4)
 * @param {Date} date - Date object
 * @returns {number} Quarter number
 */
export const getQuarter = (date: Date): number => {
  return Math.floor(date.getMonth() / 3) + 1;
};

/**
 * Generate calendar grid for a month (including previous/next month days)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {Array<Object>} Calendar days with metadata
 */
export const generateCalendarGrid = (year: number, month: number): CalendarDay[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: CalendarDay[] = [];

  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i -= 1) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    days.push({
      date,
      isCurrentMonth: false,
      isPreviousMonth: true,
      isNextMonth: false,
      dayNumber: prevMonthDays - i,
      fullDate: formatDateToYMD(date),
    });
  }

  for (let i = 1; i <= daysInMonth; i += 1) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      isPreviousMonth: false,
      isNextMonth: false,
      dayNumber: i,
      fullDate: formatDateToYMD(date),
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i += 1) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      isPreviousMonth: false,
      isNextMonth: true,
      dayNumber: i,
      fullDate: formatDateToYMD(date),
    });
  }

  return days;
};

/**
 * Check if a date is within a range (inclusive)
 * @param {Date} date - Date to check
 * @param {Date} start - Range start
 * @param {Date} end - Range end
 * @returns {boolean} True if date is in range
 */
export const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  return date >= start && date <= end;
};

/**
 * Get relative time string (e.g., "2 days ago", "next week")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time description
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  if (diffDays >= 7 && diffDays < 14) return 'Next week';
  if (diffDays <= -7 && diffDays > -14) return 'Last week';
  if (diffDays >= 14 && diffDays < 30) return 'In a few weeks';
  if (diffDays <= -14 && diffDays > -30) return 'A few weeks ago';

  return formatDateToYMD(date);
};

/**
 * Get season based on month
 * @param {number} month - Month (0-11)
 * @returns {string} Season name
 */
export const getSeason = (month: number): string => {
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
};

/**
 * Sort dates array in ascending order
 * @param {Array<Date>} dates - Array of dates
 * @returns {Array<Date>} Sorted dates
 */
export const sortDates = (dates: Date[]): Date[] => {
  return [...dates].sort((a, b) => a.getTime() - b.getTime());
};

/**
 * Get unique dates from array (remove duplicates)
 * @param {Array<Date>} dates - Array of dates
 * @returns {Array<Date>} Unique dates
 */
export const getUniqueDates = (dates: Date[]): Date[] => {
  const uniqueMap = new Map<string, Date>();
  dates.forEach((date) => {
    const key = formatDateToYMD(date);
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, date);
    }
  });
  return Array.from(uniqueMap.values());
};

/**
 * Check if a date is a weekend (Saturday or Sunday)
 * @param {Date} date - Date to check
 * @returns {boolean} True if weekend
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Check if a date is a weekday (Monday to Friday)
 * @param {Date} date - Date to check
 * @returns {boolean} True if weekday
 */
export const isWeekday = (date: Date): boolean => {
  return !isWeekend(date);
};

/**
 * Get the start of the week (Sunday)
 * @param {Date} date - Reference date
 * @returns {Date} Start of week date
 */
export const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  return start;
};

/**
 * Get the end of the week (Saturday)
 * @param {Date} date - Reference date
 * @returns {Date} End of week date
 */
export const getEndOfWeek = (date: Date): Date => {
  const end = new Date(date);
  const day = end.getDay();
  end.setDate(end.getDate() + (6 - day));
  return end;
};

/**
 * Get all dates for a specific week
 * @param {Date} date - Any date in the week
 * @returns {Array<Date>} Array of 7 dates for the week
 */
export const getWeekDates = (date: Date): Date[] => {
  const start = getStartOfWeek(date);
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i += 1) {
    weekDates.push(addDays(start, i));
  }
  return weekDates;
};

/**
 * Compare two dates (ignoring time)
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDates = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};

/**
 * Get month and year from date
 * @param {Date} date - Date object
 * @returns {Object} Object with month and year
 */
export const getMonthYear = (date: Date): MonthYear => {
  return {
    month: date.getMonth(),
    year: date.getFullYear(),
    monthName: getMonthName(date.getMonth()),
    yearNumber: date.getFullYear(),
  };
};

/**
 * Create a date range object
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Object} Date range object with utility methods
 */
export const createDateRange = (start: Date, end: Date): DateRange => {
  return {
    start,
    end,
    days: getDatesInRange(start, end),
    count: getDaysDifference(start, end),
    includes: (date: Date) => isDateInRange(date, start, end),
    overlaps: (otherRange) => {
      return !(otherRange.end < start || otherRange.start > end);
    },
  };
};

/**
 * Format date for display with various options
 * @param {Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}): string => {
  const defaults: Intl.DateTimeFormatOptions = {
    weekday: undefined,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formatOptions = { ...defaults, ...options };
  return date.toLocaleDateString(undefined, formatOptions);
};

export default {
  getDaysInMonth,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  isLeapYear,
  getMonthName,
  getDayName,
  formatDateToYMD,
  parseYMDToDate,
  isSameDay,
  isToday,
  isPastDate,
  isFutureDate,
  getDatesInRange,
  getDaysDifference,
  addDays,
  subtractDays,
  getWeekNumber,
  getQuarter,
  generateCalendarGrid,
  isDateInRange,
  getRelativeTimeString,
  getSeason,
  sortDates,
  getUniqueDates,
  isWeekend,
  isWeekday,
  getStartOfWeek,
  getEndOfWeek,
  getWeekDates,
  compareDates,
  getMonthYear,
  createDateRange,
  formatDate,
};
