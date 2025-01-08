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
}

export default new TransactionService();