const formatDate = (date: Date) => {
  let day: number | string = date.getDate();
  let month: number | string = date.getMonth() + 1; // Months are zero-based
  let year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

  // Pad day and month with leading zeros if necessary
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;
  return day + '-' + month + '-' + year;
};
export const getDatesInWeekJumps = (startDate: Date, numberOfWeeks: number) => {
  const dates = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < numberOfWeeks; i++) {
    dates.unshift(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() - 7); // Jump to the next week
  }

  return dates;
};
