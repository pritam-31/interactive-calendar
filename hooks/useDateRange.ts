import { useMemo, useState } from 'react';
import { getDatesInRange } from '../utils/calendarHelpers';

type DateRangeState = {
  startDate: Date | null;
  endDate: Date | null;
  selectedDates: Date[];
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  clearSelection: () => void;
};

const useDateRange = (): DateRangeState => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const selectedDates = useMemo<Date[]>(() => {
    if (startDate && endDate) {
      return getDatesInRange(startDate, endDate);
    }
    if (startDate) {
      return [startDate];
    }
    return [];
  }, [startDate, endDate]);

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return {
    startDate,
    endDate,
    selectedDates,
    setStartDate,
    setEndDate,
    clearSelection,
  };
};

export default useDateRange;
