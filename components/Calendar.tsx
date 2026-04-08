import { useEffect, useMemo, useState } from 'react';
import HeroImage from './HeroImage';
import NotesSection from './NotesSection';
import DateRangeSelector from './DateRangeSelector';
import useDateRange from '../hooks/useDateRange';
import {
  formatDateToYMD,
  generateCalendarGrid,
  getDayName,
  getMonthName,
  getSeason,
  getWeekDates,
  isDateInRange,
  isSameDay,
} from '../utils/calendarHelpers';
import type { CalendarDay } from '../utils/calendarHelpers';

type ViewMode = 'month' | 'week';

type CalendarCell = CalendarDay;

const Calendar = () => {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [holidays, setHolidays] = useState<Record<string, string>>({});
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [imageTheme, setImageTheme] = useState<string | null>(null);

  const {
    startDate,
    endDate,
    selectedDates,
    setStartDate,
    setEndDate,
    clearSelection,
  } = useDateRange();

  useEffect(() => {
    const sampleHolidays: Record<string, string> = {
      '2024-12-25': 'Christmas',
      '2024-12-31': 'New Year\'s Eve',
      '2024-01-01': 'New Year\'s Day',
      '2024-02-14': 'Valentine\'s Day',
      '2024-10-31': 'Halloween',
    };
    setHolidays(sampleHolidays);
  }, []);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, index) => getMonthName(index, 'long')),
    []
  );
  const season = useMemo(() => getSeason(selectedMonth), [selectedMonth]);

  const years = Array.from({ length: 21 }, (_, i) => selectedYear - 10 + i);

  const changeMonth = (delta: number) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const generateMonthDays = (): CalendarCell[] => {
    return generateCalendarGrid(selectedYear, selectedMonth);
  };

  const generateWeekDays = (): CalendarCell[] => {
    const anchorDate = startDate || new Date(selectedYear, selectedMonth, 1);
    return getWeekDates(anchorDate).map((date) => ({
      date,
      isCurrentMonth: date.getMonth() === selectedMonth,
      isPreviousMonth: false,
      isNextMonth: false,
      dayNumber: date.getDate(),
      fullDate: formatDateToYMD(date),
    }));
  };

  const isSelected = (date: Date) => {
    return selectedDates.some((selected) => isSameDay(selected, date));
  };

  const isStartDate = (date: Date) => {
    return isSameDay(startDate, date);
  };

  const isEndDate = (date: Date) => {
    return isSameDay(endDate, date);
  };

  const handleDateClick = (date: Date) => {
    setActiveDate(date);
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    }
  };

  const calendarDays = useMemo<CalendarCell[]>(() => {
    if (viewMode === 'week') {
      return generateWeekDays();
    }
    return generateMonthDays();
  }, [viewMode, selectedMonth, selectedYear, startDate]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => ({
      label: getDayName(index, 'short'),
      isSunday: index === 0,
    })),
    []
  );
  const today = new Date();

  return (
    <div className="calendar-container" data-season={season} data-theme={imageTheme || undefined}>
      <div className="binding-strip" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} className="binding-ring" />
        ))}
      </div>
      <div className="calendar-main">
        <HeroImage
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onThemeChange={setImageTheme}
        />

        <div className="calendar-content">
          <div className="calendar-header">
            <div className="calendar-controls">
              <button onClick={() => changeMonth(-1)} className="nav-button" type="button">
                {'<'}
              </button>

              <div className="month-year-selector">
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(parseInt(event.target.value, 10))}
                  className="month-select"
                >
                  {months.map((month, idx) => (
                    <option key={month} value={idx}>{month}</option>
                  ))}
                </select>

                <div className="year-selector-container">
                  <button
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className="year-button"
                    type="button"
                  >
                    {selectedYear} {'\u25BC'}
                  </button>

                  {showYearPicker && (
                    <div className="year-picker">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setShowYearPicker(false);
                          }}
                          className={`year-option ${year === selectedYear ? 'active' : ''}`}
                          type="button"
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button onClick={() => changeMonth(1)} className="nav-button" type="button">
                {'>'}
              </button>
            </div>

            <div className="view-controls">
              <button
                onClick={() => setViewMode('month')}
                className={`view-button ${viewMode === 'month' ? 'active' : ''}`}
                type="button"
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`view-button ${viewMode === 'week' ? 'active' : ''}`}
                type="button"
              >
                Week
              </button>
              <button onClick={clearSelection} className="clear-button" type="button">
                Clear Selection
              </button>
            </div>
          </div>

          <div className="weekdays">
            {weekDays.map((day) => (
              <div key={day.label} className={`weekday ${day.isSunday ? 'sunday' : ''}`}>
                {day.label}
              </div>
            ))}
          </div>

          <div
            key={`${selectedYear}-${selectedMonth}-${viewMode}`}
            className={`calendar-grid ${viewMode === 'week' ? 'week-view' : ''}`}
          >
            {calendarDays.map((day, idx) => {
              const dateKey = day.fullDate || formatDateToYMD(day.date);
              const isInRange = isDateInRange(day.date, startDate, endDate);
              const holiday = holidays[dateKey];

              return (
                <div
                  key={`${dateKey}-${idx}`}
                  onClick={() => handleDateClick(day.date)}
                  className={`
                    calendar-day
                    ${!day.isCurrentMonth ? 'other-month' : ''}
                    ${day.date.getDay() === 0 ? 'sunday' : ''}
                    ${isSelected(day.date) ? 'selected' : ''}
                    ${isStartDate(day.date) ? 'start-date' : ''}
                    ${isEndDate(day.date) ? 'end-date' : ''}
                    ${isInRange && !isStartDate(day.date) && !isEndDate(day.date) ? 'in-range' : ''}
                    ${holiday ? 'has-holiday' : ''}
                  `}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleDateClick(day.date);
                    }
                  }}
                >
                  <span className="day-number">{day.dayNumber}</span>
                  {holiday && (
                    <span className="holiday-marker" title={holiday}>
                      *
                    </span>
                  )}
                  {isSameDay(day.date, today) && (
                    <div className="today-marker" />
                  )}
                </div>
              );
            })}
          </div>

          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={clearSelection}
          />
        </div>
      </div>

      <NotesSection
        startDate={startDate}
        endDate={endDate}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        activeDate={activeDate}
      />
    </div>
  );
};

export default Calendar;
