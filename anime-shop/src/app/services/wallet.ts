import { Injectable, computed, signal } from '@angular/core';

export type CoinTier = 'dong' | 'bac' | 'vang' | 'kim_cuong' | 'ruby';

export type WalletBalances = Record<CoinTier, number>;

const COIN_RATE_VND: Record<CoinTier, number> = {
  dong: 1,          // basic unit
  bac: 100,         // 1 bạc = 100 đồng
  vang: 1_000,      // 1 vàng = 1000 đồng
  kim_cuong: 10_000,// 1 kim cương = 10k đồng
  ruby: 50_000      // 1 ruby = 50k đồng
};

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly balancesSignal = signal<WalletBalances>({
    dong: 0,
    bac: 0,
    vang: 0,
    kim_cuong: 0,
    ruby: 0
  });

  readonly balances = this.balancesSignal.asReadonly();
  readonly totalVnd = computed(() => {
    const b = this.balancesSignal();
    return (b.dong * COIN_RATE_VND.dong) +
           (b.bac * COIN_RATE_VND.bac) +
           (b.vang * COIN_RATE_VND.vang) +
           (b.kim_cuong * COIN_RATE_VND.kim_cuong) +
           (b.ruby * COIN_RATE_VND.ruby);
  });

  creditCoins(tier: CoinTier, amount: number) {
    const b = { ...this.balancesSignal() };
    b[tier] += Math.max(0, Math.floor(amount));
    this.balancesSignal.set(b);
  }

  debitCoins(tier: CoinTier, amount: number) {
    const b = { ...this.balancesSignal() };
    b[tier] = Math.max(0, b[tier] - Math.max(0, Math.floor(amount)));
    this.balancesSignal.set(b);
  }

  vndToCoins(vnd: number): Partial<WalletBalances> {
    // Greedy conversion to higher tiers first
    let remaining = Math.max(0, Math.floor(vnd));
    const result: Partial<WalletBalances> = { dong: 0, bac: 0, vang: 0, kim_cuong: 0, ruby: 0 };
    const order: CoinTier[] = ['ruby','kim_cuong','vang','bac','dong'];
    for (const tier of order) {
      const rate = COIN_RATE_VND[tier];
      const units = Math.floor(remaining / rate);
      if (units > 0) {
        // @ts-ignore - result index is safe
        result[tier] = (result[tier] ?? 0) + units;
        remaining -= units * rate;
      }
    }
    return result;
  }

  applyVndAsCoins(vnd: number) {
    const add = this.vndToCoins(vnd);
    const b = { ...this.balancesSignal() };
    (Object.keys(add) as CoinTier[]).forEach(k => {
      // @ts-ignore
      b[k] += add[k] ?? 0;
    });
    this.balancesSignal.set(b);
  }

  coinsToVnd(coins: Partial<WalletBalances>): number {
    let total = 0;
    for (const k of Object.keys(coins) as CoinTier[]) {
      total += (coins[k] ?? 0) * COIN_RATE_VND[k];
    }
    return total;
  }

  refundCoinsToVnd(tier: CoinTier, amount: number): number {
    const b = { ...this.balancesSignal() };
    const refundable = Math.min(b[tier], Math.max(0, Math.floor(amount)));
    b[tier] -= refundable;
    this.balancesSignal.set(b);
    return refundable * COIN_RATE_VND[tier];
  }

  spendVndWithCoins(totalVnd: number): boolean {
    let remaining = Math.max(0, Math.floor(totalVnd));
    if (remaining === 0) return true;
    const b = { ...this.balancesSignal() };
    const order: CoinTier[] = ['ruby','kim_cuong','vang','bac','dong'];
    for (const tier of order) {
      if (remaining <= 0) break;
      const valuePerUnit = COIN_RATE_VND[tier];
      if (b[tier] <= 0) continue;
      const maxCover = b[tier] * valuePerUnit;
      if (maxCover <= 0) continue;
      const neededUnits = Math.min(b[tier], Math.ceil(remaining / valuePerUnit));
      b[tier] -= neededUnits;
      remaining -= neededUnits * valuePerUnit;
    }
    if (remaining <= 0) {
      this.balancesSignal.set(b);
      return true;
    }
    return false;
  }
}
