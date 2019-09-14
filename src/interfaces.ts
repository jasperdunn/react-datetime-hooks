export interface Cell {
    date: Date,
    group: string
}

export interface CalendarOptions {
    /** default is todays date */
    initialDate?: Date,
    /** default is Sunday */
    weekStartsOn?: string
}

export interface CalendarExports {
    daysOfTheWeek: string[],
    firstDayOfTheWeek: string,
    setFirstDayOfTheWeek: (day: string) => void,
    getRows: () => Cell[][],
    selectedDate: Date,
    setSelectedDate: (date: Date) => void,
    nudgeYear: (value: number) => void,
    nudgeMonth: (value: number) => void
}
