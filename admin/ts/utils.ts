// Utilities

/**
 * Returns an index from the given array
 * @param arr {any[]} Any type of array
 */
export const getRandomValueFromArray = (arr: any[]) => arr[~~(Math.random() * arr.length)];

/**
 * Returns random date between two
 */
export const getRandomDate = () => {
  const randomDate = (date1: string | number, date2: string | number) => {
    const randomValueBetween = (min: number, max: number) => Math.random() * (max - min) + min;
    
    var date1 = date1 || '01-01-1970';
    var date2 = date2 || new Date().toLocaleDateString();
  
    date1 = new Date(date1).getTime();
    date2 = new Date(date2).getTime();
  
    return date1 > date2 ?
      new Date(randomValueBetween(date2, date1)).toLocaleDateString() :
      new Date(randomValueBetween(date1, date2)).toLocaleDateString();
  };

  return randomDate('06/25/2020', '08/16/2020');
};

/**
 * Removes extension from filename or URL
 * @param fullName {string} Filename or URL
 * @param extensions {string[]} List of extensions that must be removed
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