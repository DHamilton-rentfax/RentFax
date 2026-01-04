import {
  AsYouType,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

/**
 * Safely formats and validates international phone numbers.
 * - Produces display-friendly formatting
 * - Returns E.164 only if valid
 * - Enforces strict country typing
 */
export function formatInternationalPhone(
  value: string,
  defaultCountry: CountryCode = "US"
) {
  const typer = new AsYouType(defaultCountry);
  const display = typer.input(value);

  const phone = parsePhoneNumberFromString(value, defaultCountry);

  return {
    display,
    e164: phone?.isValid() ? phone.number : null,
    country: phone?.country ?? defaultCountry,
    isValid: Boolean(phone?.isValid()),
  };
}
