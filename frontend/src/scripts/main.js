import { el, mount, setChildren } from "redom";
import Navigo from "navigo";
import { 
    createBalance,
    createBankAccount, createErrorText, 
    createHeader, createLogin,  
    renderCurrencyExchange,  
    viewingAtmOnMap, 
    viewingBalanceHistory, viewingBankAccount, 
    viewingCurrencyExchange
} from "./view";
import { 
    getAccessToAccountItem, getAccessToAccountsList, 
    getAllCurrencies, getBanksPoint, getCurrenciesItem, 
    postCurrencyExchange, postLogin, postNewAccount,
    postNewTransaction } from "./api";
import { sortingLogic } from "./components/sorting";
import { createPagination } from "./components/pagination";
import { renderTransactionsList } from "./components/table";
import { createGraphDynamics } from "./components/graph";
import { initMap } from "./components/yandex-card";
import { validationCardNum, validationLoginForm, validationTransferForm } from "./components/validation";
import { renderBankAccountList } from "./components/render-accounts";
import { renderBalanceSkeleton, renderCurrencySkeleton, renderGraphSkeleton, renderListSkeleton, renderTableSkeleton } from "./components/render-skeleton";

const main = el('main', { className: 'main' });

const router = new Navigo('/');
let websocketOpen = null;

setChildren(document.body, [
    createHeader(),
    main,
]);

