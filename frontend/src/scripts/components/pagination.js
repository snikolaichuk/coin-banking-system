import { createBlueBtn } from "../view";

export function createPagination() {
    const table = document.querySelector('.table');
    const quantityTrOnPage = 25;
    let currentPage = 0;
    const trAll = Array.from(table.getElementsByTagName('tr')).slice(1);

    function showPage(page) {
        const startIndex = page * quantityTrOnPage;
        const endIndex = startIndex + quantityTrOnPage;
        
        trAll.forEach((item, index) => {
            item.classList.toggle('table__hidden', index < startIndex || index >= endIndex);
        });
        updateActiveButtonStates();
    }

    function createPageButtons() {
        const totalPages = Math.ceil(trAll.length / quantityTrOnPage);
        const paginationContainer = document.createElement('div');
        const paginationDiv = document.querySelector('.main').appendChild(paginationContainer);
        paginationDiv.classList.add('pagination');
        const paginationBlock = document.createElement('div');
        paginationBlock.classList.add('pagination__block');

        const leftPageBtn = createBlueBtn('button', '', 'btn-pagin-left', '', 'btn__pagin btn__img--left' , '', '');
        const rigthPageBtn = createBlueBtn('button', '', 'btn-pagin-rigth', '', 'btn__pagin btn__img--rigth' , '', '');
        const intervalPageBtn = createBlueBtn('button', '...', 'btn-pagin-interval', '', 'btn__pagin', '', '');
        const lastPageBtn = createBlueBtn('button', `${totalPages - 1}`, 'btn-pagin-last', '', 'btn__pagin', '', '');

        paginationDiv.appendChild(leftPageBtn);
        paginationDiv.appendChild(paginationBlock);
        paginationDiv.appendChild(intervalPageBtn);
        paginationDiv.appendChild(lastPageBtn);
        paginationDiv.appendChild(rigthPageBtn);

        for (let i = 0; i < totalPages; i++) {
            const pageBtn = createBlueBtn('button', `${i + 1}`, 'btn-pagin', '', 'btn__pagin' , '', '');
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
                updateActiveButtonStates();
            });
            paginationBlock.appendChild(pageBtn);
        }

        if (totalPages <= 1) paginationContainer.classList.add('none');
        table.appendChild(paginationContainer);

        for (let i = 0; i < paginationBlock.childNodes.length; i++) {
            if (i > 2) {
                paginationBlock.childNodes[i].classList.add('none');
            }
        }

        leftPageBtn.addEventListener('click', () => {
            console.log('Переключение на предыдущую страницу');
        })

        rigthPageBtn.addEventListener('click', () => {
            console.log('Переключение на следующую страницу');
        })

        intervalPageBtn.addEventListener('click', () => {
            console.log('Показать все страницы');
        })

        lastPageBtn.addEventListener('click', () => {
            currentPage = totalPages - 1;
            showPage(currentPage);
            console.log(currentPage);
            updateActiveButtonStates();
        });
        
    }

    function updateActiveButtonStates() {
        const pageButtons = document.querySelectorAll('.pagination button');
        pageButtons.forEach((button, index) => {
            if (index === currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    createPageButtons();
    showPage(currentPage);
}