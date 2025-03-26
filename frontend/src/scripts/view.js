import { el, setChildren } from "redom";
import logo from '../assets/images/logo.svg';
import '../styles/normalize.css';
import '../styles/style.scss';
import { addHintAccountNumber } from "./components/datalist";

//Белая кнопка-ссылка
function createWhiteBtn(text, id, urlPath) {
    return el('a', { className: 'header__link', href: `/${urlPath}`, id: id }, [
        el('span', text, { className: 'header__span' }),
    ]);
}

//header
export function createHeader() {
    const header = el('header', { className: 'header' });
    setChildren(header, [
        el('div', { className: 'container header__container' }, [
            el('a', { className: 'header__link-logo' }, [
                el('img', { className: 'header__logo', src: logo, alt: 'Логотип Coin' })
            ]),
            el('ul', { className: 'header__list none' }, [
                el('li', { className: 'header__item' }, [
                    createWhiteBtn('Банкоматы', 'link-atms', 'atms'),
                ]),
                el('li', { className: 'header__item' }, [
                    createWhiteBtn('Счета', 'link-accounts', 'accounts')
                ]),
                el('li', { className: 'header__item' }, [
                    createWhiteBtn('Валюта', 'link-currency', 'currency')
                ]),
                el('li', { className: 'header__item' }, [
                    createWhiteBtn('Выйти', 'link-exit', '')
                ])
            ]),
            el('button', { className: 'burger__btn', id: 'burger-btn' }, [
                el('span', { className: 'burger__line' }),
                el('span', { className: 'burger__line' }),
                el('span', { className: 'burger__line' }),
            ]),
            el('div', { className: 'burger__overlay' }),
        ]),
    ]);

//    console.log(document.querySelector.getAttribute('data-login'))

    return header;
}

//Заголовок страницы
function createAppTitle(title, className = '') {
    return el('h1', title, { className: `container__title ${className}` });
}

//Подзаголовок страницы
function createAppSubtitle(title) {
    return el('h3', title, { className: 'container__text container__subtitle' });
}

//Синяя кнопка/ссылка
export function createBlueBtn(tag, text, idBtn, href, classImg = '', dataNum = '', dataBalance = '') {
    const btn = el(tag, { className: `btn ${classImg}` }, [
        el('span', text, { className: 'btn__span' })
    ]);

    if (tag === 'a') {
        btn.setAttribute('href', href);
    }
    if (idBtn !== '') btn.setAttribute('id', idBtn);
    if (dataNum !== '') btn.setAttribute('data-num', dataNum);
    if (dataBalance !== '') btn.setAttribute('data-balance', dataBalance);
    return  btn;
}

//Строка с номером счета и балансом
export function createBalance(subtitle, balance) {
    return el('div', { className: 'container__part container__part--balance' }, [
        el('h2', `№ ${subtitle}`, { className: 'bank-account__subtitle' }),
        el('div', { className: 'bank-account__balance' }, [
            el('p', 'Баланс', { className: 'container__text' }),
            el('p', `${balance} ₽`, { className: 'container__text container__text--thin' })
        ]),
    ]);
}

//Выпадающий список для сортировки
function createSelect() {
    return el('select', { className: 'bank-account__select' }, [
        el('option', 'Сортировка', { value: 'null', hidden: true }),
        el('option', 'По номеру', { value: 'number' }),
        el('option', 'По балансу', { value: 'balance' }),
        el('option', 'По последней транзакции', { value: 'transaction-date' }),
    ]);
}

//Создание/удаление текста ошибки
export function createErrorText(elem, text, container) {
    elem.classList.add('error-border');
    if (container.querySelector('.error-text')) return;

    container.classList.add('error-container')
    container.append(el('p', text, { className: 'error-text' }));

    elem.onfocus = function() {
       elem.classList.remove('error-border');
       container.querySelector('.error-text')?.remove(); 
    }
}