router
    .on('/', async () => { 
        if (websocketOpen) {
            if (websocketOpen.readyState === WebSocket.OPEN) {
                websocketOpen.close(1000, 'Закончим работу')
            }
        }
        followToLogin(); 
    })
    .on('/atms', async () => { 
        if (websocketOpen) {
            if (websocketOpen.readyState === WebSocket.OPEN) {
                websocketOpen.close(1000, 'Закончим работу')
            }
        }
        followToAtms(); 
    })
    .on('/currency', async () => { 
        setChildren(main, viewingCurrencyExchange());
        createHeaderNav();

        if (!websocketOpen || websocketOpen.readyState === WebSocket.CLOSED) {
            websocketOpen = new WebSocket(`ws://localhost:3000/currency-feed`);
            getCurrenciesChanges(websocketOpen);
        }

        addBlockToPage('.currency__item--my', '.currency__existing-list', renderCurrencySkeleton());

        setTimeout(async () => {
            const existingObj = await getCurrenciesItem(localStorage.getItem('token'));
            renderExistingCurrency(existingObj);

            const arrCurrency = await getAllCurrencies();
            const labelFrom = document.querySelector('label[for="input-from"]');
            const labelTo = document.querySelector('label[for="input-to"]');
            
            labelFrom.parentNode.append(renderCurrencyExchange(arrCurrency, 'input-from'));
            labelTo.parentNode.append(renderCurrencyExchange(arrCurrency, 'input-to'));
    
            followToCurrency();
        }, 1000)

    })
    .on('/accounts', async () => { 
        if (websocketOpen) {
            if (websocketOpen.readyState === WebSocket.OPEN) {
                websocketOpen.close(1000, 'Закончим работу')
            }
        }

        setChildren(main, createBankAccount());
        createHeaderNav();

        addBlockToPage('.bank-account__container', '.bank-account__list', renderListSkeleton());

        const token = localStorage.getItem('token');
        const bankAccounts = await getAccessToAccountsList(token);
        followToAccounts(bankAccounts); 
        
    })
    .on('/accounts/:id', async ({ data: { id } }) => {
        setChildren(main, viewingBankAccount(id));
        createHeaderNav();

        const graph = document.querySelector('.graph');

        addBlockToPage('.container__top', '.container__part--balance', renderBalanceSkeleton());
        addBlockToPage('.table__block', '.tbody', renderTableSkeleton());
        
        if (graph.querySelector('div')) {
            graph.querySelector('div').style.display = 'none';
            addBlockToPage('.graph', '.chart-container', renderGraphSkeleton());
        }

        const transactionsArr = await transactionsHistory(id, '10');
        const balance = await findBalance(id);

        const monthArr = await convertDateAndBalance(6, id).then(data => data.monthArr);
        const balanceArr = await convertDateAndBalance(6, id).then(data => data.balanceArr);

        addBlockToPage('.container__top', '.container__part--balance', createBalance(id, balance));
        addBlockToPage('.table__block', '.tbody', renderTransactionsList(transactionsArr, id));

        if (graph.querySelector('.chart-container')) {
            graph.querySelector('div').style.display = 'block';
            graph.querySelector('.chart-container').remove();
            const ctx = document.getElementById('my-chart-dynamic');
            createGraphDynamics(ctx, monthArr, balanceArr, '', '')
        }

        followToAccountPage(id, transactionsArr);
    })
    .on('/accounts/:id/history', async ({ data: { id } }) => {
        setChildren(main, viewingBalanceHistory(id));
        createHeaderNav();

        const graphDynamic = document.querySelector('#graph-dynamic');
        const graphExpchange = document.querySelector('#graph-expchange');

        if (graphDynamic.querySelector('div')) {
            graphDynamic.querySelector('div').style.display = 'none';
            addBlockToPage('#graph-dynamic', '.chart-container', renderGraphSkeleton());
        }

        if (graphExpchange.querySelector('div')) {
            graphExpchange.querySelector('div').style.display = 'none';
            addBlockToPage('#graph-expchange', '.chart-container', renderGraphSkeleton());
        }

        addBlockToPage('.container__top', '.container__part--balance', renderBalanceSkeleton());
        addBlockToPage('.table__block', '.tbody', renderTableSkeleton());

        const transactionsArr = await transactionsHistory(id, '151');
        const balance = await findBalance(id);
        
        const monthArrDynamic = await convertDateAndBalance(12, id).then(data => data.monthArr);
        const balanceArr = await convertDateAndBalance(12, id).then(data => data.balanceArr);

        const monthArr = await convertDateAndExpenses(12, id).then(data => data.monthArr);
        const expansesArr = await convertDateAndExpenses(12, id).then(data => data.expansesArr);
        const incomeArr = await convertDateAndExpenses(12, id).then(data => data.incomeArr);

        addBlockToPage('.container__top', '.container__part--balance', createBalance(id, balance));
        addBlockToPage('.table__block', '.tbody', renderTransactionsList(transactionsArr, id));
        createPagination();

        if (graphDynamic.querySelector('.chart-container')) {
            graphDynamic.querySelector('div').style.display = 'block';
            graphDynamic.querySelector('.chart-container').remove();
            const ctx = document.getElementById('my-chart-dynamic');
            createGraphDynamics(ctx, monthArrDynamic, balanceArr, '', '');
        }

        if (graphExpchange.querySelector('.chart-container')) {
            graphExpchange.querySelector('div').style.display = 'block';
            graphExpchange.querySelector('.chart-container').remove();
            const ctxExchange = document.getElementById('my-chart-expchange');
            createGraphDynamics(ctxExchange, monthArr, '', expansesArr, incomeArr);
        }

        followToBalanceDynamics(id, transactionsArr);
        
    })
;

router.resolve();

//История транзакций счета
async function transactionsHistory(id, quantity) {
    const transactionsApi = await getAccessToAccountItem(localStorage.getItem('token'), id);
    
    const transactionsArr = transactionsApi?.transactions.reverse().slice('0', quantity);
    return transactionsArr;
}

//Получаю баланс счета
async function findBalance(id) {
    let balance = null;

    const token = localStorage.getItem('token');
    const bankAccounts = await getAccessToAccountsList(token);
    bankAccounts?.forEach((account) => {
        if (account.account === id) {
            balance = account.balance;
        }
    })

    return balance;
}

