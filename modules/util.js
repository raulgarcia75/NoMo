//api
exports.inherits = inherits;
exports.print = print;
exports.format = format;
exports.puts = puts;

/**
 * Sets the parent class of a class.
 * 
 * @param {Function} child  The subclass.
 * @param {Function} parent The parent class.
 */
function inherits(child, parent) {
  child.super_ = parent;
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

/**
 * Formats a string.
 * Place holders: %s, a string; %d, a number; %j, a JSON object; and
 * %%, a symbol %.
 * 
 * @param {String} format The format string.
 * @param args            The arguments.
 * 
 * @returns {String} The formated string.
 */
function format() {
  function replace(str, old, nw) {
    var p = str.indexOf(old);
    return str.substr(0, p) + nw + str.substr(p + old.length);
  }
	
  var txt = arguments[0];
  var re = /%[sdj%]{1}/g;
  var pp;
  
  //(1) get placeholders used
  pp = txt.match(re);
  
  //(2) format
  for (var i = 0, j = 1; i < pp.length; ++i) {
    var ph = pp[i];
    
    switch (ph) {
      case "%s": txt = replace(txt, "%s", String(arguments[j++])); break;
      case "%d": txt = replace(txt, "%d", Number(arguments[j++])); break;
      case "%j": txt = replace(txt, "%j", JSON.stringify(arguments[j++])); break;
      case "%%": txt = replace(txt, "%%", "%"); break;
      default: throw Error("Internal error: unknown placeholder: " + ph);
    }
  }
  
  //(3) return
  return txt;
}

/**
 * Prints each argument with a new line at the end.
 */
function puts() {
  for (var i = 0; i < arguments.length; ++i) {
    print(arguments[i]);
  }
}