import assert from "node:assert/strict";
import {
  firstClientContactError,
  isValidMobile,
  validateClientContact,
} from "./client-contact";

assert.equal(isValidMobile("9876543210"), true);
assert.equal(isValidMobile("+91 98765 43210"), true);
assert.equal(isValidMobile("12345"), false);

assert.equal(
  firstClientContactError(validateClientContact({ clientName: "", clientPhone: "9876543210" })),
  "Client name is required.",
);
assert.equal(
  firstClientContactError(validateClientContact({ clientName: "Ravi", clientPhone: "" })),
  "Mobile number is required.",
);
assert.equal(
  firstClientContactError(validateClientContact({ clientName: "Ravi", clientPhone: "9876543210" })),
  null,
);

console.log("client-contact: ok");