//Страница авторицации
function followToLogin() {
    setChildren(main, createLogin());
    
    //Обработчик кнопки Войти
    document.querySelector('.login__form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const loginInput = document.querySelector('#input-login');
        const passwordInput = document.querySelector('#input-password');
        
        if (!validationLoginForm(loginInput.value.trim())) {
            createErrorText(loginInput, 'Логин должен содержать не менее 6 латинских букв и не содержать пробелы', loginInput.parentElement);
            return;
        }

        if (!validationLoginForm(passwordInput.value.trim())) {
            createErrorText(passwordInput, 'Пароль должен содержать не менее 6 латинских букв и не содержать пробелы', passwordInput.parentElement);
            return;
        }

        
        const authorization = await postLogin(loginInput.value, passwordInput.value);
        
        if (authorization.error === 'No such user') {
            createErrorText(loginInput, 'Неверный логин', loginInput.parentElement);
            return;
        } 
        if (authorization.error === 'Invalid password') {
            createErrorText(passwordInput, 'Неверный пароль', passwordInput.parentElement);
            return;
        }

        const authorizationToken = authorization.payload.token
        
        localStorage.setItem('token', authorizationToken);

        window.history.pushState({}, '', '/accounts');
        router.navigate(window.location.pathname);
    });
}

//Ссылка кнопки Банкоматы
async function followToAtms() {
    setChildren(main, viewingAtmOnMap());
    const mapContainer = document.querySelector('#map');
    const banksPointArr = await getBanksPoint();
    
    initMap(mapContainer, banksPointArr);
    
    createHeaderNav();
}

//Обработчик бургер меню
document.querySelector('#burger-btn').addEventListener('click', () => {
    const header = document.querySelector('.header__container');
    header.classList.toggle('burger__open');

    const headerLinks = document.querySelectorAll('.header__link');
    for (const link of headerLinks) {
        link.classList.add('burger__link');
    }
})

//Обработчик ссылки Банкоматы
document.querySelector('#link-atms').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate(document.querySelector('#link-atms').getAttribute('href'));
})

//Получаю данные об изменении курса валют (websocket)
async function getCurrenciesChanges(connection) {
    connection.onopen = (event) => {
        console.log('connect open');
    }

    let existingObj = null;

    const currencyArr = document.querySelector('.currency__courses-list')?.childNodes; 

    connection.onmessage = async (event) => {
        if (localStorage.getItem('token')) existingObj = Object.keys(await getCurrenciesItem(localStorage.getItem('token')));
        
        const data = JSON.parse(event.data);
        if (currencyArr.length < existingObj.length + 6) {
            renderCurrencyList(data);
        } else if (currencyArr.length === existingObj.length + 6 && event) {
            currencyArr[0].remove();
            renderCurrencyList(data);
        }
    }

    connection.onclose = (event) => {
        console.log('connect close', event);
    }

    return connection;
}

//Ссылка кнопки Валюта
async function followToCurrency() {
    //Обработчик Обмена валют
    document.querySelector('.currency__form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const sumInput = document.querySelector('#input-sum');
        const inputFrom = document.querySelector('#input-from');
        const inputTo = document.querySelector('#input-to');

        if (!validationTransferForm(sumInput.value.trim(), 2)) {
            createErrorText(sumInput, 'Поле Сумма должно содержать положительное число', document.querySelector('.currency__block'));
            return;
        }

        const exchange = await postCurrencyExchange(localStorage.getItem('token'), inputFrom.value, inputTo.value, sumInput.value);

        if (exchange.error === 'Not enough currency' || exchange.error === 'Overdraft prevented') {
            createErrorText(sumInput, 'На счете недостаточно средств', document.querySelector('.currency__block'));
            return;
        }

        if (inputFrom.value === inputTo.value) {
            createErrorText(inputTo, 'Выберете другую валюту для совершения перевода', document.querySelector('.currency__block'));
            return;
        }

        if (!exchange.error) {
            const transactionExchange = await getCurrenciesItem(localStorage.getItem('token')) 

            const exsitingList = main.querySelector('.currency__existing-list');
            exsitingList.innerHTML = '';
            renderExistingCurrency(transactionExchange);           
        }

        sumInput.value = '';
        inputFrom.selectedIndex = 0;
        inputTo.selectedIndex = 0;
        
    });
}

//Обработчик ссылки Валюта
document.querySelector('#link-currency').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate(document.querySelector('#link-currency').getAttribute('href'));
})
        
//Обработчик кнопки Выйти
document.querySelector('#link-exit').addEventListener('click', async (e) => {
    e.preventDefault();
    router.navigate(document.querySelector('#link-exit').getAttribute('href'));
    localStorage.removeItem('token');
    
})

