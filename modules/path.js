//api
exports.dirname = dirname;
exports.basename = basename;
exports.extname = extname;
exports.sep = sep;
exports.delimiter = delimiter;

/**
 * Returns the parent directory of a path.
 *  
 * @param {String} path The path to check.
 * @returns {String} The parent directory.
 */
function dirname(path) {
  return getSplitPath(path).parent;
}

/**
 * Returns the file/directory name.
 * 
 * @param {String} path The path to check.
 * @returns {String} The file/dir name.
 */
function basename(path) {
  return getSplitPath(path).child;
}

/**
 * Returns the file extension.
 * 
 * @param path The file path to check.
 */
function extname(path) {
  var ext = path.substr(path.lastIndexOf("."));
  if (ext.indexOf("/") >= 0 || ext.indexOf("\\") >= 0) {
    return "";
  } else {
    return ext;
  }
}

/**
 * Returns the file separator.
 */
function sep() {
  return (_isWindows() ? "\\" : "/");
}

/**
 * Returns the path delimiter.
 */
function delimiter() {
  return (_isWindows() ? ";" : ":");
}

//////////
// help //
//////////
const getSplitPath = require("fs").stat.getSplitPath;