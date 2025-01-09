export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: "debit" | "credit";
  category: string;
  status: "completed" | "pending";
  merchant: string;
  location: string;
}
