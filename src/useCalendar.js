import { useState, useMemo } from 'react'
import { DAYS_IN_A_WEEK, DAY, GROUP } from './constants'
import { dateFormatter } from './formatter'

/**
 * @typedef Options
 * @property {Date} initialDate - optional, default is set to todays date
 * @property {String} weekStartsOn - optional, default is set to Sunday
 *
 * @param {Options} options
 */
export default function useCalendar({
  initialDate = new Date(),
  weekStartsOn = DAY.SUNDAY
}) {
  const [selectedDate, setSelectedDate] = useState(() =>
    setTimeToTheStartOfTheDay(initialDate)
  )
  const [firstDayOfTheWeek, setFirstDayOfTheWeek] = useState(weekStartsOn)

  /**
   * @param {Boolean} forPreviousMonth
   */
  function getLastDayOfTheWeek(forPreviousMonth) {
    if (forPreviousMonth || firstDayOfTheWeek === DAY.MONDAY) {
      return 6
    }
    return 0
  }

  /**
   * @param {Boolean} forNextMonth
   */
  function getFirstDayOfTheWeek(forNextMonth) {
    if (forNextMonth || firstDayOfTheWeek === DAY.MONDAY) {
      return 0
    }
    return 1
  }

  /**
   * @param {Date} date
   * @returns
   * An integer, between 0 and 6, corresponding to the **first** day of the
   * month for the given date, according to local time: 0 for Sunday, 1 for
   * Monday, 2 for Tuesday, and so on.
   */
  function getFirstWeekdayOfMonth(date) {
    let firstDayOfWeekOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay()

    if (firstDayOfTheWeek === DAY.MONDAY) {
      firstDayOfWeekOfMonth -= 1
    }

    if (firstDayOfWeekOfMonth === -1) {
      firstDayOfWeekOfMonth = 6
    }

    return firstDayOfWeekOfMonth
  }

  /**
   * @param {Date} date
   * @returns
   * An integer, between 0 and 6, corresponding to the **last** day of the week
   * for the month for the given date, according to local time: 0 for Sunday, 1
   * for Monday, 2 for Tuesday, and so on.
   */
  function getLastWeekdayOfMonth(date) {
    let lastDayOfWeekOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDay()

    if (firstDayOfTheWeek === DAY.MONDAY) {
      lastDayOfWeekOfMonth -= 1
    }

    if (lastDayOfWeekOfMonth === -1) {
      lastDayOfWeekOfMonth = 6
    }

    return lastDayOfWeekOfMonth
  }

  /**
   * @param {Date} date
   * @returns
   * An integer, between 28 and 31, representing the **last**
   * day of the month for the given date according to local time.
   */
  function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  function getOuterFirstRow() {
    const outerFirstRow = []

    const previousMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1,
      1
    )

    const lastWeekday = getLastWeekdayOfMonth(previousMonth)

    if (lastWeekday === getLastDayOfTheWeek(true)) {
      return outerFirstRow
    }

    let dayOfMonth = getLastDayOfMonth(previousMonth)

    for (let a = lastWeekday; a >= 0; a--, dayOfMonth--) {
      outerFirstRow[a] = {
        date: new Date(
          previousMonth.getFullYear(),
          previousMonth.getMonth(),
          dayOfMonth
        ),
        group: GROUP.PREVIOUS_MONTH
      }
    }

    return outerFirstRow
  }

  function getInnerFirstRow() {
    const innerFirstRow = []

    let dayOfMonth = 1
    let firstWeekday = getFirstWeekdayOfMonth(selectedDate)

    for (
      let a = 0;
      firstWeekday < DAYS_IN_A_WEEK;
      a++, firstWeekday++, dayOfMonth++
    ) {
      innerFirstRow[a] = {
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          dayOfMonth
        ),
        group: GROUP.CURRENT_MONTH
      }
    }

    return innerFirstRow
  }

  function getFirstRow() {
    const outerFirstRow = getOuterFirstRow()
    const innerFirstRow = getInnerFirstRow()

    const firstRow = outerFirstRow.concat(innerFirstRow)

    return firstRow
  }

  function getMiddleRows() {
    const middleRows = []

    const firstWeekday = getFirstWeekdayOfMonth(selectedDate)

    const lastDay = getLastDayOfMonth(selectedDate)
    const lastWeekday = getLastWeekdayOfMonth(selectedDate)

    const numberOfRows =
      (lastDay - (DAYS_IN_A_WEEK - firstWeekday) - (lastWeekday + 1)) / 7

    let dayOfMonth = DAYS_IN_A_WEEK - firstWeekday + 1

    for (let a = 0; a < numberOfRows; a++) {
      const row = []

      for (let b = 0; b < DAYS_IN_A_WEEK; b++, dayOfMonth++) {
        row.push({
          date: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            dayOfMonth
          ),
          group: GROUP.CURRENT_MONTH
        })
      }

      middleRows.push(row)
    }

    return middleRows
  }

  function getInnerLastRow() {
    const innerFirstRow = []

    const lastWeekday = getLastWeekdayOfMonth(selectedDate)
    let dayOfMonth = getLastDayOfMonth(selectedDate)

    for (let a = lastWeekday; a >= 0; a--, dayOfMonth--) {
      innerFirstRow[a] = {
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          dayOfMonth
        ),
        group: GROUP.CURRENT_MONTH
      }
    }

    return innerFirstRow
  }

  function getOuterLastRow() {
    const outerLastRow = []

    let firstWeekday = getFirstWeekdayOfMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    )

    if (firstWeekday === getFirstDayOfTheWeek(true)) {
      return outerLastRow
    }

    let dayOfMonth = 1

    for (
      let a = 0;
      firstWeekday < DAYS_IN_A_WEEK;
      a++, firstWeekday++, dayOfMonth++
    ) {
      outerLastRow[a] = {
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          dayOfMonth
        ),
        group: GROUP.NEXT_MONTH
      }
    }

    return outerLastRow
  }

  function getLastRow() {
    const outerLastRow = getOuterLastRow()
    const innerLastRow = getInnerLastRow()

    const lastRow = innerLastRow.concat(outerLastRow)

    return lastRow
  }

  /**
   * @typedef DateCell
   * @property {Date} date
   * @property {String} group
   *
   * @returns {DateCell[][]} rows where each row is an array of DateCells
   */
  function getRows() {
    const rows = []
    rows.push(getFirstRow())

    const middleRows = getMiddleRows()
    for (let a = 0; a < middleRows.length; a++) {
      const row = middleRows[a]
      rows.push(row)
    }

    rows.push(getLastRow())
    return rows
  }

  function getDaysOfTheWeek() {
    const date = new Date()
    const daysOfTheWeek = []

    let firstDay = date.getDate() - date.getDay()

    if (firstDayOfTheWeek === DAY.MONDAY) {
      firstDay += 1
    }

    date.setDate(firstDay)
    for (var i = 0; i < 7; i++) {
      const weekday = dateFormatter
        .formatToParts(new Date(date))
        .find(p => p.type === 'weekday')
        .value.replace('.', '')

      daysOfTheWeek.push(weekday)
      date.setDate(date.getDate() + 1)
    }

    return daysOfTheWeek
  }

  function setTimeToTheStartOfTheDay(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    )
  }

  function setTimeToTheEndOfTheDay(date) {
    if (date instanceof Date) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
      )
    }

    return null
  }

  function setYear(value) {
    setSelectedDate(
      new Date(
        selectedDate.getFullYear() + value,
        selectedDate.getMonth(),
        selectedDate.getDate() > 28 ? 28 : selectedDate.getDate() //TODO set to last day
      )
    )
  }

  function setMonth(value) {
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + value,
        selectedDate.getDate() > 28 ? 28 : selectedDate.getDate() //TODO set to last day
      )
    )
  }

  return {
    daysOfTheWeek: useMemo(getDaysOfTheWeek, [firstDayOfTheWeek]),
    firstDayOfTheWeek,
    setFirstDayOfTheWeek: day => setFirstDayOfTheWeek(day),
    getRows,
    selectedDate,
    setSelectedDate: date => setSelectedDate(setTimeToTheStartOfTheDay(date)),
    setYear,
    setMonth
  }
}
