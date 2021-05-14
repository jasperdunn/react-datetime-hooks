import { Dispatch, SetStateAction } from 'react';

export type Cell = {
  date: Date;
  group: string;
};

export type CalendarOptions = {
  /** default is todays date */
  selectedDate?: Date;
  /** default is Sunday */
  weekStartsOn?: string;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
};

export type CalendarExports = {
  daysOfTheWeek: string[];
  firstDayOfTheWeek: string;
  setFirstDayOfTheWeek: (day: string) => void;
  getRows: () => Cell[][];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  nudgeYear: (value: number) => void;
  nudgeMonth: (value: number) => void;
  updateTimeToTheStartOfTheDay: (date: Date) => Date;
};
