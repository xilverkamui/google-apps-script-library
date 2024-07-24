/**
 * Gets the root drive (My Drive or Shared Drive) of a file or folder in Google Drive based on the provided itemId.
 * @param {string} itemId - The ID of the file or folder in Google Drive.
 * @returns {Object|null} - Returns an object containing id and name properties of the root drive if found, or null if the root drive is not found.
 */
function getDrive(itemId = "") {
  if (itemId == "") itemId = "root";
  let file = Drive.Files.get(itemId);
  if (file) {
    result.id = file.driveId;
    return {
      id:file.driveId,
      name:(file.driveId == "root" ? "My Drive" : Drive.Drives.get(file.driveId).name)
    };
  } else {
    return null;
  }
}

/**
 * List all drives in Google Drive.
 * @returns {Object|null} - Returns an object containing id and name properties of the drive.
 */
function getDriveList() {
  let sharedDrives = Drive.Drives.list().items;

  /**
   * Maps the shared drives to an array of objects containing ID and name.
   * Adds the "My Drive" entry at the beginning of the result array.
   * @param {object} drive - A shared drive object.
   * @returns {object} An object with ID and name properties.
   */
  let result = sharedDrives.map(drive => ({ id: drive.id, name: drive.name }));
  result.unshift({ id: "root", name: "My Drive" });  
  if (verbose_) Logger.log(result);  

  return result;
}


function listSearchFiles() {
  //let query = '"root" in parents and trashed = false and mimeType = "application/vnd.google-apps.folder"';
  let driveId = drivesId.DD1;
  let query = 'mimeType contains "video" and title contains "sakura"';

  let files, pageToken;
  let paramFinal = {
    corpora: "drive",
    driveId: driveId,
    includeItemsFromAllDrives: true,
    q: query,
    supportsAllDrives: true,
    maxResults: 100,
    pageToken: pageToken
  };

  files = Drive.Files.list(paramFinal);
  let hasil = [];
  Logger.log(files.items[0]);
  for (let i = 0; i < files.items.length; i++) {
    let file = files.items[i];
    Logger.log('%s (ID: %s)', file.title, file.id);
    //AppDrive.getFileParentFolders(file.id);
  }
}

