import { el, setChildren } from "redom";
import { dateFormat } from "./date";
import cardValidator from "card-validator";

//Рендер строк таблицы
export function renderTransactionsList(arr) {
    const tbody = el('tbody', { className: 'tbody' });

    if (arr.length === 0) {
        setChildren(tbody, [
            el('tr', [
                el('td', 'Пока не совершено ни одной транзакции', { className: 'table__td' }),
                el('td', { className: 'table__td' }),
                el('td', { className: 'table__td' }),
                el('td', { className: 'table__td' })
            ])
        ]) 
    } else {
        setChildren(tbody, [
            arr.map(item => {
                let from = null;
                if (window.matchMedia("(max-width: 576px)").matches) {
                    from = `${item.from.substr(0, 6)}...${item.from.substr(-6)}`;
                } else {
                    from = item.from;
                }

                // let to = null;
                // if (window.matchMedia("(max-width: 576px)").matches) {
                //     to = `${item.to.substr(0, 4)}...${item.to.substr(-4)}`;
                // } else {
                //     to = item.to;
                // }

                return el('tr', [
                    el('td', { className: 'table__td table__td--from' }, from),
                    el('td', { className: 'table__td table__td--to' }, item.to),
                    el('td', { className: 'table__td table__td--sum', 'data-sum': item.amount }, `${item.amount} ₽`),
                    el('td', { className: 'table__td' }, dateFormat(item.date)),
                ])
            })
        ]);
    }

    identifyPaymentSystemHistory(tbody, 'table__td--from');
    identifyPaymentSystemHistory(tbody, 'table__td--to');

    if (window.matchMedia("(max-width: 576px)").matches) {
        for (const tdTo of tbody.querySelectorAll('.table__td--to')) {
            tdTo.classList.add('none');
        }
        
    }

    return tbody;
}

function identifyPaymentSystemHistory(tbody, classTds) {
    for (const tdTo of tbody.querySelectorAll(`.${classTds}`)) {
        if (!window.matchMedia("(max-width: 576px)").matches) {
            if (cardValidator.number(tdTo.textContent).isValid) {
                tdTo.classList.add('form__input--animation');
                const tdValue = tdTo.textContent;
                if (tdValue.startsWith('2')) {
                  tdTo.classList.add('form__input--mir');
                } else if (tdValue.startsWith('4')) {
                  tdTo.classList.add('form__input--visa');
                } else if (tdValue.startsWith('5')) {
                  tdTo.classList.add('form__input--mastercard');
                }   
            }
        }
    }   
}