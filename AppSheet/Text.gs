function TRANSLATE(text, sourceLanguage = "id", targetLanguage = "en") {
  const result = LanguageApp.translate(text, sourceLanguage, targetLanguage);
  return result;
}

/**
 * Translates an array of text using Google Translate.
 *
 * @param {string} inputRange - The range of cells containing the text to be translated.
 * @param {string} [sourceLang="auto"] - The language of the source text. Defaults to automatic detection.
 * @param {string} [targetLang="en"] - The language to translate the text into. Defaults to English ("en").
 * @returns {Array<Array<string>>} - An array containing the translated text.
 * @custumfunction
 *
 * @example
 * // Translates text in the range A2:A10 from automatic detection to Indonesian ("id").
 * const translatedArray = TRANSLATE_ARRAY("A2:A10", "id", "en");
 */
function TRANSLATE_ARRAY(inputRange, sourceLang, targetLang) {
  const values = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(inputRange).getValues();
  console.log("Sheet Name: %s",SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName());
  const translatedValues = [];
  const lastIndex = getLastNonEmptyIndex  (values);
  console.log("Last index: %d", lastIndex);
  const valuesCleansed = values.slice(0, lastIndex+1);

  for (let i = 0; i < valuesCleansed.length; i++) {
    const translatedText = TRANSLATE(valuesCleansed[i][0], sourceLang, targetLang);
    translatedValues.push([translatedText]);
  }

  return translatedValues;
}

