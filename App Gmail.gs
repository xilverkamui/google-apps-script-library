/**
 * Archives email threads in Gmail based on specified criteria.
 *
 * @param {string} labelName - The name of the label to search for.
 * @param {number} numDays - The number of days before which the email threads should be older.
 */
function autoArchiveHelper(labelName, numDays) {
  /**
   * Example usage:
   * autoArchiveHelper('MyLabel', 30);
   * This will archive email threads that have the label 'MyLabel' and are older than 30 days.
   */
  
  Logger.log('Running archiver for %s numDays: %s',labelName, numDays);
  let query = 'is:inbox -is:important label:{{LABEL_NAME}} older_than:{{NUMDAYS}}d';
  query = query.replace('{{LABEL_NAME}}',labelName).replace('{{NUMDAYS}}',numDays);
  Logger.log(query);

  let threads = GmailApp.search(query,0,500);
  
  Logger.log('Found %s emails threads.', threads.length);
  let batch_size = 100;
  while (threads.length) {
    let this_batch_size = Math.min(threads.length, batch_size);
    let this_batch = threads.splice(0, this_batch_size);
    GmailApp.moveThreadsToArchive(this_batch);
  }
}
