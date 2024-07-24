/**
* Mendapatkan Quarter dari suatu tanggal
* @param {date} tanggal Tanggal yang akan dicari quarternya
* @return string
* @customfunction
*/
function QUARTER(tanggal) {
  return "Q" & ROUNDUP(month(tanggal)/3,0);
}

/**
* Mendapatkan Semester dari suatu tanggal
* @param {date} tanggal Tanggal yang akan dicari semesternya
* @return string
* @customfunction
*/
function SEMESTER(tanggal) {
  return "S" & ROUNDUP(month(tanggal)/6,0);
}


function DOUBLE(input) {
  var result;
  (Array.isArray(input)) ?
      result = input.map(row => row.map(cell => cell * 2)) : result = input * 2;
  return result;
}

function getCurrentTime () {
  const currentTime = new Date();
  const isoFormatTime = Utilities.formatDate(currentTime, "GMT+7", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  return isoFormatTime;
}

