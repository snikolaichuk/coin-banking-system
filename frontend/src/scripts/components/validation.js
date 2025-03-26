import { validate } from "validate.js";
import cardValidator from "card-validator";
import { createErrorText } from "../view";

//Валидация формы авторизации пользователя
export function validationLoginForm(value) {
    const inputForm = {
        value: value,
    };

    const validationLogin = {
        value: {
            presence: true,
            length: {
                minimum: 6,
                maximum: 30,
            },
            format: {
                pattern: /^\s*[a-zA-Z0-9]+$/,
                message: 'cannot contain spaces'
            }
        },
        
    };

    const validationResult = validate(inputForm, validationLogin);
    if (validationResult) {
        return false;
    } else {
        return true;
    }

}

//Валидация формы перевода средств
export function validationTransferForm(value, min) {
    const inputForm = {
        value: value,
    };

    const validationNum = {
        value: {
            presence: true,
            length: {
                minimum: min,
                maximum: 30,
            },
            format: {
                pattern: /^\d+\.?\d*$/,
                message: 'cannot contain spaces'
            }
        },
        
    };

    const validationResult = validate(inputForm, validationNum);
    if (validationResult) {
        return false;
    } else {
        return true;
    }
}

export function validationCardNum(numInput) {
    return cardValidator.number(numInput.value).isValid;
}
