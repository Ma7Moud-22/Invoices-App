import Aside from './Aside.js';
const sideBar = new Aside;

export default class Invoice {
  constructor(params) {
    this.params = params;
    document.title = `Invoices App | #${this.params.id}`;

    if (!document.head.querySelector('link[href="/static/css/print.css"]')) {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/static/css/print.css';
      document.head.append(link);
    }
  }

  async getHtml() {
    let card = JSON.parse(localStorage.cardList).find(item => item.id === this.params.id);

    return `
    ${sideBar.render()}
    <main>
      <div class="invoice-details">
        <a href="/" data-link="">Go back</a>
        <div class="status">
          <div>
            <div>Status</div>
            <div class="card-btn${card.status === 'Pending' ? ' pending' : card.status === 'Draft' ? ' draft' : ''}">${card.status}</div>
          </div>

          ${invoicesButtons(card.status)}
        </div>

        <div class="details">
          <div class="item-info">
            <h1 class="id">${card.id}</h1>
            <span>${card.description}</span>
          </div>

          <address>${card.fromAddress.map(item => `<span>${item}</span>`).join('')}</address>

          <div class="date-payment">
            <div>
              <span>Invoice Date</span>
              <div>${card.invoiceDate}</div>
            </div>
            <div>
              <span>Payment Due</span>
              <div>${card.paymentDate}</div>
            </div>
          </div>

          <address>
            <span>Bill to</span>
            <div>${card.clientDetails.name}</div>
            ${card.clientDetails.addrees.map(item => item && `<span>${item}</span>`).join('')}
          </address>

          <div class="mail">
            <span>Sent to</span>
            ${card.clientDetails.mail && `<div>${card.clientDetails.mail}</div>`}
          </div>

          <table class="service">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>QTY.</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${card.itemList.map(item => {
      return `<tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td class="price">${item.price.toLocaleString()}</td>
                <td class="price">${item.total.toLocaleString()}</td>
              </tr>`
    }).join('')}</tbody>
            <tfoot>
              <tr>
                <th colspan="2">Amount Due</th>
                <td colspan="2" class="price">${card.itemList.length > 1 ? card.itemList.reduce((a, { total }) => a + total, 0).toLocaleString() : card.itemList[0].total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      ${invoicesButtons(card.status)}
    </main>
    `;
  }
}

window.addEventListener('load', () => {
  window.addEventListener('click', (e) => {
    if (e.target.matches('div.invoice-details a[data-link]')) {
      const main = e.target.closest('main');
      main.style.cssText = `
        transform: translateX(-100%);
        opacity: 0;
        transition: transform 600ms linear 0s, opacity 600ms ease 0s, var(--theme-transition);
      `;
    }

    // ==== Mark As Paid ====
    if (e.target.matches('div.invoice-buttons button:last-child:not(:nth-child(2))')) {
      const cardId = document.querySelector('.id').innerText;
      const data = JSON.parse(localStorage.cardList);
      const card = data.find(card => card.id === cardId);

      card.status = 'Paid';
      localStorage.cardList = JSON.stringify(data);

      const cardStatus = document.querySelector('div.card-btn');
      cardStatus.innerHTML = 'Paid';
      cardStatus.classList.remove('pending');
      cardStatus.classList.remove('draft');

      e.target.style.cssText = `
        opacity: 0;
        transition: opacity 200ms ease 0s, var(--theme-transition);
      `;
      setTimeout(() => e.target.remove(), 200);
    }
  });
});

function invoicesButtons(status) {
  return `
  <div class="invoice-buttons">
    <button>Edite</button>
    <button><a href="/" data-link>Delete</a></button>
    ${status !== 'Paid' ? '<button>Mark As Paid</button>' : ''}
  </div>
  `;
}
