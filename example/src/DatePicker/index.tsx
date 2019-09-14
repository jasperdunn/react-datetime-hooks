import React, { ChangeEvent } from 'react'
import { Cell, constants, useCalendar } from 'react-datetime-hooks'
import './styles.scss'

export default function DatePicker() {
  const {
    firstDayOfTheWeek,
    setFirstDayOfTheWeek,
    daysOfTheWeek,
    getRows,
    selectedDate,
    setSelectedDate,
    setYear,
    setMonth
  } = useCalendar({
    initialDate: new Date('2019-01-01'),
    weekStartsOn: constants.DAY.MONDAY
  })

  function getTitle() {
    return selectedDate.toLocaleDateString('default', {
      month: 'long',
      year: 'numeric'
    })
  }

  function decreaseYear() {
    setYear(-1)
  }

  function decreaseMonth() {
    setYear(-1)
  }

  function setSelectedDateToToday() {
    setSelectedDate(new Date())
  }

  function increaseYear() {
    setYear(1)
  }

  function increaseMonth() {
    setMonth(1)
  }

  function setSelectedDateToCell(date: Date) {
    return () => setSelectedDate(date)
  }

  function setWeekStartDate(event: ChangeEvent<HTMLInputElement>) {
    setFirstDayOfTheWeek(
      event.target.checked ? constants.DAY.MONDAY : constants.DAY.SUNDAY
    )
  }

  function renderDaysOfTheWeek() {
    return daysOfTheWeek.map((day: string) => (
      <li key={day} className="date-picker__day-of-the-week">
        {day}
      </li>
    ))
  }

  function renderDateGrid() {
    return getRows().map((row: Cell[], index: number) => (
      <React.Fragment key={index}>
        {row.map((cell: Cell) => (
          <li
            key={cell.date.getTime()}
            className={`date-picker__date date-picker__date--${
              cell.group
              }${
              cell.date.getTime() === selectedDate.getTime()
                ? ' date-picker__date--selected'
                : ''
              }`}
            onClick={setSelectedDateToCell(cell.date)}
          >
            {cell.date.getDate()}
          </li>
        ))}
      </React.Fragment>
    ))
  }

  return (
    <>
      <div className="date-picker">
        <h1>
          {getTitle()}
        </h1>
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
  )
}
