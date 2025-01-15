interface CurrencyIconProps {
  currencyCode: string;
}

export function CurrencyIcon({ currencyCode }: CurrencyIconProps) {
  switch (currencyCode) {
    case "USD":
      return <i class="ph ph-currency-dollar"></i>;
    case "EUR":
      return <i class="ph ph-currency-euro"></i>;
    case "GBP":
      return <i class="ph ph-currency-pound"></i>;
    case "JPY":
      return <i class="ph ph-currency-yen"></i>;
    case "INR":
      return <i class="ph ph-currency-rupee"></i>;
    case "KRW":
      return <i class="ph ph-currency-won"></i>;
    case "RUB":
      return <i class="ph ph-currency-ruble"></i>;
    case "TRY":
      return <i class="ph ph-currency-turkish-real"></i>;
    default:
      return <i class="ph ph-currency-dollar"></i>;
  }
}
