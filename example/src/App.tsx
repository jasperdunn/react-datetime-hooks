import React, { useState } from 'react'
import DatePicker from './DatePicker'
import './styles.scss'

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="container">
      <DatePicker initialDate={selectedDate} onChange={setSelectedDate} />
      <p>Selected date: {selectedDate.toLocaleString()}</p>
      <button onClick={() => setSelectedDate(new Date(2000, 0, 1))}>Set to 2000-01-01</button>
    </div>
  )
}
