import Aside from './Aside.js';
import Main from './Main.js';
import Form from './Form.js';

const sideBar = new Aside;
const cards = new Main;
const form = new Form;

export default class Home {
  constructor() {
    document.title = 'Invoices App';
  }

  async getHtml() {
    return (
      sideBar.render() +
      await cards.render() +
      form.render()
    )
  }
}


// await fetch('http://1.1.1.4:5500/data')
//   .then(res => res.json())
//   .then(data => {
//     if (key !== '') {
//       this.DATA = [];
//       this.DATA.push(...data.filter(card => card.status === key));
//     } else {
//       this.DATA = [];
//       this.DATA.push(...data);
//     }
//   })
//   .catch(err => console.log(err))



// window.addEventListener('click', (e) => {
//   if (e.target.matches('ul.filter input')) {
//     const span = e.target.nextElementSibling.innerText;
//     switch (span) {
//       case 'Paid': this.getHtml(span);
//         break;
//       case 'Pending': this.getHtml(span);
//         break;
//       case 'Draft': this.getHtml(span);
//         break;
//       default: this.getHtml(span);
//         break;
//     }
//   }
// });