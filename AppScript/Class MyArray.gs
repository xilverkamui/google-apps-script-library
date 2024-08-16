class MyArray {
  constructor(elements = []) {
    if (!Array.isArray(elements)) {
      throw new Error('Parameter must be an array');
    }
    this.items = elements;
  }

  getFirstElement() {
    return this.items.length > 0 ? this.items[0] : undefined;
  }

  getLastElement() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : undefined;
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  length() {
    return this.items.length;
  }

  toString() {
    return this.items.join(", ");
  }

  getMinimumDate() {

    function isValidDate(dateStr) {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }

    let minDate = null;

    for (let dateStr of this.items) {
      if (isValidDate(dateStr)) {
        const date = new Date(dateStr);
        if (minDate === null || date < minDate) {
          minDate = date;
        }
      }
    }

    return minDate;
  }

  getMaximumDate() {

    // Fungsi untuk memeriksa apakah sebuah nilai dapat dikonversi menjadi tanggal yang valid
    function isValidDate(dateStr) {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }

    let maxDate = null;

    for (let dateStr of this.items) {
      if (isValidDate(dateStr)) {
        const date = new Date(dateStr);
        if (maxDate === null || date > maxDate) {
          maxDate = date;
        }
      }
    }

    return maxDate;
  }

  /**
   * Checks if an array contains an object with a property that equals a given value.
   * @param {string} property - The property to compare.
   * @param {*} value - The value to compare against.
   * @returns {boolean} True if an object with the property value is found, false otherwise.
   */
  hasPropertyValue(property, value) {
    for (let i = 0; i < this.items.length; i++) {
      if (Array.isArray(this.items[i])) {
        if (arrayHasPropertyValue(this.items[i], property, value)) {
          return true;
        }
      } else if (typeof array[i] === 'object' && this.items[i][property] === value) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sorts an array of objects based on multiple properties with different sort orders.
   *
   * @param {Array} arr - The array to be sorted.
   * @param {Array<Object>} propertyOrders - The properties and their corresponding sort orders. Each object in the array should have a 'property' key for the property name and an 'isAscending' key for the sort order.
   * @throws {Error} Throws an error if the arr parameter is not an array, if the propertyOrders parameter is not an array of objects, or if a property value is undefined.
   * 
   * // Example usage
  const arr = [
    { group: "sailor", title: "eps1", key3: "value3", key4: "value4", key5: "value5" },
    { group: "sailor", title: "eps2", key3: "value3", key4: "value1", key5: "value5" },
    { group: "mnc", title: "eps1", key3: "value3", key4: "value3", key5: "value5" }
  ];
    sortArrayByProperties(arr, [
      { property: 'group', isAscending: true },
      { property: 'key4', isAscending: false }
    ]);
  */
  sortByProperties(propertyOrders) {
    if (!Array.isArray(this.items)) {
      throw new Error("The arr parameter must be an array.");
    }

    if (!Array.isArray(propertyOrders) || !propertyOrders.every(obj => typeof obj === "object" && typeof obj.property === "string" && typeof obj.isAscending === "boolean")) {
      throw new Error("The propertyOrders parameter must be an array of objects with 'property' (string) and 'isAscending' (boolean) keys.");
    }

    this.items.sort(function(a, b) {
      let comparison = 0;

      for (let i = 0; i < propertyOrders.length; i++) {
        const propertyOrder = propertyOrders[i];
        const property = propertyOrder.property;
        const isAscending = propertyOrder.isAscending;
        const valueA = (a[property] || "").toUpperCase();
        const valueB = (b[property] || "").toUpperCase();

        if (valueA < valueB) {
          comparison = isAscending ? -1 : 1;
          break;
        } else if (valueA > valueB) {
          comparison = isAscending ? 1 : -1;
          break;
        } else {
          // If values are equal, continue to the next property
          continue;
        }
      }

      return comparison;
    });
  }

  convertToObject() {
    const obj = this.items.reduce((accumulator, [key, value]) => {
      accumulator[key] = value;
      return accumulator;
    }, {});
    return obj;
  }

}