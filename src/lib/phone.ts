import {
  AsYouType,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

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
