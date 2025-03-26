import { renderBankAccountList } from "../components/render-accounts";

test('Функция renderBankAccountList возвращает список счетов', () => {
    const arr = [
        {
            "account": "74213041477477406320783754",
            "balance": 2345,
            "transactions": [
                {
                    "amount": 1234,
                    "date": "2021-09-11T23:00:44.486Z",
                    "from": "61253747452820828268825011",
                    "to": "74213041477477406320783754"
                }
            ]
        }
    ]
    const  el = renderBankAccountList(arr);
    const items = el.querySelectorAll('li');

    expect(el).toBeInstanceOf(HTMLUListElement);
    expect(items.length).toBe(arr.length);
    for (let i = 0; i < items.length; i++) {
        const balance = items[i].querySelector('.article__balance').textContent;

        expect(items[i].querySelector('.article__title').textContent).toBe(arr[i].account);
        expect(+balance.slice(0, -1)).toBe(arr[i].balance);
    }

});