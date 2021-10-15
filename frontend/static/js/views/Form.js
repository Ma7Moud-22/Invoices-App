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
                <option value="Net 1 Day">Net 1 Day</option>
                <option value="Net 7 Day">Net 7 Day</option>
                <option value="Net 14 Day">Net 14 Day</option>
                <option value="Net 30 Day">Net 30 Day</option>
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
        <button>Save as Draft</button>
        <button>Save & Send</button>
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
        e.target.value === '' ? (e.target.style.borderColor = 'rgb(236 87 87)') : e.target.removeAttribute('style');
      });

      e.target.addEventListener('focus', (e) => {
        e.target.value === '' ? (e.target.style.borderColor = 'hsla(var(--accent-clr) 67% / 1)') : e.target.removeAttribute('style');
      });
    }
  });
  // =============================

  // ==== Add New Item ====
  const addNewItemBtn = document.querySelector('.add-new-item');
  const fieldset = document.createElement('fieldset');
  if (addNewItemBtn) {
    addNewItemBtn.addEventListener('click', (e) => {
      e.preventDefault();

      fieldset.innerHTML =
        `<fieldset>
      <div class="full">
        <label for="item-name">Item Name</label>
        <input type="text" name="item-name" id="item-name" />
      </div>
      <div class="quarter">
        <label for="item-qty">Qty.</label>
        <input type="number" name="item-qty" id="item-qty" />
      </div>
      <div class="quarter">
        <label for="item-price">Price</label>
        <input type="number" name="item-price" id="item-price" step=".01" />
      </div>
      <div class="quarter">
        <label for="total">Total</label>
        <input type="number" name="total" id="total" disabled value="0" />
      </div>
      <button class="quarter" id="remove-item">
        <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
            fill-rule="nonzero"
          ></path>
        </svg>
      </button>
    </fieldset>`

      e.target.before(fieldset);
    });
  }
  // ======================

  // ==== Math ====
  // window.addEventListener('input', (e) => {
  //   const qtyValue = Number(document.getElementById('item-qty').value),
  //     price = Number(document.getElementById('item-price').value),
  //     total = document.getElementById('total');

  //   if (qtyValue && price && (e.target.id === 'item-price' || e.target.id === 'item-qty')) {
  //     total.value = qtyValue * price;
  //   }
  // });

  window.addEventListener('click', (e) => {
    // e.preventDefault();
    if (e.target.id === 'remove-item') {
      e.target.parentElement.remove();
    }
  });
  // ==============
});