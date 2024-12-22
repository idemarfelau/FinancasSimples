const tbody = document.querySelector('tbody');
const descItem = document.querySelector('#desc');
const amount = document.querySelector('#amount');
const type = document.querySelector('#type');
const btnNew = document.querySelector('#btnNew');
const btnEdit = document.querySelector('#btnEdit');

const incomes = document.querySelector('.incomes');
const expenses = document.querySelector('.expenses');
const totalGeral = document.querySelector('.total');

let items;
let index2; // Certifique-se de que a variável index está definida

btnNew.onclick = () => {

    alert('insert descricao:'+descItem.value);

    if (descItem.value == '' || amount.value == '' || type.value == '') {
        alert('Preencha todos os campos');
        return;
    }
    items.push({
        desc: descItem.value,
        amount: amount.value,
        type: type.value
    });

    setItensDb();
    loadItens();

    descItem.value = '';
    amount.value = '';
    type.value = '';
    descItem.focus();

    // Mostrar btnNew e ocultar btnEdit
    btnNew.style.display = 'inline-block';
    btnEdit.style.display = 'none';

    return;
}

btnEdit.onclick = () => {

    alert('alter descricao campo:'+descItem.value+' index:'+index2);
    alert('alter descricao:'+items[index2].desc);

    if (descItem.value == '' || amount.value == '' || type.value == '') {
        alert('Preencha todos os campos');
        return;
    }

    items[index2].desc = descItem.value;
    items[index2].amount = amount.value;
    items[index2].type = type.value;

    setItensDb();
    loadItens();

    descItem.value = '';
    amount.value = '';
    type.value = '';
    descItem.focus();

    // Mostrar btnNew e ocultar btnEdit
    btnNew.style.display = 'inline-block';
    btnEdit.style.display = 'none';

    return;
}

function insertItem(item, index) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${item.desc}</td>
        <td style="text-align: right;">R$ ${(Number(item.amount)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td class="columnType">
          ${item.type === "Entrada"
            ? '<i class="bx bxs-chevron-up-circle"></i>'
            : '<i class="bx bxs-chevron-down-circle"></i>'
        }
        </td>
        <td class="columnAction">
            <button onclick="deleteItem(${index})">
                <i class="bx bx-trash"></i>
            </button>
        </td>
            <td class="columnAction">
            <button onclick="editItem(${index})">
                <i class="bx bx-edit-alt"></i>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
}

function deleteItem(index) {
    items.splice(index, 1);
    setItensDb();
    loadItens();
}

function editItem(index) {
alert('descrição: '+items[index].desc);
    index2 = index;
    document.querySelector('#desc').value = items[index].desc;
    document.querySelector('#amount').value = items[index].amount;
    document.querySelector('#type').value = items[index].type;

    // Mostrar btnEdit e ocultar btnNew
    btnNew.style.display = 'none';
    btnEdit.style.display = 'inline-block';
}

function loadItens() {
    items = getItensDb();
    tbody.innerHTML = '';
    items.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotals();
}

function getTotals() {
    const amountIncomes = items
    .filter((item) => item.type === 'Entrada')
    .map((transaction) => Number(transaction.amount));
    
    const amountExpenses = items
    .filter((item) => item.type === 'Saida')
    .map((transaction) => Number(transaction.amount));
    
    const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);
    
    const totalExpenses = amountExpenses
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);
    
    const total = (totalIncomes - totalExpenses).toFixed(2);

    incomes.innerHTML = `${totalIncomes}`;
    expenses.innerHTML = `${totalExpenses}`;
    totalGeral.innerHTML = `${total}`;

    if (total < 0) {
        totalGeral.style.color = 'red';
    } else {
        totalGeral.style.color = 'blue';
    }

};

const getItensDb = () => JSON.parse(localStorage.getItem('db_items')) ?? [];
const setItensDb = () =>
    localStorage.setItem('db_items', JSON.stringify(items));

loadItens();