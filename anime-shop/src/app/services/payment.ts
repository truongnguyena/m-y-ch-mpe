import { Injectable } from '@angular/core';
import { CartService } from './cart';
import { WalletService } from './wallet';
import { BankService } from './bank';

export type PaymentMethod = 'bank' | 'coins';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private readonly cart: CartService, private readonly wallet: WalletService, private readonly bank: BankService) {}

  async payWithBank(verificationCode: string): Promise<boolean> {
    const ok = await this.bank.verifyBankTransfer(verificationCode);
    if (!ok) return false;
    const total = this.cart.totalVnd();
    this.wallet.applyVndAsCoins(total);
    this.cart.clear();
    return true;
  }

  payWithCoins(): boolean {
    const total = this.cart.totalVnd();
    // Consume coins from highest tier to lowest to cover total
    let remaining = total;
    const order: Array<['ruby'|'kim_cuong'|'vang'|'bac'|'dong', number]> = [
      ['ruby', Infinity], ['kim_cuong', Infinity], ['vang', Infinity], ['bac', Infinity], ['dong', Infinity]
    ];
    for (const [tier] of order) {
      if (remaining <= 0) break;
      const rate = (WalletService as any).prototype.constructor.COIN_RATE_VND?.[tier] ?? undefined;
      // Since COIN_RATE_VND is private here, directly debit coins in value steps
      const balances = this.wallet.balances();
      const available = (balances as any)[tier] as number;
      if (available > 0) {
        const valuePerUnit = tier === 'ruby' ? 50000 : tier === 'kim_cuong' ? 10000 : tier === 'vang' ? 1000 : tier === 'bac' ? 100 : 1;
        const neededUnits = Math.min(available, Math.ceil(remaining / valuePerUnit));
        (this.wallet as any).debitCoins(tier, neededUnits);
        remaining -= neededUnits * valuePerUnit;
      }
    }
    if (remaining <= 0) {
      this.cart.clear();
      return true;
    }
    return false;
  }
}
