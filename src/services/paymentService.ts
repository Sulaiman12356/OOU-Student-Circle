// Payment & Escrow Architecture for OOU StudentCircle
import { WalletTransaction, TransactionStatus } from '../types';
import { DataStore } from './dataStore';

export interface PaymentInitiationResult {
  success: boolean;
  reference: string;
  authorizationUrl?: string;
  isTestMode: boolean;
  message?: string;
}

export interface BankAccountDetails {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const SUPPORTED_NIGERIAN_BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '023', name: 'Citibank' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank (FCMB)' },
  { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '50211', name: 'Kuda Microfinance Bank' },
  { code: '526', name: 'Moniepoint MFB' },
  { code: '999992', name: 'OPay Digital Services' },
  { code: '999991', name: 'PalmPay' },
  { code: '101', name: 'Providus Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'Suntrust Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank / ALAT' },
  { code: '057', name: 'Zenith Bank' }
];

export class PaymentService {
  /**
   * Calculate transaction breakdown based on current platform commission %
   */
  static calculateBreakdown(grossAmount: number, commissionPercent: number = 10) {
    const platformFee = Math.round((grossAmount * commissionPercent) / 100);
    const netStudentAmount = grossAmount - platformFee;
    return {
      grossAmount,
      commissionPercent,
      platformFee,
      netStudentAmount
    };
  }

  /**
   * Process escrow deposit for a hired job or service order
   */
  static async processEscrowPayment(params: {
    jobId?: string;
    jobTitle: string;
    clientId: string;
    clientName: string;
    studentId: string;
    studentName: string;
    amount: number;
    commissionPercent?: number;
  }): Promise<{ success: boolean; transaction: WalletTransaction; message: string }> {
    const settings = DataStore.getPlatformSettings();
    const feePct = params.commissionPercent ?? settings.platformFeePercent ?? 10;
    const { platformFee, netStudentAmount } = this.calculateBreakdown(params.amount, feePct);
    
    const txId = `tx-escrow-${Date.now()}`;
    const reference = `SC-ESCROW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction: WalletTransaction = {
      id: txId,
      jobId: params.jobId,
      jobTitle: params.jobTitle,
      payerId: params.clientId,
      payerName: params.clientName,
      recipientId: params.studentId,
      recipientName: params.studentName,
      amount: params.amount,
      platformFee,
      netAmount: netStudentAmount,
      status: 'held_in_escrow',
      type: 'escrow_hold',
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      reference,
      title: `Escrow Hold for ${params.jobTitle}`
    };

    DataStore.saveTransaction(transaction);

    // Notify student that funds have been safely secured in escrow
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: params.studentId,
      title: 'Payment Secured in Escrow!',
      message: `₦${params.amount.toLocaleString()} has been funded and held in escrow for "${params.jobTitle}". You can begin work immediately!`,
      type: 'job_hired',
      link: '/student/jobs',
      read: false,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      transaction,
      message: 'Escrow payment secured successfully in StudentCircle Vault.'
    };
  }

  /**
   * Release escrow funds to student upon client completion approval
   */
  static async releaseEscrow(transactionId: string): Promise<{ success: boolean; message: string }> {
    const transactions = DataStore.getTransactions();
    const tx = transactions.find(t => t.id === transactionId);
    
    if (!tx) {
      return { success: false, message: 'Transaction not found.' };
    }

    if (tx.status !== 'held_in_escrow') {
      return { success: false, message: `Transaction is already ${tx.status}.` };
    }

    tx.status = 'released';
    DataStore.saveTransaction(tx);

    // Credit student wallet
    if (tx.recipientId) {
      const student = DataStore.getUserById(tx.recipientId);
      if (student) {
        const netEarning = tx.netAmount || (tx.amount - (tx.platformFee || 0));
        student.totalEarnings = (student.totalEarnings || 0) + netEarning;
        student.completedJobsCount = (student.completedJobsCount || 0) + 1;
        DataStore.saveUser(student);

        // Notification
        DataStore.addNotification({
          id: `notif-${Date.now()}`,
          userId: tx.recipientId,
          title: 'Funds Released to Your Balance!',
          message: `₦${netEarning.toLocaleString()} from "${tx.jobTitle || 'Completed Order'}" is now available in your balance.`,
          type: 'job_completed',
          link: '/student/earnings',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    return {
      success: true,
      message: 'Funds released to student balance successfully.'
    };
  }

  /**
   * Mask account number for secure UI display
   */
  static maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length < 4) return '••••';
    return `••••${accountNumber.slice(-4)}`;
  }
}
