import { addHintAccountNumber } from "../components/datalist";

test('Функция addHintAccountNumber должна вернуть datalist элемент с номерами из localStorage', () => {
    const arrNum = [
        "20704815705045481281766781", 
        "82328143671865236805454654", 
        "35283088663841558014777473"
    ];
    const el = addHintAccountNumber(arrNum);
    const expectedOptions = el.querySelectorAll('option');

    expect(el).toBeInstanceOf(HTMLDataListElement);
    expect(expectedOptions.length).toBe(arrNum.length);
    for (let i = 0; i < expectedOptions.length; i++) {
        expect(expectedOptions[i].value).toBe(arrNum[i]);
    }
})