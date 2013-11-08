//api
exports.readFile = readFile;
exports.readFile = readFile;
exports.readFileSync = readFileSync;
exports.mkdir = makeDirectory;
exports.mkdirSync = makeDirectorySync;
exports.readdir = readdir;
exports.readdirSync = readdirSync;
exports.unlink = unlink;
exports.unlinkSync = unlinkSync;
exports.exists = exists;
exports.existsSync = existsSync;
exports.stat = stat;
exports.statSync = statSync;

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

/**
 * Returns an array with the entries of a directory.
 * 
 * @param {String} path       The directory path to check.
 * @param {Function} callback The function to invoke: fn(error, files).
 */
function readdir(path, callback) {
  //(0) arguments
  if (arguments.length == 0) {
    path = ".";
    callback = function() {};
  } else if (arguments.length == 1) {
    if (path instanceof Function) {
      callback = path;
      path = ".";
    }
  }
	
  //(1) read dir
  try {
    callback(null, readdirSync(path));
  } catch (e) {
    callback(e, null);
  }
}

/**
 * Returns an array with the entries of a directory.
 * 
 * @param {String} path The directory path to check.
 * @returns {[]} The entries.
 */
function readdirSync(path) {
  var files = [];
  
  //(0) arguments
  path = path || ".";
  
  //(1) prepare path
  path = path.replace("\\", "/");
  
  if (!path.endsWith("/")) {
    path = path + "/";
  }
  
  //(2) get entries
  for (var i = 0, ee = ls(path); i < ee.length; ++i) {
    var f = ee[i];
    
    f = f.replace(path, "");
    
    if (f.endsWith("/")) {
      f = f.substr(0, f.length-1);
    }
    
    files.push(f);
  }
  
  //(3) return entries
  return files;
}

/**
 * Returns if a path exists.
 * 
 * @param {String} path       The path to check.
 * @param {Function} callback The function to invoke: fn(exists).
 */
function exists(path, callback) {
  callback = callback || function() {};
  callback(existsSync(path));
}

/**
 * Returns if a path exists.
 * 
 * @param {String} path The path to check.
 * @returns {Boolean} If the path exists.
 */
function existsSync(path) {
  var s = stat(path);
  return s.isDirectory() || s.isFile();
}

/**
 * Removes a file.
 * 
 * @param path     The file path to remove.
 * @param callback The function to invoke: fn(error).
 */
function unlink(path, callback) {
  callback = callback || function() {};
	
  try {
    unlinkSync(path);
    callback(null);
  } catch (e) {
    callback(e);
  }
}

/**
 * Removes a file.
 * 
 * @param path The file path to remove.
 */
function unlinkSync(path) {
  var s = stat(path);
  
  if (s.isFile()) {
    removeFile(path);
  }
}

/**
 * A Stats object.
 */
function Stats(path) {
  Object.defineProperty(this, "path", {
    enumerable: false,
    writable: false,
    value: path
  });
	
  Object.defineProperty(this, "entry", {
    enumerable: false,
    writable: false,
    value: getSplitPath(path)
  });
}

/**
 * Returns if the entry is a directory.
 */
Stats.prototype.isDirectory = function isDirectory() {
  try {
    ls(this.path);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Returns if the entry is a file.
 */
Stats.prototype.isFile = function isFile() {
  try {
    var pc = this.entry;
	    
    for (var i = 0, ee = listFiles(pc.parent); i < ee.length; ++i) {
      var f = ee[i];
	      
      if (getSplitPath(f.name).child == pc.child && !f.isDirectory) {
        return true;
      }
    }
  } catch (e) {
    //pass
  }
  
  return false;
};

/**
 * Returns a Stats.
 * 
 * @param {String} path       The path to check.
 * @param {Function} callback The function to invoke: fn(error, stats).
 */
function stat(path, callback) {
  callback = callback || function() {};
  
  try {
    callback(null, statSync(path));
  } catch (e) {
    callback(e, null);
  }
}

/**
 * Returns a Stats object.
 * 
 * @param path The path to check.
 * @returns {Stats} The Stats object.
 */
function statSync(path) {
  return new Stats(path);
}

//////////
// help //
//////////
function getSplitPath(path) {
  var parent, child;
  var slashPos;

  //(1) prepare path
  path = path.replace("\\", "/");
	
  //(2) get parent
  slashPos = path.lastIndexOf("/");
  
  if (slashPos < 0) {
	parent = ".";
	child = path;
  } else if (slashPos == 0) {
    parent = "/";
    child = path.substr(1);
  } else {
    parent = path.substr(0, slashPos);
    child = path.substr(slashPos+1);
  }
  
  //(3) return parent
  return {parent: parent, child: child};
}