const filter = ['All', 'Paid', 'Pending', 'Draft'];

export default class Main {
  constructor() {
    this.DATA;

    this.getData = async function getData() {
      await fetch('http://1.1.1.4:5500/data')
        .then(res => res.json())
        .then(data => this.DATA = data)
        .catch(err => console.log(err))

      console.log('fetch data')
    }
  }

  async render() {
    await this.getData();

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
      form.style.cssText = `height: ${document.documentElement.clientHeight - 80}px`;

      const div = form.previousElementSibling;
      div.classList.add('active');
      div.style.cssText = `height: 0`;
    }
    // ==== Remove Form ====
    if (e.target.matches('main > div.active') || e.target.matches('form > div:last-of-type button:nth-child(1)')) {
      e.preventDefault();
      const form = document.querySelector('form');
      const div = form.previousElementSibling;

      form.classList.remove('active');
      div.classList.remove('active');

      div.removeAttribute('style');
      setTimeout(() => form.removeAttribute('style'), 500);
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
  });

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

  changePage(filter);

  return filter;
}


function changePage(data) {
  window.addEventListener('change', () => {

    document.querySelector('div.left p').innerHTML = `There are ${data.length} total invoices.`;

    const body = document.querySelector('div.body');
    body.style.cssText = 'transform: translateY(-10rem); opacity: 0';

    setTimeout(() => {
      body.innerHTML = card(data);
      body.removeAttribute('style');
    }, 500);
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
          <div class="price">${card.itemList.length > 1 ? card.itemList.reduce((a, c) => a.total + c.total).toLocaleString() : card.itemList[0].total.toLocaleString()}</div>
        </div>
        <div class="card-right">
          <div class="name">${card.clientDetails.name}</div>
          <div class="card-btn${card.status === 'Pending' ? ' pending' : card.status === 'Draft' ? ' draft' : ''}">${card.status}</div>
        </div>
      </div>
    </a>`
  }).join('');
}