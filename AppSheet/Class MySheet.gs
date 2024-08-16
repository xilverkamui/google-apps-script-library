var MySheet = (function () {
  class MySheet {
    constructor(spreadsheet, sheetName) {
      if (!isValidSpreadsheet(spreadsheet))
        throw new Error('Parameter "spreadsheet" must be an instance of Spreadsheet');      
      this.spreadsheet = spreadsheet;
      this.spreadsheetId = this.spreadsheet.getId();
      this.spreadsheetName = this.spreadsheet.getName();

      sheet = this.spreadsheet.getSheetByName(sheetName);
      if (!isValidSheet(sheet)) throw new Error(`Invalid sheet name '${sheetName}'`);
      this.sheet  = sheet;
      this.id = this.sheet.getSheetId();  
      this.index = this.sheet.getIndex();
      this.name = this.sheet.getName();

      this.debug = true;
      Logger.log("Initializing sheet %s ...", this.name);
    }

    setDebug(status = true) { this.debug = status; }
    getSpreadsheet() { return this.spreadsheet; }
    getSheet() { return this.sheet; }
    getName() { return this.name; }
    getMaxRows() { return this.sheet.getMaxRows(); }
    getLastRow() { return this.sheet.getLastRow(); }
    getLastColumn() { return this.sheet.getLastColumn(); }    

    toString() {
      return {
         spreadsheetId: this.spreadsheetId, spreadsheetName: this.spreadsheetName
        ,sheetId: this.sheet.getId(), sheetName: this.sheet.getName(), sheetIndex: this.sheet.getIndex()
      };
    }

    clearSheet(exceptHeader = false) {
      if (exceptHeader) {
        this.sheet.getRange(2, 1, this.sheet.getMaxRows() - 1, this.sheet.getMaxColumns()).clearContent();
      } else {
        this.sheet.clear();
      }
      if (this.debug)
        Logger.log("Clearing sheet complete ...");
    }

    /**
    * Auto-add blank rows to a sheet if necessary.
    * @param {Sheet} mySheet - The Sheet object to add blank rows to.
    * @param {number|Array} increament - The number of rows to add or an array to determine the increment.
    */
    autoAddBlankRows(increament = 50) {
      if (this.debug)
        Logger.log("Executing autoAddBlankRows .....");
      if (increament < 50)
        increament = 50;

      if (this.sheet.getLastRow() + increament > this.sheet.getMaxRows - 5) {
        this.sheet.insertRowsAfter(this.sheet.getLastRow(), increament + 5);
        if (this.debug)
          Logger.log("%d rows added.", increament + 5);
      }
      if (this.debug)
        Logger.log("Executing autoAddBlankRows complete.");
    }

    duplicate(targetSheetName = "", targetSheetIndex = -1) {
      let targetSpreadsheet = this.spreadsheet;

      if (targetSheetName === "") targetSheetName = "Copy of " + this.name;
      let checkTargetSheet = targetSpreadsheet.getSheetByName(targetSheetName);
      if (checkTargetSheet !== null) {
        targetSheetName = targetSheetName + " (1)";
        Logger.log("targetSheetName %s already exists. Changing name to %s (1) ...", targetSheetName, targetSheetName);
      }

      let targetMaxIndex = targetSpreadsheet.getNumSheets() - 1;
      if (targetSheetIndex === -1)  targetSheetIndex = this.index + 1;
      if (targetSheetIndex > targetMaxIndex)  targetSheetIndex = targetMaxIndex;

      const newSheet = this.sheet.copyTo(targetSpreadsheet);
      newSheet.setName(targetSheetName);

      targetSpreadsheet.setActiveSheet(newSheet);
      targetSpreadsheet.moveActiveSheet(targetSheetIndex);
      targetSpreadsheet.setActiveSheet(this.sheet);
      if (this.debug)
        Logger.log("Duplicating sheet %s to %s completed", this.name, targetSheetName);
      return newSheet;
    }
    /**
    * Sets an extended property on the class instance.
    * @param {string} key - The property name.
    * @param {*} value - The property value.
    */
    setProperty(key, value) { this[key] = value; }
    getLastNonEmptyRow() {
      const lastRow = this.sheet.getLastRow();
      const data = this.sheet.getRange(1, 1, lastRow, this.sheet.getLastColumn()).getValues();

      for (let row = lastRow - 1; row >= 0; row--) {
        if (data[row].some(cell => cell !== '')) {
          return row + 1;
        }
      }
      return 0; // Jika semua baris kosong, kembalikan 0
    }

    /**
    * Returns all properties of the class instance
    * @returns {Object} An object containing all properties of the instance.
    */
    getProperties() {
      return Object.keys(this).reduce((properties, key) => {
        if (key !== 'sheet' && key !== 'spreadsheet') {
          properties[key] = this[key];
        }
        return properties;
      }, {});
    }
    /**
    * Append data array to a sheet.
    * @param {Array} newData - The data array to be appended.
    */
    appendData(newData) {
      if (this.debug)
        Logger.log("Executing appendData ...");

      if (!Array.isArray(newData)) {
        throw new Error("newData parameter must be an array.");
      }

      let lastNonEmptyRow = this.getLastNonEmptyRow();
      if (this.debug) {
        Logger.log("Last NonEmpty Row: %s", lastNonEmptyRow);
        Logger.log("newData: %d row(s)", newData.length);
      }

      if (this.getMaxRows() < lastNonEmptyRow + newData.length + 5)
        this.autoAddBlankRows(newData.length);

      this.sheet.getRange(lastNonEmptyRow + 1, 1, newData.length, newData[0].length).setValues(newData);
      if (this.debug)
        Logger.log("Executing appendData completes.");
    }
    appendRow(newData) {
      return this.appendData([newData]);
    }

    /**
     * Set data array to a sheet, overwriting existing data.
     * @param {Sheet} mySheet - The Sheet object to set the data to.
     * @param {Array} newData - The data array to be set.
     */
    setData(newData) {
      if (this.debug) Logger.log("Executing setData ...");
      if (!Array.isArray(newData)) throw new Error("newData parameter must be an array.");

      this.sheet.clearContents();
      this.autoAddBlankRows(newData.length);
      this.sheet.setValues(array);
      if (this.debug) Logger.log("Array written to sheet: " + sheet.getName());
    }
  }

  return MySheet;
})();

