export default class Form {
  render() {
    return `
    <form action="#">
      <h2>Create Invoice</h2>

      <div>
        <fieldset>
          <legend>Bill From</legend>
          <div class="full">
            <label for="street">Street Adress</label>
            <input type="text" name="street" id="street" />
          </div>
          <div class="half">
            <label for="city">City</label>
            <input type="text" name="city" id="city" />
          </div>
          <div class="half">
            <label for="post">Post Code</label>
            <input type="number" name="post" id="post" />
          </div>
          <div class="full">
            <label for="country">Country</label>
            <input type="text" name="country" id="country" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Bill To</legend>
          <div class="full">
            <label for="client-name">Client's Name</label>
            <input type="text" name="client-name" id="client-name" />
          </div>
          <div class="full">
            <label for="client-email">Client's Email</label>
            <input
              type="email"
              name="client-email"
              id="client-email"
              placeholder="e.g. email@example.com"
            />
          </div>
          <div class="full">
            <label for="client-adress">Street Adress</label>
            <input type="text" name="client-adress" id="client-adress" />
          </div>
          <div class="half">
            <label for="client-city">City</label>
            <input type="text" name="client-city" id="client-city" />
          </div>
          <div class="half">
            <label for="client-post">Post Adress</label>
            <input type="number" name="client-post" id="client-post" />
          </div>
          <div class="full">
            <label for="client-country">Country</label>
            <input type="text" name="client-country" id="client-country" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Invoice</legend>
          <div class="half">
            <label for="date">Invoice Date</label>
            <input type="date" name="date" id="date" />
          </div>
          <div class="half">
            <label for="payment">Payment Term</label>
            <div>
              <select name="payment" id="payment">
                <option value="1">Net 1 Day</option>
                <option value="7">Net 7 Day</option>
                <option value="14">Net 14 Day</option>
                <option value="30">Net 30 Day</option>
              </select>
            </div>
          </div>
          <div class="full">
            <label for="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              placeholder="e.g. Graphic Design Service"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>ItemList</legend>
          <div class="full">
            <button class="add-new-item">Add New Item</button>
          </div>
        </fieldset>
      </div>

      <div>
        <button>Discard</button>
        <button id="draft">Save as Draft</button>
        <button id="send">Save & Send</button>
      </div>
    </form>
    </main>
    `;
  }
}

window.addEventListener('load', () => {
  // ==== Blur & Focus Events ====
  window.addEventListener('focusin', (e) => {
    if (e.target.localName === 'input') {
      e.target.addEventListener('blur', (e) => {
        e.target.value.trim() === '' ? (e.target.style.borderColor = 'rgb(236 87 87)') : e.target.removeAttribute('style');
      });

      e.target.addEventListener('focus', (e) => {
        e.target.value.trim() === '' ? (e.target.style.borderColor = 'hsla(var(--accent-clr) 67% / 1)') : e.target.removeAttribute('style');
      });
    }
  });

  // ==== Form Submtter ====
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {

    const allInputs = document.querySelectorAll('form input');
    e.preventDefault();
    if (e.submitter.id === 'send') {

      // console.log(allInputs.filter(input => input.value.trim() !== '' ? true : false))

      const obj = {
        id: gitRandomId(),
        description: getValue('input#description'),
        status: "Paid",
        invoiceDate: getDate(getValue('input#date')),
        paymentDate: addDays(getValue('input#date'), +getValue('select#payment')),
        fromAddress: [getValue('input#street'), getValue('input#city'), getValue('input#post'), getValue('input#country')],
        clientDetails: {
          name: getValue('input#client-name'),
          mail: getValue('input#client-email'),
          addrees: [getValue('input#client-adress'), getValue('input#client-city'), getValue('input#client-post'), getValue('input#client-country')]
        },
        itemList: [
          {
            name: "Brand Guidelines",
            qty: 1,
            price: 1800.9,
            total: 1800.9
          }
        ]
      };

      // console.log(obj)

    }

    if (e.submitter.id === 'draft') {
      console.log(e)
    }
  });
  // =============================

  // ==== Add New Item ====
  window.addEventListener('click', (e) => {
    if (e.target.matches('.add-new-item')) {
      e.preventDefault();
      const fieldset = document.createElement('fieldset');
      fieldset.classList = 'item-set';

      fieldset.innerHTML =
        `<div class="full">
          <label for="item-name">Item Name</label>
          <input type="text" name="item-name" id="item-name" />
        </div>
        <div>
          <label for="item-qty">Qty.</label>
          <input type="number" name="item-qty" id="item-qty" />
        </div>
        <div>
          <label for="item-price">Price</label>
          <input type="number" name="item-price" id="item-price" step=".01" />
        </div>
        <div>
          <label for="total">Total</label>
          <input type="number" name="total" id="total" disabled value="0" />
        </div>
        <button id="remove-item">
          <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
              fill-rule="nonzero"
            ></path>
          </svg>
        </button>`;

      e.target.before(fieldset);
    }
    // ==== Remove Item ====
    if (e.target.matches('#remove-item')) {
      e.preventDefault();
      e.target.parentElement.remove();
    }
  });
  // ======================

  // ==== Math ====
  window.addEventListener('input', (e) => {
    const qtyValue = document.getElementById('item-qty') && Number(document.getElementById('item-qty').value),
      price = document.getElementById('item-price') && Number(document.getElementById('item-price').value),
      total = document.getElementById('total');

    if (qtyValue && price && (e.target.id === 'item-price' || e.target.id === 'item-qty')) {
      total.value = qtyValue * price;
    }
  });
});


function getValue(selector) {
  return document.querySelector(selector).value.trim();
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