export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export function currencyFormat(price: number) {
  return `$${(price / 100).toFixed(2)}`;
}
