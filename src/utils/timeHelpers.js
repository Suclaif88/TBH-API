// utils/timeHelpers.js
function parseTimeToDate(fecha, hora) {
  // fecha: '2025-09-05', hora: '09:30' or '09:30:00'
  const [hh, mm, ss = '00'] = hora.split(':');
  return new Date(`${fecha}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss)}.000`);
}

function formatDateToTimeStr(date) {
  const hh = String(date.getHours()).padStart(2,'0');
  const mm = String(date.getMinutes()).padStart(2,'0');
  const ss = String(date.getSeconds()).padStart(2,'0');
  return `${hh}:${mm}:${ss}`; // MySQL TIME compatible
}

function addMinutes(fecha, hora, minutesToAdd) {
  const d = parseTimeToDate(fecha, hora);
  d.setMinutes(d.getMinutes() + Number(minutesToAdd));
  return formatDateToTimeStr(d);
}

module.exports = { addMinutes, parseTimeToDate, formatDateToTimeStr };
