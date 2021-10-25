export default class Form {
  render() {
    return `
    <form action="#">
      <h2>Create Invoice</h2>

      <div class="scroll-container">
        <div class="scrollbar"><div class="thumb"></div></div>
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
              <label for="client-post">Post Code</label>
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
              <label for="invoiceDate">Invoice Date</label>
              <input type="date" name="date" id="invoiceDate" value="${addDateAsValue()}" />
            </div>
            <div class="half">
              <label for="paymentDate">Payment Term</label>
              <div>
                <select name="payment" id="paymentDate">
                  <option value="1">Net 1 Day</option>
                  <option value="7">Net 7 Day</option>
                  <option value="14">Net 14 Day</option>
                  <option value="30">Net 30 Day</option>
                </select>
              </div>
            </div>
            <div class="full">
              <label for="description">Description</label>
              <input type="text" name="description" id="description" placeholder="e.g. Graphic Design Service" />
            </div>
          </fieldset>

          <fieldset>
            <legend>ItemList</legend>
            <div class="full">
              <fieldset class="item-set">
                <div class="full">
                  <label for="item-name">Item Name</label>
                  <input type="text" name="item-name" id="item-name" data-count="0" />
                </div>
                <div>
                  <label for="item-qty">Qty.</label>
                  <input type="number" name="item-qty" id="item-qty" data-count="0" />
                </div>
                <div>
                  <label for="item-price">Price</label>
                  <input type="number" name="item-price" id="item-price" step=".01" data-count="0" />
                </div>
                <div>
                  <label for="total">Total</label>
                  <input type="number" name="total" id="total" disabled value="0" data-count="0" />
                </div>
                <button id="remove-item">
                  <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                      fill-rule="nonzero"
                    ></path>
                  </svg>
                </button>
              </fieldset>
              <button class="add-new-item">Add New Item</button>
            </div>
          </fieldset>
        </div>
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

  // ==== Add New Item ====
  let counter = 1;
  window.addEventListener('click', (e) => {
    if (e.target.matches('.add-new-item') && e.clientX > 0 && e.clientX > 0) {
      e.preventDefault();
      const fieldset = document.createElement('fieldset');
      fieldset.classList = 'item-set';

      fieldset.innerHTML =
        `<div class="full">
          <label for="item-name">Item Name</label>
          <input type="text" name="item-name" id="item-name" data-count="${counter}" />
        </div>
        <div>
          <label for="item-qty">Qty.</label>
          <input type="number" name="item-qty" id="item-qty" data-count="${counter}" />
        </div>
        <div>
          <label for="item-price">Price</label>
          <input type="number" name="item-price" id="item-price" step=".01" data-count="${counter}" />
        </div>
        <div>
          <label for="total">Total</label>
          <input type="number" name="total" id="total" disabled value="0" data-count="${counter}" />
        </div>
        <button id="remove-item">
          <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
              fill-rule="nonzero"
            ></path>
          </svg>
        </button>`;

      counter++;
      e.target.before(fieldset);
    }
    // ==== Remove Item ====
    if (e.target.matches('#remove-item') && e.clientX > 0 && e.clientX > 0) {
      e.preventDefault();
      e.target.parentElement.remove();
    }
  });
  // ======================

  // ==== Math ====
  window.addEventListener('input', (e) => {
    if (e.target.name === 'item-qty' || e.target.name === 'item-price') {
      const qty = e.target.closest('fieldset').querySelector('input[name="item-qty"]');
      const price = e.target.closest('fieldset').querySelector('input[name="item-price"]');
      const total = e.target.closest('fieldset').querySelector('input[name="total"]');

      total.value = Number(qty.value.trim()) * Number(price.value.trim());
    }
  });

  const scrollContainer = document.querySelectorAll('div.scroll-container');
  scrollContainer.forEach(scrollCont => {
    // define initial thumn height
    const thumb = scrollCont.children[0].children[0];
    const scrollBar = scrollCont.children[0];
    const scrollingElemnt = scrollCont.children[1];
    const elScrollHeight = scrollingElemnt.scrollHeight;
    const elHeight = scrollingElemnt.clientHeight;

    if (elHeight / elScrollHeight * 100 < 100) {
      thumb.style.height = `${elHeight / elScrollHeight * 100}%`;
    } else {
      scrollBar.style.opacity = 0;
    }


    // hover state
    scrollBar.addEventListener('mouseover', (e) => e.currentTarget.style.backgroundColor = 'hsla(var(--accent-clr) 67% / 0.1)');
    scrollBar.addEventListener('mouseleave', (e) => e.currentTarget.style.backgroundColor = 'hsla(var(--accent-clr) 67% / 0)');

    // scroll event and move
    scrollingElemnt.addEventListener('scroll', (e) => {
      thumb.style.transform = `translateY(${e.target.scrollTop / elHeight * 100}%)`;
    });
  });

});

export function addDateAsValue() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