//Ссылка Списка счетов
export function followToAccounts(bankArr) {
    addBlockToPage('.bank-account__container', '.bank-account__list', renderBankAccountList(bankArr));
    sortingLogic(bankArr);

    //Обработчик кнопки Создать новый счет
    document.getElementById('new-account-btn').addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const newAccount = await postNewAccount(token);
        const bankAccounts = await getAccessToAccountsList(token);
        
        addBlockToPage('.bank-account__container', '.bank-account__list', renderBankAccountList(bankAccounts));
        sortingLogic(bankAccounts);
    })

    for (const account of document.querySelectorAll('.article__btn')) {
        //Обработчик ссылки Открыть
        account.addEventListener('click', async (e) => {
            e.preventDefault();
            router.navigate(account.getAttribute('href'));
        });
    }
};

//Обработчик ссылки Счета
document.querySelector('#link-accounts').addEventListener('click', async (e) => {
    e.preventDefault();
    router.navigate(document.querySelector('#link-accounts').getAttribute('href'));
});

//Получаю даты и баланс для графика
async function convertDateAndBalance (graphLength, num) {
    const accountTransactions = await getAccessToAccountItem(localStorage.getItem('token'), num);
    let myBalanceNow = accountTransactions.balance;
    
    let balanceArr = [];
    let monthArr = [];

    let d = null;
    for (let i = 0; i < graphLength; i++) {
        d = new Date();
        d.setMonth(d.getMonth() - i);
        const countdownDate = d.getMonth();
        
        if (countdownDate === 0) monthArr.push('янв');
        if (countdownDate === 1) monthArr.push('фев');
        if (countdownDate === 2) monthArr.push('мар');
        if (countdownDate === 3) monthArr.push('апр');
        if (countdownDate === 4) monthArr.push('май');
        if (countdownDate === 5) monthArr.push('июн');
        if (countdownDate === 6) monthArr.push('июл');
        if (countdownDate === 7) monthArr.push('авг');
        if (countdownDate === 8) monthArr.push('сен');
        if (countdownDate === 9) monthArr.push('окт');
        if (countdownDate === 10) monthArr.push('ноя');
        if (countdownDate === 11) monthArr.push('дек');
    
        // console.log(myBalanceNow);
        balanceArr.push(myBalanceNow);
        
        accountTransactions.transactions.map((item) => {
            if (new Date(item.date).getFullYear() === d.getFullYear()) {
                if (new Date(item.date).getMonth() === countdownDate) {
                    if (item.from === num) {
                        // console.log('from', item);
                        myBalanceNow += item.amount;
                    } else if (item.to === num) {
                        // console.log('to', item);
                        myBalanceNow -= item.amount;
                    }
                    
                }
            }
        });
        
    } 
    monthArr.reverse();
    balanceArr.reverse();

    // console.log(balanceArr);

    return {monthArr, balanceArr};   
}

//Получаю расходы и доходы для графика
async function convertDateAndExpenses (graphLength, num) {
    const accountTransactions = await getAccessToAccountItem(localStorage.getItem('token'), num);
    
    let expansesArr = [];
    let incomeArr = [];
    let monthArr = [];

    let d = null;
    for (let i = 0; i < graphLength; i++) {
        d = new Date();
        d.setMonth(d.getMonth() - i);
        const countdownDate = d.getMonth();
        
        if (countdownDate === 0) monthArr.push('янв');
        if (countdownDate === 1) monthArr.push('фев');
        if (countdownDate === 2) monthArr.push('мар');
        if (countdownDate === 3) monthArr.push('апр');
        if (countdownDate === 4) monthArr.push('май');
        if (countdownDate === 5) monthArr.push('июн');
        if (countdownDate === 6) monthArr.push('июл');
        if (countdownDate === 7) monthArr.push('авг');
        if (countdownDate === 8) monthArr.push('сен');
        if (countdownDate === 9) monthArr.push('окт');
        if (countdownDate === 10) monthArr.push('ноя');
        if (countdownDate === 11) monthArr.push('дек');

        let expanses = null;
        let income = null;
        
        accountTransactions.transactions.map((item) => {
            if (new Date(item.date).getFullYear() === d.getFullYear()) {
                if (new Date(item.date).getMonth() === countdownDate) {
                    if (item.from === num) {
                        expanses += item.amount;
                        // console.log('from', expanses, item);s
                        
                    } else if (item.to === num) {
                        income += item.amount;
                        // console.log('to', income, item);
                        
                    }
                }
            }
        });
        
        if (income === null) income = 0;
        if (expanses === null) expanses = 0;
        incomeArr.push(income);
        expansesArr.push(expanses);
    } 
    
    monthArr.reverse();
    expansesArr.reverse();
    incomeArr.reverse();

    // console.log(monthArr, expansesArr, incomeArr);

    return {monthArr, expansesArr, incomeArr};   
}

