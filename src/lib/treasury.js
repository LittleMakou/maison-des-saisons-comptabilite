const toCents = (value) => {
  if (typeof value === 'number') {
    throw new TypeError('Utilisez une chaîne décimale ou un entier en centimes, jamais un nombre flottant.');
  }
  const text = String(value ?? '0').trim();
  if (!/^-?\\d+(?:\\.\\d{1,2})?$/.test(text)) throw new TypeError(`Montant invalide : ${text}`);
  const negative = text.startsWith('-');
  const unsigned = negative ? text.slice(1) : text;
  const [euros, cents = ''] = unsigned.split('.');
  const total = BigInt(euros) * 100n + BigInt((cents + '00').slice(0, 2));
  return negative ? -total : total;
};

const sum = (values) => values.reduce((total, value) => total + toCents(value), 0n);
const nonNegative = (value) => value > 0n ? value : 0n;
const euros = (cents) => {
  const sign = cents < 0n ? '-' : '';
  const abs = cents < 0n ? -cents : cents;
  return `${sign}${abs / 100n}.${String(abs % 100n).padStart(2, '0')}`;
};

export function calculateTreasury({ bankBalances = [], vatPeriods = [], unpaidExpenses = [], reserves = [] }) {
  const bank = sum(bankBalances.filter((x) => x.active !== false).map((x) => x.balance));
  const vatReserve = vatPeriods.reduce((total, p) => {
    const net = toCents(p.collected) - toCents(p.deductible) + toCents(p.adjustments ?? '0') - toCents(p.creditApplied ?? '0') - toCents(p.paid ?? '0');
    return total + nonNegative(net);
  }, 0n);
  const vatCredit = vatPeriods.reduce((total, p) => {
    const net = toCents(p.collected) - toCents(p.deductible) + toCents(p.adjustments ?? '0') - toCents(p.creditApplied ?? '0') - toCents(p.paid ?? '0');
    return total + nonNegative(-net);
  }, 0n);
  const unpaid = unpaidExpenses.reduce((total, item) => total + nonNegative(toCents(item.total) - toCents(item.paid ?? '0')), 0n);
  const other = reserves.reduce((total, item) => total + (item.cancelled ? 0n : nonNegative(toCents(item.due) - toCents(item.paid ?? '0'))), 0n);
  const totalReserves = vatReserve + unpaid + other;
  const available = bank - totalReserves;
  return {
    bankAvailable: euros(bank),
    vatToReserve: euros(vatReserve),
    vatCredit: euros(vatCredit),
    unpaidPurchaseExpenses: euros(unpaid),
    otherReserves: euros(other),
    totalReserves: euros(totalReserves),
    availableTreasury: euros(available),
    overdrawn: available < 0n,
  };
}
