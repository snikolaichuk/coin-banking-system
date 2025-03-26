import { el, setChildren } from "redom";
import { createBlueBtn } from "./view";

export class BankAccount {
    constructor(container, number, balance, lastDate) {
        this.container = container;
        this.number = number;
        this.balance = balance;
        this.lastDate = lastDate;
    }

    createBankAccountBlock() {
        const bankAccountBlock = el('article', { className: 'bank-account__block article' })
        setChildren(bankAccountBlock, [
            el('h2', this.number, { className: 'article__title' }),
            el('p', `${this.balance}₽`, { className: 'article__balance' }),
            el('div', { className: 'article__bottom' }, [
                el('div', { className: 'article__block' }, [
                    el('p', 'Последняя транзакция', { className: 'article__text' }),
                    el('p', this.lastDate, { className: 'article__date' })
                ]),
                createBlueBtn('a', 'Открыть', '', `/accounts/${this.number}`, 'article__btn', this.number, this.balance)
            ])
        ]);

        this.container.append(bankAccountBlock);
        return bankAccountBlock;
    }
}