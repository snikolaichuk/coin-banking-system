import { el } from "redom";

export function renderListSkeleton() {
    const list = el('ul', { className: 'bank-account__list' });

    for (let i = 0; i < 3; i++) {
        const li = el('li', { className: 'bank-account__item skeleton-list skeleton' });
        list.append(li);
    }

    return list;
}

export function renderBalanceSkeleton() {
    return el('div', { className: 'container__part container__part--balance' }, [
        el('h2', { className: 'bank-account__subtitle skeleton-balance skeleton' }),
        el('div', { className: 'bank-account__balance skeleton-balance skeleton' }),
    ])
}

export function renderTableSkeleton() {
    const tbody = el('tbody', { className: 'tbody' });

    for (let i = 0; i < 3; i++) {
        const tr = el('tr', { className: 'skeleton-table skeleton' });
        tbody.append(tr);
    }
    
    return tbody;
}

export function renderGraphSkeleton() {
    return el('div', { className: 'skeleton skeleton-graph chart-container' });
}

export function renderCurrencySkeleton() {
    const list = el('ul', { className: 'currency__existing-list' });

    for (let i = 0; i < 3; i++) {
        const li = el('li', { className: 'currency__existing__item skeleton-currency skeleton' });
        list.append(li);
    }

    return list;
}