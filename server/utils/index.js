const uniqid = require("uniqid");

const generateUsername = (name) => {
  let specials = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi;
  let sanitized = name.toLowerCase().replace(specials, "");
  let uniqueId = uniqid.time();
  return `${sanitized}_${uniqueId}`;
};

module.exports = {
  generateUsername,
};
