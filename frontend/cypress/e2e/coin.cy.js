/// <reference types="cypress" />

describe('Приложение Coin', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/');
    })
    
    it('Ошибка при неверном логине', () => {
        cy.get('#input-login').type('popopo');
        cy.get('#input-password').type('skillbox');
        cy.contains('Войти').click();
        cy.get('#input-login').should('have.class', 'error-border');
        cy.get('#login-block').children('.error-text');
    });

    it('Ошибка при неверном пароле', () => {
        cy.get('#input-login').type('developer');
        cy.get('#input-password').type('popopo');
        cy.contains('Войти').click();
        cy.get('#input-password').should('have.class', 'error-border');
        cy.get('#password-block').children('.error-text');
    });

    it('Успешная авторизация', () => {
        cy.get('#input-login').type('developer');
        cy.get('#input-password').type('skillbox');
        cy.contains('Войти').click();
        cy.url().should('include', '/accounts');
        cy.get('.bank-account__list').should('be.not.empty');
    });

    it('Проверяю создается ли новый счет', () => {
        cy.get('#input-login').type('developer');
        cy.get('#input-password').type('skillbox');
        cy.contains('Войти').click();

        cy.get('.bank-account__list li').its('length').then((length) => {
            cy.get('#new-account-btn').click();
            cy.get('.bank-account__list > li').should('have.length', `${length + 1}`);
        })
    });

    it('Проверяю страницу конкретного счета', () => {
        cy.get('#input-login').type('developer');
        cy.get('#input-password').type('skillbox');
        cy.contains('Войти').click();

        //кнопка Открыть
        cy.get('.article__btn').first().invoke('attr', 'data-num').then((num) => {
            cy.get('.article__btn').first().click();
            cy.url().should('include', `/accounts/${num}`);
            cy.get('.bank-account__subtitle').should('have.text', `№ ${num}`);

            cy.get('#link-history').click();
            cy.url().should('include', `/accounts/${num}/history`);

            //кнопка Вернуться назад
            cy.get('#back-btn').click();
            cy.url().should('include', `/accounts/${num}`);
            
        });

        //кнопка Вернуться назад
        cy.get('#back-to-accounts').click();
        cy.url().should('include', '/accounts');
    });

    it('Проверяю страницу с яндекс картой', () => {
        cy.get('#input-login').type('developer');
        cy.get('#input-password').type('skillbox');
        cy.contains('Войти').click();

        cy.get('#link-atms').click();
        cy.url().should('include', '/atms');
        cy.get('#map').children('ymaps');
    });

    it('Проверяю страницу с валютой', () => {
        cy.get('#input-login').type('developer');
        cy.get('#input-password').type('skillbox');
        cy.contains('Войти').click();

        cy.get('#link-currency').click();
        cy.url().should('include', '/currency');
        cy.get('.currency__list > li').should('have.length', 3);
    })

    it('Проверяю кнопку Выйти', () => {
        cy.get('#input-login').type('developer');
        cy.get('#input-password').type('skillbox');
        cy.contains('Войти').click();

        cy.get('#link-exit').click();
        cy.url().should('include', '/');
        cy.get('.login').children('form');
    })
})