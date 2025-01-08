export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: "debit" | "credit";
}
