/**
* Mendapatkan pembulatan ke atas dari suatu angka
* @param {number} number Angka yang akan dicari pembulatannya
* @param {number} rounding Pembulatan. Default 1.
* @return number Hasil pembulatan ke atas
* @customfunction
*/
function ceiling(number = 1, rounding = 1) {
  if (typeof number !== 'number' || typeof rounding !== 'number') {
    throw new Error('Invalid input: "number" and "rounding" must be of type number.');
  }

  let result = 0;
  rounding = Math.abs(rounding);
  result = Math.ceil(number/rounding) * rounding;
  return result;
}

/**
 * Rounds down a number to the nearest multiple.
 * @param {number} number The number to be rounded down.
 * @param {number} rounding The rounding value for which the number should be rounded down.
 * @returns {number} The result of rounding down the number to the nearest multiple of the specified rounding value.
 */
function floor(number = 1, rounding = 1) {
  // Validasi tipe data parameter
  if (typeof number !== 'number' || typeof rounding !== 'number') {
    throw new Error('Invalid input: "number" and "rounding" must be of type number.');
  }

  let result = 0;
  rounding = Math.abs(rounding);
  result = Math.floor(number / rounding) * rounding;
  return result;
}


/**
* Mendapatkan pembulatan dari suatu angka
* @param {number} number Angka yang akan dicari pembulatannya
* @param {number} rounding Pembulatan. Default 1.
* @return number Hasil pembulatan
* @customfunction
*/
function rounding(number = 1, rounding = 1) {
  if (typeof number !== 'number' || typeof rounding !== 'number') {
    throw new Error('Invalid input: "number" and "rounding" must be of type number.');
  }

  let result = 0;
  rounding = Math.abs(rounding);
  result = Math.round(number/rounding) * rounding;
  return result;
}