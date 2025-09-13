import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BankService {
  // Simulate verifying a bank transfer via a code received by email
  async verifyBankTransfer(code: string): Promise<boolean> {
    // In real life, call backend which checks Gmail/Bank webhook for a matching code
    await new Promise(r => setTimeout(r, 400));
    return typeof code === 'string' && code.trim().length >= 6;
  }
}
