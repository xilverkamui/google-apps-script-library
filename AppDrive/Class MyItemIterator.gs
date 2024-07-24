var MyItemIterator = (function() {

  function MyItemIterator(items = [], debug=true) {
    if (!Array.isArray(items) || !items.every(item => item instanceof MyItem)) {
      throw new Error('Parameter items must be instance array of MyItem.');
    }

    //Sort items, where isFolder=true is placed backward
    //this.items = items.sort((a, b) => a.isFolder - b.isFolder);
    this.itemsOriginal = items;
    this.items = items;
    this.debug = debug;
    this.currentIndex = 0;
  }

  MyItemIterator.prototype.length = function() {
    return this.items.length;
  };

  MyItemIterator.prototype.hasNext = function() {
    return this.currentIndex < this.items.length;
  };

  MyItemIterator.prototype.next = function() {
    if (!this.hasNext()) {
      throw new Error('There is no more item.');
    }
    //return this.items[this.currentIndex++];
    return this.items.splice(this.currentIndex++, 1)[0];
  };

  MyItemIterator.prototype.reset = function() {
    this.items = this.itemsOriginal;
    this.currentIndex = 0;
  };

   /**
   * Filters items based on a specified property and value.
   * @param {string} property - The property to filter items by.
   * @param {*} value - The value that the property should match.
   * @returns {Array} An array of filtered items.
   */
  MyItemIterator.prototype.getFilteredItems = function(property, value) {
    return this.items.filter(item => item[property] === value);
  };

  MyItemIterator.prototype.getFiles = function() {
    //return this.items.filter(item => !item.isFolder);
    return this.getFilteredItems("isFolder", false);
  };

  MyItemIterator.prototype.getFolders = function() {
    //return this.items.filter(item => item.isFolder);
    return this.getFilteredItems("isFolder", true);
  };

  MyItemIterator.prototype.getNextIndex = function() {
    return this.currentIndex;
  };

  /**
   * Converts items to a 2-dimensional array with specified properties.
   * @param {Array} properties - Properties to include in the 2-dimensional array.
   * @returns {Array} 2-dimensional array with specified properties.
   * Example: iterator.join(['id', 'name']);
   */
  MyItemIterator.prototype.join = function(properties) {
    return this.items.map(item => {
      return properties.map(prop => item[prop]);
    });
  };  

  /**
   * Converts files (isFolder=false) to a 2-dimensional array with specified properties.
   * @param {Array} properties - Properties to include in the 2-dimensional array.
   * @returns {Array} 2-dimensional array with specified properties for files.
   */
  MyItemIterator.prototype.joinFiles = function(properties) {
    const files = this.items.filter(item => !item.isFolder);
    return files.map(file => {
      return properties.map(prop => file[prop]);
    });
  };

  return MyItemIterator;
  
})();