//Окрашиваю расходы/доходы в красный/зеленый цвет
function addColorToSum(arr, num) {
    arr.map(item => {
        for (let sum of document.querySelectorAll('[data-sum]')) {
            if (num === item.to) {
                if (+sum.getAttribute('data-sum') === item.amount) {
                    sum.classList.add('table__td--green');
                }
            } else if (num === item.from) {
                if (+sum.getAttribute('data-sum') === item.amount) {
                    sum.classList.add('table__td--red');
                }
            }
        }
        
    })
}

//Добавляю блок на страницу
function addBlockToPage(containerSelector, elemSelector, contentFunc) {
    const container = document.querySelector(`${containerSelector}`);
    if (container.querySelector(elemSelector)) container.querySelector(elemSelector).remove();
    
    mount(container, contentFunc);
}

//Добавляю значок платежной системы
function identifyPaymentSystem(cardNum) {
    cardNum.classList.add('form__input--animation')
    const cardNumValue = cardNum.value;
    if (cardNumValue.startsWith('2')) {
      cardNum.classList.add('form__input--mir');
    } else if (cardNumValue.startsWith('4')) {
      cardNum.classList.add('form__input--visa');
    } else if (cardNumValue.startsWith('5')) {
      cardNum.classList.add('form__input--mastercard');
    }
}

function removePaymentSystem(cardNum) {
    cardNum.classList.remove('form__input--animation')
        if (cardNum.classList.contains('form__input--mir')) cardNum.classList.remove('form__input--mir');
        if (cardNum.classList.contains('form__input--visa')) cardNum.classList.remove('form__input--visa');
        if (cardNum.classList.contains('form__input--mastercard')) cardNum.classList.remove('form__input--mastercard');
}

//Просмотр конкретного счета
export async function followToAccountPage(num, arr) {
    addColorToSum(arr, num);

    //Обработчик ссылки Вернуться назад
    document.querySelector('#back-to-accounts').addEventListener('click', async(e) => {
        e.preventDefault();

        router.navigate(document.querySelector('#back-to-accounts').getAttribute('href'));
    });

    //Просмотр истории балалнса
    document.querySelector('#balance-dynamics').addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate(document.querySelector('#balance-dynamics').getAttribute('href'));
    })

    const numInput = document.querySelector('#input-num');
    const sumInput = document.querySelector('#input-sum');
    
    numInput.onblur = () => {
        if (!validationTransferForm(numInput.value.trim(), 5)) {
            createErrorText(numInput, 'Номер счета  должен содержать не менее 5 цифр', numInput.parentElement);
        } else {
            if (validationCardNum(numInput)) {
                identifyPaymentSystem(numInput);
            }
        }
    }

    sumInput.onblur = () =>{
        if (!validationTransferForm(sumInput.value.trim(), 2)) {
            createErrorText(sumInput, 'Поле Сумма должно содержать положительное число', sumInput.parentElement);
            return;
        }
    }

    numInput.onfocus = () => {
        removePaymentSystem(numInput);
    }

    //Обработчик формы Новый перевод
    document.querySelector('.view-account__form').addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validationTransferForm(numInput.value.trim(), 5)) {
            return;
        }
    
        if (!validationTransferForm(sumInput.value.trim(), 2)) {
            return;
        }

        const token = localStorage.getItem('token');
        const from = document.querySelector('#send-btn').getAttribute('data-num');
        const to = numInput.value;
        const sum = sumInput.value;

        const newTransaction = await postNewTransaction(token, from, to, sum);

        if (newTransaction.error === 'Invalid account to') {
            createErrorText(numInput, 'Указан несуществующий счет', numInput.parentElement);
            return;
        }

        if (newTransaction.error === 'Invalid amount') {
            createErrorText(sumInput, 'Укажите корректную сумму', sumInput.parentElement);
            return;
        }

        if (newTransaction.error === 'Overdraft prevented') {
            createErrorText(sumInput, 'На счете недостаточно средств', sumInput.parentElement);
            return;
        }

        saveNumberOnStorage();

        if (!newTransaction.error) {
            const transactionArr = await transactionsHistory(num, '10');

            const containerTop = main.querySelector('.container__top');
            const containerBalance = main.querySelector('.container__part--balance');
            containerBalance.remove();
            containerTop.append(createBalance(num, newTransaction.payload.balance));

            addBlockToPage('.table__block', '.tbody', renderTransactionsList(transactionArr, num));
            addColorToSum(transactionArr, num);
        }

        removePaymentSystem(numInput);
        numInput.value = '';
        sumInput.value = '';
    });
}

