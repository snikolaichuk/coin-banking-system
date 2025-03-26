//Авторизация пользователя
export async function postLogin(login, password) {
    return await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(res => res.json());
}

//Получение списка счетов
export async function getAccessToAccountsList(token) {
    return await fetch('http://localhost:3000/accounts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${token}`,
        },
    }).then((res) => res.json()).then(data => data.payload);
}

//Создание нового счета
export async function postNewAccount(token) {
    return await fetch('http://localhost:3000/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${token}`,
        },
    }).then(res => res.json().then(data => data.payload));
}

//Подробная информация о счете
export async function getAccessToAccountItem(token, id) {
    return await fetch(`http://localhost:3000/account/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${token}`,
        },
    }).then(res => res.json()).then(data => data.payload);
}

//Новый перевод
export async function postNewTransaction(token, from, to, amount) {
    return await fetch('http://localhost:3000/transfer-funds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
            from,
            to,
            amount,
        }),
    }).then(res => res.json())
}

//Список всех валют
export async function getAllCurrencies() {
    return await fetch('http://localhost:3000/all-currencies', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(data => data.payload);
}

//Список валют конкретного пользователя
export async function getCurrenciesItem(token) {
    return await fetch('http://localhost:3000/currencies', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${token}`,
        }
    }).then(res => res.json()).then(data => data.payload);
}

//Совершение валютного обмена
export async function postCurrencyExchange(token, from, to, amount) {
    return await fetch('http://localhost:3000/currency-buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${token}`
        },
        body: JSON.stringify({
            from,
            to,
            amount,
        }),
    }).then(res => res.json())
}

//Координаты банкоматов
export async function getBanksPoint() {
    return await fetch('http://localhost:3000/banks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => data.payload)
}