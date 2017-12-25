var path = require('path');

function getPathByCWD() {
  return path.join(process.cwd(), ...arguments)
}

export {getPathByCWD};