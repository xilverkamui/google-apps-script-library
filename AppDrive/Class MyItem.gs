/**
 * Represents a file or folder in Google Drive.
 */
var MyItem = (function() {

  /**
   * Creates an instance of MyItem.
   * @param {string} id - The ID of the file or folder.
   * @param {boolean} [debug=true] - Flag to enable or disable debug logging.
   */
  class MyItem {
    constructor(id,debug=true) {
      this.id=id;
      this.debug=debug;
      let item=Drive.Files.get(id,{ supportsAllDrives: true });
      if(!item)
      return null; //itemId not found
      this.item=item;
      this.MIME_TYPES=MIME_TYPES;

      this.name=item.title;
      this.mimeType=item.mimeType;
      this.isFolder=(item.mimeType===this.MIME_TYPES.folder[0]);
      this.size=(item.fileSize)? item.fileSize:0;
      this.driveId=item.driveId||"root";
      this.driveName=Drive.Drives.get(item.driveId).name||"My Drive";
    }
    /**
    * Returns the item information.
    * @returns {Object} The item information.
    */
    getItem() { return this.item; }

    valueOf() {
      return Object.keys(this).reduce((properties,key) => {
        if(key!=='item'&&key!=='MIME_TYPES') {
        properties[key]=this[key];
        }
        return properties;
      },{});
    }

    toString() { return this.valueOf(); }

    /**
    * Sets an extended property on the MyItem instance.
    * @param {string} key - The property name.
    * @param {*} value - The property value.
    */
    setExtendedProperty(key,value) { this[key]=value; }

    _getFolderById(folderId="") {
      // Validate folderId parameter
      if(typeof folderId!=='string'||folderId=="") {
        throw new Error('Invalid folderId parameter: folderId must be a string.');
      }

      // Get the folder by folderId
      let folder=DriveApp.getFolderById(folderId);

      // Check if folder is found
      if(!folder)
      throw new Error('Folder with ID %s not found.',folderId);

      return folder;
    }

    /**
    * Moves the item to the specified target folder.
    * @param {string} targetFolderId - The ID of the target folder.
    * @returns {GoogleAppsScript.Drive.File|GoogleAppsScript.Drive.Folder} The moved file or folder.
    * @throws {Error} If the target folder is not found.
    */
    moveTo(targetFolderId) {
      let targetFolder=DriveApp.getFolderById(targetFolderId);
      if(!folder) throw new Error('Folder not found.'); 
      let targetFolderName=targetFolder.getName();

      if(this.debug) Logger.log("Moving from %s to folder %s",this.name,targetFolderName);

      let result;
      if(this.isFolder) result=DriveApp.getFolderById(this.id).moveTo(targetFolder);
      else result=DriveApp.getFileById(this.id).moveTo(targetFolder);

      if(this.debug) Logger.log("Moving process complete");

      return result;
    }
    /**
    * Sets the path property for the item, from the item to the root folder.
    */
    setPathProperty() {
      let pathIds=[];
      let pathNames=[];
      let currentItem=this.item;
      //let level=0;

      while(currentItem) {
        pathIds.push(currentItem.id);
        pathNames.push(currentItem.title);

        if(currentItem.parents && currentItem.parents.length>0) {
          currentItem=Drive.Files.get(currentItem.parents[0].id,{ supportsAllDrives: true });
          //level++;
        } else {
         currentItem=null;
        }
      }

      this.path={
        id: pathIds.reverse(),
        name: pathNames.reverse(),
        //level: level,
        fullpath: "/"+pathNames.slice(1).join('/')
      };

      if(this.path.id.length>1) {
        this.parent={
          id: this.path.id[this.path.id.length-2],
          name: this.path.name[this.path.name.length-2]
        };
        if(this.parent.id==this.driveId)
          this.parent.name=this.driveName;
      }
      if(this.debug)  Logger.log("Path property has set");
    }

    setTarget() {
      if(this.item.shortcutDetails) {
        let targetId=this.item.shortcutDetails.targetId;
        let targetItem=Drive.Files.get(targetId,{ supportsAllDrives: true });
        this.target={
        id: targetItem.id,
        name: targetItem.title,
        mimeType: targetItem.mimeType
        };
      }
    }

    /**
    * Creates a shortcut for the item in the specified target folder.
    * @param {string} targetFolderId - The ID of the target folder where the shortcut will be created.
    * @returns {Object} The created shortcut item.
    * @throws {Error} If the target folder is not found or the item cannot be accessed.
    */
    createShortcut(targetFolderId) {
      try {
        // Validate target folder
        //let targetFolder = this._getFolderById(targetFolderId);
        // Define shortcut metadata
        let shortcutMetadata={
        mimeType: this.MIME_TYPES.shortcut[0],
        shortcutDetails: { targetId: this.id },
        title: this.name+' Shortcut',
        parents: [{ id: folderId }]
        };

        // Create the shortcut
        let shortcut=Drive.Files.insert(shortcutMetadata);
        if(this.debug)
        Logger.log("Shortcut created with ID: %s",shortcut.id);

        return shortcut;
      } catch(e) {
        throw new Error('Failed to create shortcut: '+e.message);
      }
    }

    /**
    * Lists the sub-items / subfolder (files and folders) under the current folder.
    * @returns {Array<Object>} An array of objects representing the sub-items with properties id, name, and isFolder.
    */
    getSubItems() {
      if(!this.isFolder)
      return [];

      let subItems=[];
      let folder=this._getFolderById(this.id);
      let files=folder.getFiles();
      let folders=folder.getFolders();

      while(files.hasNext()) {
        let file=files.next();
        subItems.push(new MyItem(file.getId(),false));
      }

      while(folders.hasNext()) {
        let subFolder=folders.next();
        subItems.push(new MyItem(subFolder.getId(),false));
      }

      return subItems;
    }
  }
  return MyItem;
})();