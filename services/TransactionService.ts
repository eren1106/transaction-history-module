import { Transaction } from "@/types/transaction";
import transactions from "../data/transactions.json";

class TransactionService {
  private transactions: any[];

  constructor() {
    this.transactions = transactions;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.transactions);
      }, 1000); // Simulate API delay
    });
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = this.transactions.find((t) => t.id === id);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(transaction);
      }, 1000); // Simulate API delay
    });
  }
}

export default new TransactionService();