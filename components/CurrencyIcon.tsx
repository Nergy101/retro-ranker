import {
  PiCurrencyDollar,
  PiCurrencyEur,
  PiCurrencyGbp,
  PiCurrencyRub,
  PiCurrencyInr,
  PiCurrencyKzt,
  PiCurrencyCny,
  PiCurrencyJpy,
} from "@preact-icons/pi";

interface CurrencyIconProps {
  currencyCode: string;
}

export function CurrencyIcon({ currencyCode }: CurrencyIconProps) {
  switch (currencyCode) {
    case "USD":
      return <PiCurrencyDollar />;
    case "EUR":
      return <PiCurrencyEur />;
    case "GBP":
      return <PiCurrencyGbp />;
    case "JPY":
      return <PiCurrencyJpy />;
    case "INR":
      return <PiCurrencyInr />;
    case "KRW":
      return <PiCurrencyCny />;
    case "RUB":
      return <PiCurrencyRub />;
    case "TRY":
      return <PiCurrencyKzt />;
    default:
      return <PiCurrencyDollar />;
  }
}
