
/**
 * Counts the number of cells with a specific background color within a given range.
 * @param {Range} countRange The range of cells to count.
 * @param {Range} colorRef The reference cell containing the color to count.
 * @returns {number} The count of cells with the specified background color.
 */
function countByColor(countRange, colorRef) {
  /**
   * @type {string[][]} backgrounds - Array containing the backgrounds of cells in the countRange.
   */
  const backgrounds = countRange.getBackgrounds();

  /**
   * @type {string} background - The background color to match.
   */
  const background = colorRef.getBackground();
  
  /**
   * @type {number} countCells - The count of cells matching the background color.
   */
  const countCells = backgrounds.flat().filter(cellColor => cellColor === background).length;

  return countCells;
}

/**
 * Sums the values of cells with a specific background color within a given range.
 * @param {Range} sumRange The range of cells to sum their values.
 * @param {Range} colorRef The reference cell containing the color to match.
 * @returns {number} The sum of values in cells with the specified background color.
 */
function sumByColor(sumRange, colorRef) {
  /**
   * @type {string[][]} backgrounds - Array containing the backgrounds of cells in the sumRange.
   */
  const backgrounds = sumRange.getBackgrounds();

  /**
   * @type {string} background - The background color to match.
   */
  const background = colorRef.getBackground();

  /**
   * @type {number[]} cellValues - Array containing values of cells matching the background color.
   */
  const cellValues = sumRange.getValues().flat().filter((_, index) => backgrounds.flat()[index] === background);

  /**
   * @type {number} sum - The sum of values in cells with the specified background color.
   */
  const sum = cellValues.reduce((acc, val) => acc + Number(val), 0);

  return sum;
}
