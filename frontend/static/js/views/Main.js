import { addDateAsValue } from './Form.js';
const filter = ['All', 'Paid', 'Pending', 'Draft'];
let cards = window.localStorage.cardList && JSON.parse(window.localStorage.cardList) || null;

export default class Main {
  constructor() {
    this.DATA = cards ? cards : null;

    this.getData = async function getData() {
      await fetch('/data')
        .then(res => res.json())
        .then(data => {
          this.DATA = data;
          window.localStorage.cardList = JSON.stringify(data);
        })
        .catch(err => console.log(err))
    }
  }

  async render() {
    !cards && await this.getData();

    const key = await getKey(this.DATA);
    const data = await filterData(this.DATA, key);

    return `
    <main class="home">
      <div>
        <div class="head">
          <div class="left">
            <h1>Invoices</h1>
            <p>There are ${data.length} total invoices.</p>
          </div>

          <div class="right">
            <div class="filter">
              <button id="filter-button">
                <span>Filter<span> by status</span></span>
              </button>

              <ul class="filter">${filter.map((status, index) => {
      return `
              <li>
                <label for="filter${index + 1}">
                  <input type="radio" name="filter-radio" id="filter${index + 1}" ${status === 'All' ? 'checked' : ''} />
                  <span>${status}</span>
                </label>
              </li>
              `}).join('')}
              </ul>
            </div>

            <div class="add-new">
              <button>
                <span>New<span> Invoice</span></span>
              </button>
            </div>
          </div>
        </div>

        <div class="body">${card(data)}</div>
      </div>`;
  }
}