//Страница авторизации пользователя
export function createLogin() {
    const login = el('div', { className: 'container container__login' });
    setChildren(login, [
        el('div', { className: 'login' }, [
            createAppTitle('Вход в аккаунт', 'login__title'),
            el('form',  { className: 'form login__form', action: '#', }, [
                el('p', { className: 'form__block login__block', id: 'login-block' }, [
                    el('label', 'Логин', { className: 'form__label login__label', for: 'input-login'}),
                    el('input', { className: 'form__input login__input', id: 'input-login', placeholder: 'Placeholder', type: 'text', autocomplete: 'off' })
                ]),
                el('p', { className: 'form__block login__block login__block--margin', id: 'password-block' }, [
                    el('label', 'Пароль', { className: 'form__label login__label', for: 'input-password'}),
                    el('input', { type: 'password', className: 'form__input login__input', id: 'input-password', placeholder: 'Placeholder', autocomplete: 'off' }),
                ]),
                createBlueBtn('button', 'Войти', '', '', 'login__btn'),
            ]),
        ])
        
    ]);

    return login;
}

//Личный кабинет пользователя
export function createBankAccount() {
    const bankAccount = el('div', { className: 'container bank-account__container' });
    setChildren(bankAccount, [
        el('div', { className: 'container__top' }, [
            el('div', { className: 'container__part bank-account__part' },[
                el('div', { className: 'container__left' }, [
                    createAppTitle('Ваши счета'),
                    createSelect(),
                ]), 
                createBlueBtn('button', 'Создать новый счёт', 'new-account-btn', '', 'bank-account__open btn__img btn__img--plus'),
            ]), 
        ]),
    ]);

    return bankAccount;
}

//Создание таблицы
function createTable() {
    const tableBlock = el('div', { className: 'table' });
    setChildren(tableBlock, [
        el('table', { className: 'table__block' }, [
            el('thead', { className: 'table__thead' }, [
                el('tr', [
                    el('th', 'Счет отправителя', { className: 'table__th' }),
                    el('th', 'Счет получателя', { className: 'table__th table__th--to' }),
                    el('th', 'Сумма', { className: 'table__th' }),
                    el('th', 'Дата', { className: 'table__th' }),
                ])
            ]),
        ]),
    ])

    if (window.matchMedia("(max-width: 576px)").matches) {
        tableBlock.querySelector('.table__th--to').classList.add('none');
    }

    return tableBlock;
}

//Просмотр счета
export function viewingBankAccount(num) {
    const viewingAccount = el('div', { className: 'container view-account__container' });

    let storageValue = localStorage.getItem('accountNum');
    let arrNumbers = storageValue ? JSON.parse(storageValue) : [];

    setChildren(viewingAccount, [
        el('div', { className: 'container__top' }, [
            el('div', { className: 'container__part container__part--center' },[
                createAppTitle('Просмотр счёта'),
                createBlueBtn('a', 'Вернуться назад', 'back-to-accounts', '/accounts', 'btn__img btn__img--arrow'),
            ]),
        ]),
        el('ul', { className: 'view-account__list' }, [
            el('li', { className: 'view-account__item view-account__item--form' }, [
                el('h3', 'Новый перевод', { className: 'container__text container__subtitle view-account__subtitle' }),
                el('form', { className: 'form view-account__form', action: '#' }, [
                    el('p', { className: 'form__block view-account__block' }, [
                        el('label', 'Номер счёта получателя', { className: 'form__label view-account__label', for: 'input-num' }),
                        el('input', { className: 'form__input view-account__input', id: 'input-num', autocomplete: 'off', placeholder: 'Placeholder', list: 'number-view-account' }),
                        addHintAccountNumber(arrNumbers)
                    ]),
                    el('p', { className: 'form__block view-account__block' }, [
                        el('label', 'Сумма перевода', { className: 'form__label view-account__label', for: 'input-sum' }),
                        el('input', { className: 'form__input view-account__input', id: 'input-sum', placeholder: 'Placeholder' }),
                    ]),
                    el('p', { className: 'form__block view-account__block' }, [
                        createBlueBtn('button', 'Отправить', 'send-btn', '', 'view-account__btn btn__img btn__img--email', num),
                    ])                    
                ])
            ]),
            el('li', { className: 'view-account__item view-account__item--graph' }, [
                createGraphPage('Динамика баланса', num, 'my-chart-dynamic', 'graph-dynamic'),
            ]),
            el('li', { className: 'view-account__item view-account__item--table' }, [
                el('a', { href: `/accounts/${num}/history`, id: 'link-history' }, [
                    el('h3', 'История переводов', { className: 'container__text container__subtitle' }),
                ]),
                createTable(),
            ])
        ]),
    ]);

    return viewingAccount;
}

