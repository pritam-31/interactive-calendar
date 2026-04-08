import { ChangeEvent } from 'react';
import { formatDateToYMD, getDaysDifference, parseYMDToDate } from '../utils/calendarHelpers';

type DateRangeSelectorProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onClear: () => void;
};

const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: DateRangeSelectorProps) => {
  const parseDateInput = (value: string): Date | null => {
    return parseYMDToDate(value);
  };

  const formatDateForInput = (date: Date | null): string => {
    return formatDateToYMD(date);
  };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = parseDateInput(event.target.value);
    onStartDateChange(newDate);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = parseDateInput(event.target.value);
    onEndDateChange(newDate);
  };

  const daysCount = startDate && endDate ? getDaysDifference(startDate, endDate) : null;

  return (
    <div className="date-range-selector">
      <div className="selector-title">
        <h4>Date Range Selection</h4>
        {daysCount && (
          <span className="days-count">{daysCount} day{daysCount !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="selector-inputs">
        <div className="input-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            className="date-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            className="date-input"
            min={formatDateForInput(startDate)}
          />
        </div>

        <button onClick={onClear} className="clear-selection-button" type="button">
          Clear
        </button>
      </div>

      {startDate && !endDate && (
        <div className="selector-hint">
          Click on another date to complete the range
        </div>
      )}

      {startDate && endDate && (
        <div className="range-preview">
          <div className="range-info">
            <strong>Selected Range:</strong> {startDate.toDateString()} - {endDate.toDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
