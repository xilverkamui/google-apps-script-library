class MyGanttChart {
  constructor(dataSheetName, chartSheetName, options) {
    this.dataSheetName = dataSheetName;
    this.options = options
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    //Prepare data sheet
    this.dataSheet = this.spreadsheet.getSheetByName(dataSheetName);
    this.dataValidation();

    //Prepare chart sheet
    this.chartSheetName = chartSheetName;
    let ganttSheet = this.spreadsheet.getSheetByName(chartSheetName);
    if (!ganttSheet) ganttSheet = this.spreadsheet.insertSheet(chartSheetName);
    ganttSheet.clear().setFrozenColumns(2);
    ganttSheet.setRowHeights(1,2,options.CHART_COLUMN_WIDTH);
    this.sheet = ganttSheet;
  }

  dataValidation() {
    const dataRange = this.dataSheet.getDataRange();
    const data = dataRange.getValues();
    const taskIdData = data.map(row => row[this.options.TASK_ID_COLUMN]);
    const taskData = data.map(row => row[this.options.TASK_NAME_COLUMN]);
    const startData = data.map(row => row[this.options.START_TASK_COLUMN]);
    const endData = data.map(row => row[this.options.END_TASK_COLUMN]);
    //this.data = taskData.map((task, index) => {
    //  return [task, startData[index], endData[index]];
    //});
    this.data = taskIdData.map((_, i) => [taskIdData[i], taskData[i], startData[i], endData[i]]);
    Logger.log(this.data[1]);

    // Konversi string tanggal ke objek Date dan kemudian ke timestamp
    this.startDate = getMinimumDateFromArray(startData);
    this.endDate = getMaximumDateFromArray(endData);
    Logger.log("Start Date: %s, End Date: %s", this.startDate, this.endDate);

  }

  createHeader() {
    let titleRange = this.sheet.getRange("A1:A2");
    titleRange.merge().setBackground(this.options.HEADER_COLOR);
    titleRange.setValue("Id").setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold");
    this.sheet.setColumnWidth(1,50);
    titleRange = this.sheet.getRange("B1:B2");
    titleRange.merge().setBackground(this.options.HEADER_COLOR);
    titleRange.setValue("Task Name").setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold");
    this.sheet.setColumnWidth(2,250);

    let currentColumn = 3;

    // Fill the header with dates
    let bomColumn = currentColumn, switchColor=1;
    for (let date = new Date(this.startDate); date <= this.endDate; date.setDate(date.getDate() + 1)) { 
      const isStartDate = (formatDateToYYYYMMDD(date) == formatDateToYYYYMMDD(this.startDate));
      const isEndDate = (formatDateToYYYYMMDD(date) == formatDateToYYYYMMDD(this.endDate));

      //Set month value
      if (isStartDate || date.getDate() == 1) {
        this.sheet.getRange(1,currentColumn).setValue(new Date(date));
      }

      //Set holidays
      const isHoliday = (date.getDay() === 0 || date.getDay() === 6);
      if (isHoliday) this.sheet.getRange(2,currentColumn,this.sheet.getMaxRows(),1).setBackground(this.options.HOLIDAY_COLOR);

      //Format month header
      if (isEndDate || date.getDate() == 1) {
        if (isStartDate == false) {

          Logger.log("Merge on %s", date);
          
          let columnsNumber = (isEndDate ? currentColumn-bomColumn+1 : currentColumn-bomColumn);
          Logger.log("currentColumn: %d, bomColumn: %d, columnNumber: %d", currentColumn, bomColumn, columnsNumber);
          const headerMonthRange = this.sheet.getRange(1,bomColumn,1,columnsNumber);
          headerMonthRange.merge().setFontColor(this.options.HEADER_MONTH_FONT_COLOR).setFontWeight("bold");
          headerMonthRange.setNumberFormat("yyyy mmmm").setHorizontalAlignment("center").setVerticalAlignment("middle");        
          (switchColor%2 == 0) ? headerMonthRange.setBackground(this.options.HEADER_MONTH_COLOR_1) : 
          headerMonthRange.setBackground(this.options.HEADER_MONTH_COLOR_2);

          const headerDateRange = this.sheet.getRange(2,bomColumn,1,columnsNumber);
          headerDateRange.setFontColor(this.options.HEADER_DATE_FONT_COLOR).setFontWeight("bold");
          headerDateRange.setNumberFormat("dd").setHorizontalAlignment("center").setVerticalAlignment("middle");

          Logger.log("IsHoliday: %s, switch:%s",isHoliday, switchColor%2);
          (switchColor%2 == 0) ? headerDateRange.setBackground(this.options.HEADER_DATE_COLOR_1) : headerDateRange.setBackground(this.options.HEADER_DATE_COLOR_2);
          bomColumn = currentColumn;
        }
        switchColor++;
      }      
      //Logger.log("Curr:%s, date: %s",currentColumn,date);
      this.sheet.getRange(2, currentColumn).setValue(new Date(date));
      this.sheet.setColumnWidth(currentColumn,this.options.CHART_COLUMN_WIDTH);
      currentColumn++;
    }

  }

  createTasks() {
    Logger.log("Data length: %d",this.data.length);
    for (let i = 1; i < this.data.length; i++) {
      const taskId = this.data[i][0];
      const taskName  = this.data[i][1];
      const taskStart = new Date(this.data[i][2]);
      const taskEnd   = new Date(this.data[i][3]);
      Logger.log("TaskName: %s", taskName);

      this.sheet.getRange(i + 2, 1).setValue(taskId);
      this.sheet.getRange(i + 2, 2).setValue(taskName);

      for (let date = new Date(taskStart); date <= taskEnd; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === 0 || date.getDay() === 6) continue;   //Skip holidays
        const column = Math.ceil((date - this.startDate) / (1000 * 60 * 60 * 24)) + 3;
        this.sheet.getRange(i + 2, column).setBackground(this.options.CHART_COLOR);
        //let dayOfWeek = date.getDay();
        //if (dayOfWeek === 0 || dayOfWeek === 6) ganttSheet.getRange(i + 2, column).setBackground(options.HOLIDAY_COLOR);
      }
    }
  }

  // Method untuk membuat Gantt Chart
  createGanttChart() {
    this.createHeader();
    this.createTasks();
  }
}
