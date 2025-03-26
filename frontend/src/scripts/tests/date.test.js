import { dateFormat } from "../components/date";

test('Проверка на соответствие формата даты', () => {
    expect(dateFormat(new Date(0))).toBe('01.01.1970')
})