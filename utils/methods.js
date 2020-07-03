const setArray = (val) => !Array.isArray(val) ? [val] : val
module.exports = setArray