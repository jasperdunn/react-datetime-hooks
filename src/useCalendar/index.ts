import { useMemo, useState } from 'react'
import { DATE_GROUP, DAY, DAYS_IN_A_WEEK } from '../constants'
import { dateFormatter } from '../formatter'
import { CalendarExports, CalendarOptions, Cell } from '../interfaces'

export function useCalendar({
  initialDate = new Date(),
  weekStartsOn = DAY.SUNDAY
}: CalendarOptions): CalendarExports {
  const [selectedDate, setSelectedDate] = useState(() =>
    updateTimeToTheStartOfTheDay(initialDate)
  )
  const [firstDayOfTheWeek, setFirstDayOfTheWeek] = useState(weekStartsOn)
  const daysOfTheWeek = useMemo(getDaysOfTheWeek, [firstDayOfTheWeek])

  function getLastDayOfTheWeek(forThePreviousMonth: boolean) {
    if (forThePreviousMonth || firstDayOfTheWeek === DAY.MONDAY) {
      return 6 //tslint:disable-line
    }
    return 0
  }

  function getFirstDayOfTheWeek(forTheNextMonth: boolean) {
    if (forTheNextMonth || firstDayOfTheWeek === DAY.MONDAY) {
      return 0
    }
    return 1
  }

  /**
   * @returns
   * An integer, between 0 and 6, corresponding to the **first** day of the
   * month for the given date, according to local time: 0 for Sunday, 1 for
   * Monday, 2 for Tuesday, and so on.
   */
  function getFirstWeekdayOfMonth(date: Date) {
    let firstDayOfWeekOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay()

    if (firstDayOfTheWeek === DAY.MONDAY) {
      firstDayOfWeekOfMonth -= 1
    }

    if (firstDayOfWeekOfMonth === -1) {
      firstDayOfWeekOfMonth = 6 //tslint:disable-line
    }

    return firstDayOfWeekOfMonth
  }

  /**
   * @returns
   * An integer, between 0 and 6, corresponding to the **last** day of the week
   * for the month for the given date, according to local time: 0 for Sunday, 1
   * for Monday, 2 for Tuesday, and so on.
   */
  function getLastWeekdayOfMonth(date: Date) {
    let lastDayOfWeekOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDay()

    if (firstDayOfTheWeek === DAY.MONDAY) {
      lastDayOfWeekOfMonth -= 1
    }

    if (lastDayOfWeekOfMonth === -1) {
      lastDayOfWeekOfMonth = 6 //tslint:disable-line
    }

    return lastDayOfWeekOfMonth
  }

  /**
   * @returns
   * An integer, between 28 and 31, representing the **last**
   * day of the month for the given date according to local time.
   */
  function getLastDayOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  function getOuterFirstRow(): Cell[] {
    const outerFirstRow: Cell[] = []

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

    for (let a = lastWeekday; a >= 0; a-- , dayOfMonth--) {
      outerFirstRow[a] = {
        date: new Date(
          previousMonth.getFullYear(),
          previousMonth.getMonth(),
          dayOfMonth
        ),
        group: DATE_GROUP.PREVIOUS_MONTH
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
      a++ , firstWeekday++ , dayOfMonth++ // tslint:disable-line
    ) {
      innerFirstRow[a] = {
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          dayOfMonth
        ),
        group: DATE_GROUP.CURRENT_MONTH
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
      (lastDay - (DAYS_IN_A_WEEK - firstWeekday) - (lastWeekday + 1)) / DAYS_IN_A_WEEK

    let dayOfMonth = DAYS_IN_A_WEEK - firstWeekday + 1

    for (let a = 0; a < numberOfRows; a++) {
      const row = []

      for (let b = 0; b < DAYS_IN_A_WEEK; b++ , dayOfMonth++) {
        row.push({
          date: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            dayOfMonth
          ),
          group: DATE_GROUP.CURRENT_MONTH
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

    for (let a = lastWeekday; a >= 0; a-- , dayOfMonth--) {
      innerFirstRow[a] = {
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          dayOfMonth
        ),
        group: DATE_GROUP.CURRENT_MONTH
      }
    }

    return innerFirstRow
  }

  function getOuterLastRow(): Cell[] {
    const outerLastRow: Cell[] = []

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
      a++ , firstWeekday++ , dayOfMonth++ // tslint:disable-line
    ) {
      outerLastRow[a] = {
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          dayOfMonth
        ),
        group: DATE_GROUP.NEXT_MONTH
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
    for (const row of middleRows) {
      rows.push(row)
    }

    rows.push(getLastRow())
    return rows
  }

  function getWeekday(date: Date) {
    const weekday = dateFormatter.formatToParts(new Date(date))
      .find((p) => p.type === 'weekday')

    if (!weekday) {
      throw new Error()
    }

    return weekday.value.replace('.', '')
  }

  function getDaysOfTheWeek() {
    const date = new Date()
    const days = []

    let firstDay = date.getDate() - date.getDay()

    if (firstDayOfTheWeek === DAY.MONDAY) {
      firstDay += 1
    }

    date.setDate(firstDay)
    for (let i = 0; i < DAYS_IN_A_WEEK; i++) {
      const weekday = getWeekday(date)

      days.push(weekday)
      date.setDate(date.getDate() + 1)
    }

    return days
  }

  function updateTimeToTheStartOfTheDay(date: Date) {
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

  // function updateTimeToTheEndOfTheDay(date: Date) {
  //   return new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate(),
  //     23,
  //     59,
  //     59,
  //     999
  //   )
  // }

  function nudgeYear(value: number) {
    setSelectedDate(state =>
      new Date(
        state.getFullYear() + value,
        state.getMonth(),
        // TODO set to last day instead of 28th for all months
        state.getDate() > 28 ? 28 : state.getDate() // tslint:disable-line
      )
    )
  }

  function nudgeMonth(value: number) {
    setSelectedDate(state =>
      new Date(
        state.getFullYear(),
        state.getMonth() + value,
        // TODO set to last day instead of 28th for all months
        state.getDate() > 28 ? 28 : state.getDate() // tslint:disable-line
      )
    )
  }

  return {
    daysOfTheWeek,
    firstDayOfTheWeek,
    getRows,
    nudgeMonth,
    nudgeYear,
    selectedDate,
    setFirstDayOfTheWeek: (day: string) => setFirstDayOfTheWeek(day),
    setSelectedDate: (date: Date) => setSelectedDate(updateTimeToTheStartOfTheDay(date))
  }
}
