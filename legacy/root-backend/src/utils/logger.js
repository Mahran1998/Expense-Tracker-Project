function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

module.exports = { log };

