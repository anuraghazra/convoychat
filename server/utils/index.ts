import { time } from "uniqid";

const generateUsername = (name: string) => {
  let specials = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi;
  let sanitized = name.toLowerCase().replace(specials, "");
  let uniqueId = time();
  return `${sanitized}-${uniqueId}`;
};

export {
  generateUsername,
};
