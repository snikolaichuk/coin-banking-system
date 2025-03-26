import { el } from "redom";
import { dateFormat } from "./date";
import { BankAccount } from "../classes";

//Отрисовка списка счетов
export function renderBankAccountList(bankArr) {
    const list = el('ul', { className: 'bank-account__list' });
    
    bankArr.map((number) => {
        const li = el('li', { className: 'bank-account__item' });
        const date = (number.transactions.length === 0) ? 'Еще не было транзакций' : dateFormat(number.transactions[0].date);

        const bankAccount = new BankAccount(li, number.account, number.balance, date);
        bankAccount.createBankAccountBlock();
        list.append(li);
        
    });
    
    return list;
}