window.addEventListener('load', () => {
  // ==== Filter Btn ====
  window.addEventListener('click', (e) => {
    const filterList = document.querySelector('ul.filter');
    const filterBtn = document.querySelector('#filter-button');

    if (filterList && filterBtn) {

      if (e.target.id === filterBtn.id) {
        e.target.classList.toggle('active');
        e.target.nextElementSibling.classList.toggle('active');
      }
      // ==== Remove List
      if (filterList.classList.contains('active')
        && !e.target.matches('li')
        && !e.target.matches('label')
        && !e.target.matches('input')
        && e.target !== filterBtn) {

        filterList.classList.remove('active');
        filterBtn.classList.remove('active');
      }
    }

    // ==== Add New Btn ====
    if (e.target.matches('div.add-new button')) {
      const form = document.querySelector('form');
      form.classList.add('active');
      form.previousElementSibling.classList.add('active');
      form.previousElementSibling.style.cssText = `height: ${form.clientHeight}px`;
      document.body.style.cssText = 'overflow: hidden;';
    }
    // ==== Remove Form ====
    if (
      e.target.matches('a[data-link]') ||
      e.target.matches('main > div.active') ||
      e.target.matches('form > div:last-of-type button:nth-child(1)')
    ) {
      const form = document.querySelector('form');
      if (form) {
        removeForm(form);
      }
    }

    // ==== Card Click Animation ====
    if (e.target.matches('div.body a[data-link]')) {
      const main = e.target.closest('main');
      main.style.cssText = `
        overflow: hidden;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 600ms linear 0s, opacity 600ms ease 0s, var(--theme-transition);
      `
    }
    // ==============================

    // ==== delete invoice ====
    if (e.target.matches('div.invoice-buttons button:last-child')) {

      const shadow = document.createElement('div');
      shadow.className = 'shadow';

      const popup = document.createElement('div');
      popup.className = 'popup-modal';

      popup.innerHTML = `
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete invoice "#${document.querySelector('.id').innerText}"?</p>
        <p>This action cannot be undone.</p>
        <div>
          <button>Cancel</button>
          <button>Delete</button>
        </div>
      `;

      document.body.append(shadow, popup);
      setTimeout(() => popup.style.transform = 'translate(-50%, -50%) scale(1)', 1);
    }

    if (e.target.matches('div.popup-modal div button:last-child')) {
      const id = document.querySelector('h1.id').innerText;
      const list = JSON.parse(localStorage.cardList);

      document.querySelector('div.invoice-buttons button a').click();

      localStorage.cardList = JSON.stringify(list.filter(item => item.id !== id));
      removeModal(e.target, 100);
      setTimeout(() => reloadCards(list.filter(item => item.id !== id), 100), 650);
    }

    // ==== Remove Popup Modal ====
    if (e.target.matches('div.shadow') || e.target.matches('div.popup-modal div button:first-child')) {
      removeModal(e.target, 400);
    }
    // ========================
  });

  // ==== Form Submtter ====
  window.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.submitter.id === 'send') {
      const allInputs = e.target.querySelectorAll('[name]');
      let dataObj = null;
      allInputs.forEach(input => {
        input.value.trim() === '' && (input.style.borderColor = 'rgb(236, 87, 87)');

        if (input.value.trim() !== '' && input.id !== 'invoiceDate' && input.id !== 'paymentDate' && input.id !== 'total') {
          dataObj = makeInvoice(allInputs, 'Pending');
        }

        if (input.id === 'invoiceDate' || input.id === 'total' || input.id === 'paymentDate') {
          switch (input.id) {
            case 'invoiceDate': input.value = addDateAsValue(); break;
            case 'total': input.value = 0; break;
            case 'paymentDate': input.value = 1; break;
          }
        } else {
          input.value = '';
        }

      });

      if (dataObj !== null) {
        cards.unshift(dataObj);
        localStorage.cardList = JSON.stringify(cards);
        reloadCards(cards, 200);
        removeForm(e.target);
      }
    }

    if (e.submitter.id === 'draft') {
      const allInputs = e.target.querySelectorAll('[name]');
      const dataObj = makeInvoice(allInputs, 'Draft');
      console.log(dataObj)
    }
  });
  // =============================

  // =====================

  // ==== Card Animation ====
  // const card = document.querySelectorAll('div.card');
  // for (const [index, item] of card.entries()) {
  //   item.style.opacity = 1;
  //   item.style.transition = `opacity 300ms linear ${index * 200} ms, var(--theme - transition)`;
  // }

  // setTimeout(() => {
  //   for (const item of card) {
  //     item.removeAttribute('style');
  //   }
  //   document.styleSheets[1].insertRule('div.card.card {opacity: 1}', 1);
  // }, 2000);
  // ========================
});

function getKey(data) {
  let span = 'All';
  window.addEventListener('click', (e) => {
    if (e.target.matches('ul.filter input')) {
      span = e.target.nextElementSibling.innerText;
      switch (span) {
        case 'Paid': filterData(data, span);
          break;
        case 'Pending': filterData(data, span);
          break;
        case 'Draft': filterData(data, span);
          break;
        default: filterData(data, span);
          break;
      }
    }
  });
  return span;
}

async function filterData(data, key) {
  const filter = key === 'All' ? data : await data.filter(card => card.status === key);

  changeData(filter);

  return filter;
}

function changeData(data) {
  window.addEventListener('change', (e) => {
    if (e.target.closest('ul') && e.target.closest('ul').matches('.filter')) {
      document.querySelector('div.left p').innerHTML = `There are ${data.length} total invoices.`;

      reloadCards(data, 300);
    }
  })
}

function card(data) {
  return data.map(card => {
    return `
    <a href="/invoice/${card.id}" data-link>
      <div class="card">
        <div class="card-left">
          <h2 class="id">${card.id}</h2>
          <div class="date">${card.paymentDate}</div>
          <div class="price">${card.itemList.length > 1 ? card.itemList.reduce((a, { total }) => a + total, 0).toLocaleString() : card.itemList[0].total.toLocaleString()}</div>
        </div>
        <div class="card-right">
          <div class="name">${card.clientDetails.name}</div>
          <div class="card-btn${card.status === 'Pending' ? ' pending' : card.status === 'Draft' ? ' draft' : ''}">${card.status}</div>
        </div>
      </div>
    </a>`
  }).join('');
}

const monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function getDate(date) {
  const day = date.split('-')[2];
  const month = monthes[Number(date.split('-')[1]) - 1];
  const year = date.split('-')[0];
  return `${day} ${month} ${year}`;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return `${result.getDate()} ${monthes[result.getMonth()]} ${result.getFullYear()}`;
}

function gitRandomId() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const twoLetters = [];
  for (let i = 0; i < 2; i++) {
    const lttersGen = Math.ceil(Math.random() * (letters.length - 1));
    !twoLetters.includes(letters[lttersGen]) && twoLetters.push(letters[lttersGen]);
  }

  const fourDigits = [];
  for (let i = 0; i < 4; i++) {
    const digitssGen = Math.ceil(Math.random() * (digits.length - 1));
    fourDigits.push(digits[digitssGen]);
  }

  return twoLetters.join('') + fourDigits.join('');
}

function makeInvoice(allInputs, status) {
  const dataObj = {
    id: gitRandomId(),
    status
  };

  allInputs.forEach(input => {
    switch (input.id) {
      // description
      case 'description': dataObj.description = input.value.trim(); break;
      // dates
      case 'invoiceDate': dataObj.invoiceDate = getDate(input.value.trim()); break;
      case 'paymentDate': dataObj.paymentDate = addDays(dataObj.invoiceDate, Number(input.value.trim())); break;
      // fromAddress
      case 'street': dataObj.fromAddress = [input.value.trim()]; break;
      case 'city': dataObj.fromAddress[1] = input.value.trim(); break;
      case 'post': dataObj.fromAddress[2] = input.value.trim(); break;
      case 'country': dataObj.fromAddress[3] = input.value.trim(); break;
      // clientDetails
      case 'client-name': dataObj.clientDetails = { name: input.value.trim() }; break;
      case 'client-email': dataObj.clientDetails.mail = input.value.trim(); break;
      case 'client-adress': dataObj.clientDetails.addrees = [input.value.trim()]; break;
      case 'client-city': dataObj.clientDetails.addrees[1] = input.value.trim(); break;
      case 'client-post': dataObj.clientDetails.addrees[2] = input.value.trim(); break;
      case 'client-country': dataObj.clientDetails.addrees[3] = input.value.trim(); break;
      // clientDetails
      case 'item-name':
        if (Number(input.getAttribute('data-count')) === 0) dataObj.itemList = [{ name: input.value.trim() }];
        else dataObj.itemList[Number(input.getAttribute('data-count'))] = { name: input.value.trim() };
        break;
      case 'item-qty': dataObj.itemList[Number(input.getAttribute('data-count'))].qty = Number(input.value.trim()); break;
      case 'item-price': dataObj.itemList[Number(input.getAttribute('data-count'))].price = Number(input.value.trim()); break;
      case 'total': dataObj.itemList[Number(input.getAttribute('data-count'))].total = Number(input.value.trim()); break;
    }
  });

  return dataObj;
}

function removeForm(formEl) {
  formEl.removeAttribute('class');
  formEl.previousElementSibling.removeAttribute('class');
  formEl.previousElementSibling.removeAttribute('style');
  document.body.removeAttribute('style');
}

function reloadCards(data, duration) {
  const body = document.querySelector('div.body');
  body.style.cssText = 'transform: translateY(-10rem); opacity: 0';

  setTimeout(() => {
    body.innerHTML = card(data);
    body.removeAttribute('style');
  }, duration);
}

function removeModal(element, transition) {
  const modal = element.matches('div') ? element.nextElementSibling : element.closest('.popup-modal');

  modal.style.transform = 'translate(-50%, -50%) scale(0)';
  modal.style.transition = `transform ${transition}ms ease 0s`;
  setTimeout(() => {
    modal.previousElementSibling.remove();
    modal.remove();
  }, 400);
}