import { renderTransactionsList } from "../components/table";

test('Функция renderTransactionsList возвращает тело таблицы', () => {
    const arr = [
        {
            "amount": 1234,
            "date": "2021-09-11T23:00:44.486Z",
            "from": "61253747452820828268825011",
            "to": "74213041477477406320783754"
        },
        {
            "amount": 4321,
            "date": "2021-09-11T23:00:44.486Z",
            "from": "74213041477477406320783754",
            "to": "61253747452820828268825011",
        }
    ];
    const el = renderTransactionsList(arr);
    const allTr = el.querySelectorAll('tr');

    expect(el).toBeInstanceOf(HTMLTableSectionElement);
    expect(allTr.length).toBe(arr.length);

    for (let i = 0; i < allTr.length; i++) {
        const sum = allTr[i].querySelector('.table__td--sum').textContent;

        expect(allTr[i].querySelector('.table__td--from').textContent).toBe(arr[i].from);
        expect(allTr[i].querySelector('.table__td--to').textContent).toBe(arr[i].to);
        expect(+sum.slice(0, -1)).toBe(arr[i].amount);
    }
})