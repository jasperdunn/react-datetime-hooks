export interface Cell {
    date: Date,
    group: string
}

export interface CalendarOptions {
    /** default is todays date */
    selectedDate?: Date,
    /** default is Sunday */
    weekStartsOn?: string,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
}

export interface CalendarExports {
    daysOfTheWeek: string[],
    firstDayOfTheWeek: string,
    setFirstDayOfTheWeek: React.Dispatch<React.SetStateAction<string>>,
    getRows: () => Cell[][],
    selectedDate: Date,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>,
    nudgeYear: (value: number) => void,
    nudgeMonth: (value: number) => void
}
