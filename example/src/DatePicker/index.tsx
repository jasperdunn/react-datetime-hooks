import { ChangeEvent, Dispatch, Fragment, SetStateAction } from 'react';
import { Cell, constants, useCalendar } from '@jasperdunn/react-datetime-hooks';
import './styles.scss';

type DatePickerProps = {
  value: Date;
  onChange: Dispatch<SetStateAction<Date>>;
};
export function DatePicker({ value, onChange }: DatePickerProps): JSX.Element {
  const {
    firstDayOfTheWeek,
    setFirstDayOfTheWeek,
    daysOfTheWeek,
    getRows,
    selectedDate,
    setSelectedDate,
    nudgeYear,
    nudgeMonth,
    updateTimeToTheStartOfTheDay,
  } = useCalendar({
    weekStartsOn: constants.DAY.MONDAY,
    selectedDate: value,
    setSelectedDate: onChange,
  });

  function getTitle(): string {
    return selectedDate.toLocaleDateString('default', {
      month: 'long',
      year: 'numeric',
    });
  }

  function decreaseYear(): void {
    nudgeYear(-1);
  }

  function decreaseMonth(): void {
    nudgeMonth(-1);
  }

  function setSelectedDateToToday(): void {
    setSelectedDate(updateTimeToTheStartOfTheDay(new Date()));
    onChange(updateTimeToTheStartOfTheDay(new Date()));
  }

  function increaseMonth(): void {
    nudgeMonth(1);
  }

  function increaseYear(): void {
    nudgeYear(1);
  }

  function setSelectedDateToCell(date: Date) {
    return () => {
      setSelectedDate(date);
      onChange(date);
    };
  }

  function setWeekStartDate(event: ChangeEvent<HTMLInputElement>): void {
    setFirstDayOfTheWeek(
      event.target.checked ? constants.DAY.MONDAY : constants.DAY.SUNDAY
    );
  }

  function renderDaysOfTheWeek(): JSX.Element[] {
    return daysOfTheWeek.map((day: string) => (
      <li key={day} className="date-picker__day-of-the-week">
        {day}
      </li>
    ));
  }

  function renderDateGrid(): JSX.Element[] {
    return getRows().map((row: Cell[], index: number) => (
      <Fragment key={index}>
        {row.map((cell: Cell) => (
          <li
            key={cell.date.getTime()}
            className={`date-picker__date date-picker__date--${cell.group}${
              cell.date.getTime() === selectedDate.getTime()
                ? ' date-picker__date--selected'
                : ''
            }`}
            onClick={setSelectedDateToCell(cell.date)}
          >
            {cell.date.getDate()}
          </li>
        ))}
      </Fragment>
    ));
  }

  return (
    <>
      <div className="date-picker">
        <h1>{getTitle()}</h1>
        <div className="button-group">
          <button className="button" type="button" onClick={decreaseYear}>
            &lt;&lt;
          </button>
          <button className="button" type="button" onClick={decreaseMonth}>
            &lt;
          </button>
          <button
            className="button"
            type="button"
            onClick={setSelectedDateToToday}
          >
            Today
          </button>
          <button className="button" type="button" onClick={increaseMonth}>
            &gt;
          </button>
          <button className="button" type="button" onClick={increaseYear}>
            &gt;&gt;
          </button>
        </div>
        <ul className="date-picker__grid">
          {renderDaysOfTheWeek()}
          {renderDateGrid()}
        </ul>
      </div>
      <br />
      <br />
      <input
        name="weekStartsOnMonday"
        type="checkbox"
        checked={firstDayOfTheWeek === constants.DAY.MONDAY}
        onChange={setWeekStartDate}
      />
      <label>Week starts on Monday</label>
    </>
  );
}
