//api
exports.readFile = readFile;
exports.readFile = readFile;
exports.readFileSync = readFileSync;
exports.mkdir = makeDirectory;
exports.mkdirSync = makeDirectorySync;

/**
 * Gets the content of a file.
 * 
 * @param {String} filename   The file path.
 * @param {Function} callback Function to call: fn(error, data).
 */
function readFile(filename, callback) {
  try {
    callback(null, cat(filename));
  } catch (e) {
    callback(e, null);
  }
}

/**
 * Returns the content of a file.
 * 
 * @param {String} filename The file path.
 * @returns {String} The content.
 */
function readFileSync(filename) {
  return cat(filename);
}

/**
 * Makes a directory.
 * 
 * @param {String} path       The directory path to create.
 * @param {Function} callback The function to call: fn(error).
 */
function makeDirectory(path) {
  mkdir(path);
}

/**
 * Makes a directory.
 * 
 * @param {String} path The directory path to create.
 */
function makeDirectorySync(path) {
  mkdir(path);
}