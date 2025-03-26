import { el, setChildren } from "redom";

//Добавление номеров счета в option
export function addHintAccountNumber(arrNums) {
    let datalist = el('datalist', { id: 'number-view-account' });
        setChildren(datalist, [
            arrNums.map(num => {
                return  el('option', { value: num });
            })
        ])
    return datalist;
}