import { renderBankAccountList } from "./render-accounts";
import { dateFormat } from "./date";

//Сортировка массива счетов
function sortBankAccounts(arr, prop, dir = false) {
    let result = arr.sort(function (a, b) {
        if (prop === 'transactions') {
            a[prop] = a[prop].split('.').reverse().join(' ');
            b[prop] = b[prop].split('.').reverse().join(' ');
        }

        let conditionDir = a[prop] < b[prop];
        if (dir == true) conditionDir = a[prop] > b[prop];
        if (conditionDir == true) return -1;
        if (a[prop] == b[prop]) return 0;
        if (a[prop] > b[prop]) return 1;
    });    

    if (prop === 'transactions') {
        for (let i = 0; i < result.length; i++) {
            result[i][prop] = result[i][prop].split(' ').reverse().join('.');
        }
    }

    return result;
};

//Сортировка счетов в dom
export function sortingLogic(array) {
    const select = document.querySelector('.bank-account__select');
    const container = document.querySelector('.bank-account__container');

    select?.addEventListener('change', () => {
        if (select.value === 'number') {
            sortBankAccounts(array, 'account');
            if (container.querySelector('.bank-account__list')) container.querySelector('.bank-account__list').remove();
            
            container.append(renderBankAccountList(array));
        } else if (select.value === 'balance') {
            sortBankAccounts(array, 'balance', true);
            if (container.querySelector('.bank-account__list')) container.querySelector('.bank-account__list').remove();
            
            container.append(renderBankAccountList(array));
        } else if (select.value === 'transaction-date') {
            const sortingArr = array.map(acc => {
                if (acc.transactions.length === 0) {
                    return Object.assign({}, acc, {transactions: dateFormat(new Date(0))})
                } else {
                    return Object.assign({}, acc, {transactions: dateFormat(new Date(acc.transactions[0].date))} )
                }
            });

            sortBankAccounts(sortingArr, 'transactions', true);
            sortingArr.map(item => {
                if (item.transactions === dateFormat(new Date(0))) {
                    item.transactions = [];                    
                } else {
                    for (let acc of array) {
                        if (item.account === acc.account) {
                            item.transactions = acc.transactions;      
                        }
                    }
                }
            })

            
            if (container.querySelector('.bank-account__list')) container.querySelector('.bank-account__list').remove();
            
            container.append(renderBankAccountList(sortingArr));
        }
    })
    
}