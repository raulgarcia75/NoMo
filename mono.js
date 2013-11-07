/**
 * Imports a JavaScript module.
 * 
 * @param path The module path.
 */
function require(path) {
  //Returns if the path is a directory.
  function isDirectory(path) {
    try {
      listFiles(path);
      return true;
    } catch (e) {
      return false;
    }
  }	

  //Returns the module id from its path.
  function getModuleId(path) {
    return path;
  }
  
  //Returns the file path
  function getFilePath(path) {
    var BASEDIR = "./../modules";
    var filePath = BASEDIR;
    
    //(1) get file path
    for (var i = 0, pathItems = path.split("/"); i < pathItems.length; ++i) {
      filePath += "/" + pathItems[i];
    }
    
    if (isDirectory(filePath)) {
      filePath += "/index.js";
    } else {
      filePath += ".js";
    }

    //(2) return
    return filePath;
  }

  //A module object.
  function Module(id) {
    this.id = id;
  }
  
  //Loads API into a module object.
  function loadModuleApi(mod, api) {
    for (var p in api) {
      mod[p] = api[p];
    }
  }
  
  var cache;
  var mod;
  var id = getModuleId(path);
  var exports = {};
  
  //(1) get module
  if (require._cache === undefined) {
    Object.defineProperty(require, "_cache", {
      enumerable: false,
      writable: false,
      value: {}
    });
  }
  
  cache = require._cache;
  mod = cache[id];
  
  if (mod === undefined) {
    var file = getFilePath(path);
    var con = cat(file);
    mod = new Module(id);
    eval("(function() { " + con + " })()");
    loadModuleApi(mod, exports);
    cache[id] = mod;
  }
  
  //(2) return
  return mod;
}

/////////////
// process //
/////////////
process.exit = function exit(code) {
  quit(code);
};

process.cwd = function cwd() {
  return pwd();
};

process.chdir = function chdir(path) {
  cd(path);
};

/////////////
// console //
/////////////
var console = {};

console.log = function log() {
  var txt = "";
  
  for (var i in arguments) {
    txt += (txt ? " " : "") + arguments[i];
  }
  
  print(txt);
};