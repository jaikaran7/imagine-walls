/** Client contact rules for quotations (name + mobile required). */

export function isValidMobile(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}

export type ClientContactErrors = {
  clientName?: string;
  clientPhone?: string;
};

export function validateClientContact(input: {
  clientName?: string | null;
  clientPhone?: string | null;
}): ClientContactErrors {
  const errors: ClientContactErrors = {};
  if (!String(input.clientName || "").trim()) {
    errors.clientName = "Client name is required.";
  }
  const phone = String(input.clientPhone || "").trim();
  if (!phone) {
    errors.clientPhone = "Mobile number is required.";
  } else if (!isValidMobile(phone)) {
    errors.clientPhone = "Enter a valid 10-digit mobile number.";
  }
  return errors;
}

export function firstClientContactError(errors: ClientContactErrors): string | null {
  return errors.clientName || errors.clientPhone || null;
}
