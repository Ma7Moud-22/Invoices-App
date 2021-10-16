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
