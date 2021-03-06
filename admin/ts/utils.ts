// Utilities

/**
 * Returns an index value from the given array
 * @param arr {T[]} Any type of array
 * @returns {T} Random index value from the given array
 */
export const getRandomValueFromArray = <T>(arr: T[]) => arr[~~(Math.random() * arr.length)];

/**
 * Returns a random number between the two given parameters
 * @param min {number}
 * @param max {number}
 * @returns {number} Random number between min and max
 */
export const randomValueBetween = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Returns random date between two other dates
 * @returns {string} Random date
 */
export const randomDate = (date1: string | number, date2: string | number) => {
  var date1 = date1 || '01-01-1970';
  var date2 = date2 || new Date().toLocaleDateString();
  
  date1 = new Date(date1).getTime();
  date2 = new Date(date2).getTime();
  
  return date1 > date2 ?
    new Date(randomValueBetween(date2, date1)).toLocaleDateString() :
    new Date(randomValueBetween(date1, date2)).toLocaleDateString();
};

/**
 * Removes extension from filename or URL
 * @param fullName {string} Filename or URL
 * @param extensions {string[]} List of extensions that must be removed
 * @returns {string} Initial string without specified extension(s)
 */
export const removeFileExtension = (fullName: string, extensions: string | string[]) => {
  // Remover
  const removeExtension = (e: string) => {
    const endsWith = fullName.endsWith(e);

    if (endsWith) {
      const i = fullName.indexOf(e);
      fullName = fullName.substring(0, i);
    }
    return endsWith;
  }
  
  // Remove extension if it exists on fullName
  if (Array.isArray(extensions)) {
    for (const e of extensions) {
      const removed = removeExtension(e);
      if (removed) break;
    }
  } else removeExtension(extensions);

  // Return fullName after checking and removing the extension
  return fullName;
};

/**
 * Returns the given string without special chars
 * @param str {string} Initial string
 * @returns {string} The given string without special chars
 */
export const removeSpecialChars = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Basic cookie handler for setting and reading cookies
 */
export class Cookies {

  /**
   * Allows to set a cookie
   * @param cname {string} Cookie name
   * @param cvalue {string} Cookie value
   * @param exdays {string} Cookie duration in days
   */
  public static set(cname: string, cvalue: string, exdays: number) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  /**
   * Returns cookie value
   * @param cname {string} Cookie name
   * @returns {string} Value for the given cookie name
   */
  public static get(cname: string) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

}