//Создание обертки для графика
function createGraphPage(title, id, myChartId, graphId) {
    const graphScript = el('script', { defer: true, src: 'https://cdn.jsdelivr.net/npm/chart.js' })
    document.head.append(graphScript);

    const graphBlock = el('div', { className: 'graph', id: graphId }, [
        el('a', { href: `/accounts/${id}/history`, id: 'balance-dynamics' }, [
            el('h3', title, { className: 'container__text container__subtitle' }),
        ]),
        el('div', [
            el('canvas', { id: myChartId }),
        ])
    ]);
    
    return graphBlock;
}

//Просмотр истории баланса
export function viewingBalanceHistory(num) {
    const viewingBalance = el('div', { className: 'container balance-account__container' });
    
    setChildren(viewingBalance, [
        el('div', { className: 'container__top' }, [
            el('div', { className: 'container__part container__part--center' },[
                createAppTitle('История баланса'),
                createBlueBtn('a', 'Вернуться назад', 'back-btn', `/accounts/${num}`, 'btn__img btn__img--arrow'),
            ]),
        ]),
        el('ul', { className: 'balance-account__list' }, [
            el('li', { className: 'balance-account__item balance-account__item--graph' }, createGraphPage('Динамика баланса', num, 'my-chart-dynamic', 'graph-dynamic')),
            el('li', { className: 'balance-account__item balance-account__item--graph' }, createGraphPage('Соотношение входящих исходящих транзакций', num, 'my-chart-expchange', 'graph-expchange')),
            el('li', { className: 'balance-account__item balance-account__item--table' }, [
                el('a', { href: `/accounts/${num}/history` }, [
                    el('h3', 'История переводов', { className: 'container__text container__subtitle' }),
                ]),
                createTable(),
            ]),
        ]),
    ]);

    return viewingBalance;
}

//Отрисовка списка существующих валют
export function renderCurrencyExchange(currencyArr, inputId) {
    const select = el('select', { className: 'currency__change', id: inputId });
    
    setChildren(select, [
        currencyArr.map(item => {
            return  el('option', item, { value: item });
        })
    ])
    return select;   
}

//Просмотр валютного обмена
export function viewingCurrencyExchange() {
    const viewingCurrency = el('div', { className: 'container currency__container' });

    setChildren(viewingCurrency, [
        createAppTitle('Валютный обмен', 'mb-56'),
        el('ul', { className: 'currency__list' }, [
            el('li', { className: 'currency__item currency__item--white currency__item--my' }, [
                createAppSubtitle('Ваши валюты'),
                el('ul', { className: 'currency__existing-list' }, [])
            ]),
            el('li', { className: 'currency__item currency__item--gray currency__item--change' }, [
                createAppSubtitle('Изменение курсов в реальном времени'),
                el('ul',{ className: 'currency__courses-list' }, [])
            ]),
            el('li', { className: 'currency__item currency__item--white currency__item--pb currency__item--exchange' }, [
                createAppSubtitle('Обмен валюты'),
                el('form', { className: 'currency__form' }, [
                    el('div', { className: 'currency__block'}, [
                        el('div', { className: 'currency__part' }, [
                            el('div', { className: 'currency__exchange' }, [
                                el('label', 'Из', { className: 'currency__label', for: 'input-from' }),
                            ]),
                            el('div', { className: 'currency__exchange' }, [
                                el('label', 'в', { className: 'currency__label', for: 'input-to' }),
                            ]),
                        ]),
                        el('div', { className: 'currency__sum' }, [
                            el('label', 'Сумма', { className: 'currency__label', for: 'input-sum' }),
                            el('input', { className: 'currency__input', id: 'input-sum', placeholder: 'Placeholder' })
                        ])
                    ]),
                    createBlueBtn('button', 'Обменять', 'exchange-btn', '', 'currency__btn', '', ''),

                ]),
            ]),
        ]),
    ]);

    return viewingCurrency;
}

//Просмотр карты банкоматов
export function viewingAtmOnMap() {
    const viewingMap = el('div', { className: 'container map__container' });
    setChildren(viewingMap, [
        createAppTitle('Карта банкоматов', 'mb-56'),
        el('div', { id: 'map' }, [])
    ]);  

    return viewingMap;
}
