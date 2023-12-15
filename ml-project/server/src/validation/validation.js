//validation for Value
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value !== "string" || value == "") return false;
  return true;
};

//validation of  empty string
const validString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const validQuantity = function isInteger(value) {
  if (value < 1) return false;
  if (value % 1 == 0) return true;
};
const isValidRequestBody = function (request) {
  return Object.keys(request).length > 0;
};

module.exports = {
  isValid,
validString,

  validQuantity,
  isValidRequestBody,
};
