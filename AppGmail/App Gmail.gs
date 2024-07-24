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

function getEmailLinks(labelName = "inbox", params = {moveToArchive:true, excludeUnsubscribe:false, moveToTrash:false}) {
  let query = "is:inbox label:" + labelName;   // Mendapatkan semua email dengan label "ptr" dan masih berada di inbox
  let threads = GmailApp.search(query,0,20); 
  let links = []; // Membuat array untuk menyimpan semua link yang ditemukan
  Logger.log(params);
  
  for (let i = 0; i < threads.length; i++) {
    let messages = threads[i].getMessages(); // Mendapatkan semua pesan dalam satu thread
    
    for (let j = 0; j < messages.length; j++) {
      let body = messages[j].getPlainBody(); // Mendapatkan isi email dalam format teks biasa
      
      // Mencari link dalam body email menggunakan ekspresi reguler
      let urls;
      if (params.excludeUnsubscribe)
        urls = body.match(/https?:\/\/(?!.*unsubscribe)\S+(?<!unsubscribe)/gi);
      else
        urls = body.match(/https?:\/\/\S+/gi);      
      
      // Menambahkan link yang ditemukan ke dalam array
      if (urls) {
        for (let k = 0; k < urls.length; k++) {      
          // Menambahkan langkah untuk mengunjungi halaman URL yang ditemukan
          Logger.log("Subject: %s", threads[i].getFirstMessageSubject());
          Logger.log("URL: %s", urls[k]);
          links.push(urls[k]);
          //let statusCode = response.getResponseCode();
        }
      }
      
      // Arsipkan email setelah semua tindakan selesai dilakukan
      if (params.moveToArchive)  threads[i].moveToArchive();
      if (params.moveToTrash) threads[i].moveToTrash();
    }
  }
  return links;
}