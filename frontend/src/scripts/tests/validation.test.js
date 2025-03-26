import { validationLoginForm, validationTransferForm } from '../components/validation';

test('Проверка формы авторизации на корректные значения', () => {
    expect(validationLoginForm('developer')).toBe(true);
    expect(validationLoginForm('de veloper')).toBe(false);
});

test('Проверка форм с суммами на корректные значения', () => {
    expect(validationTransferForm('3500')).toBe(true);
    expect(validationTransferForm('3 500')).toBe(false);
    expect(validationTransferForm('-3500')).toBe(false);
})