const dateConverter = (date) => {
    const originalDate = new Date(date)
    
    const year = originalDate.getFullYear()
    const month = originalDate.getMonth() + 1
    const day = originalDate.getDate()
  
    return `${day.toString().length > 1 ? day : `0${day}`}-${month.toString().length > 1 ? `${month}` : `0${month}`}-${year}`
}

export default dateConverter
  