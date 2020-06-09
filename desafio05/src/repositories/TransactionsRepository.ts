import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

// interface CreateTransactionDTO {
//   title: string;
//   value: number;
//   type: string;
// };

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let incomes = 0, outcomes = 0;
    const filtering = this.transactions.map(item => {
      if (item.type == 'income') incomes += item.value;
      else outcomes += item.value;
    });

    return { income: incomes, outcome: outcomes, total: (incomes - outcomes) };
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
