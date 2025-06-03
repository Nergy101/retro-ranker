import {
  PiCurrencyCny,
  PiCurrencyDollar,
  PiCurrencyEur,
  PiCurrencyGbp,
  PiCurrencyInr,
  PiCurrencyJpy,
  PiCurrencyKzt,
  PiCurrencyRub,
  PiQuestion,
} from "@preact-icons/pi";

interface CurrencyIconProps {
  currencyCode: string | null;
}

export function CurrencyIcon({ currencyCode }: CurrencyIconProps) {
  switch (currencyCode) {
    case null:
      return PiQuestion({});
    case "USD":
      return PiCurrencyDollar({});
    case "EUR":
      return PiCurrencyEur({});
    case "GBP":
      return PiCurrencyGbp({});
    case "JPY":
      return PiCurrencyJpy({});
    case "INR":
      return PiCurrencyInr({});
    case "KRW":
      return PiCurrencyCny({});
    case "RUB":
      return PiCurrencyRub({});
    case "TRY":
      return PiCurrencyKzt({});
    default:
      return PiCurrencyDollar({});
  }
}