//Просмотр Истории баланса
async function followToBalanceDynamics(num, arr) {
    addColorToSum(arr, num);

    //Обработчик кнопки Вернуться назад
    document.querySelector('#back-btn').addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate(document.querySelector('#back-btn').getAttribute('href'));
    });
}

//Добавление навигации в header
function createHeaderNav() {
    const header = document.querySelector('.header');
    main.querySelector('.container').setAttribute('data-login', '');
    document.querySelector('.header__list').classList.remove('none');

    if (window.matchMedia("(max-width: 768px)").matches) {
        const headerContainer = document.querySelector('.header__container');
        headerContainer.classList.remove('burger__open');
        headerContainer.classList.add('burger');
    }
}

//Записываем данные в localStorage
function saveNumberOnStorage() {
    const inputNumber = document.querySelector('#input-num').value;
    let storageValue = localStorage.getItem('accountNum');
    let inputNumbers = storageValue ? JSON.parse(storageValue) : [];

    if (!inputNumbers.includes(inputNumber)) {
        inputNumbers.push(inputNumber);
        localStorage.setItem('accountNum', JSON.stringify(inputNumbers));
    }
}

//Отрисовка списка валют
function renderCurrencyList(currencyData) {
    const currencyList = main.querySelector('.currency__courses-list');
    let dotter = null;
    let textArrow = null;

    const currencyItem = el('li', { className: 'currency__course-item'}, [
        el('p',  { className: 'currency__text currency__text--weight' }, [
            el('span', currencyData.from),
            el('span', ' / '),
            el('span', currencyData.to),
        ]),
        dotter = el('div', { className: 'currency__dotted currency__dotter-color' }),
        textArrow = el('p', currencyData.rate, { className: 'currency__text currency__text-arrow' }),
    ]);

    currencyList?.append(currencyItem);

    if (currencyData.change === -1) {
        dotter.classList.add('currency__dotter--red');
        textArrow.classList.add('currency__text--red');
    } else if (currencyData.change === 1) {
        dotter.classList.add('currency__dotter--green');
        textArrow.classList.add('currency__text--green');
    }

    return currencyItem;
}

//Отрисовка списка имеющихся валют
function renderExistingCurrency(existingObj) {
    const existingList = main.querySelector('.currency__existing-list');
    existingList.innerHTML = '';
    let existingArr = [];

    for (const key in existingObj) {
        if (existingObj[key].amount > 0) {
            existingArr.push(el('li', { className: 'currency__existing-item' }, [
                el('p', existingObj[key].code, { className: 'currency__text currency__text--weight' }),
                el('div', { className: 'currency__dotted' }),
                el('p', existingObj[key].amount, { className: 'currency__text' },)
            ]))
        }
    }

    setChildren(existingList, [
        existingArr,
    ]);
    
    return existingList;
}

