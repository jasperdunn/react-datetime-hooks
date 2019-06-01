import React from 'react'
import { useCalendar, constants } from '@jasperdunn/react-datetime-hooks'
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

  return (
    <>
      <div className="date-picker">
        <h1>
          {selectedDate.toLocaleDateString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </h1>
        <div className="button-group">
          <button className="button" type="button" onClick={() => setYear(-1)}>
            &lt;&lt;
          </button>
          <button className="button" type="button" onClick={() => setMonth(-1)}>
            &lt;
          </button>
          <button
            className="button"
            type="button"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </button>
          <button className="button" type="button" onClick={() => setMonth(1)}>
            &gt;
          </button>
          <button className="button" type="button" onClick={() => setYear(1)}>
            &gt;&gt;
          </button>
        </div>
        <ul className="date-picker__grid">
          {daysOfTheWeek.map(day => (
            <li key={day} className="date-picker__day-of-the-week">
              {day}
            </li>
          ))}
          {getRows().map((row, index) => (
            <React.Fragment key={index}>
              {row.map(cell => (
                <li
                  key={cell.date.getTime()}
                  className={`date-picker__date date-picker__date--${
                    cell.group
                  }${
                    cell.date.getTime() === selectedDate.getTime()
                      ? ' date-picker__date--selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedDate(cell.date)
                  }}
                >
                  {cell.date.getDate()}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
      <br />
      <br />
      <input
        name="weekStartsOnMonday"
        type="checkbox"
        checked={firstDayOfTheWeek === constants.DAY.MONDAY}
        onChange={event =>
          setFirstDayOfTheWeek(
            event.target.checked ? constants.DAY.MONDAY : constants.DAY.SUNDAY
          )
        }
      />
      <label>Week starts on Monday</label>
    </>
  )
}
