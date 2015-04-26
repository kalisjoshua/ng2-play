import {Component, View, bootstrap, For, If} from 'angular2/angular2';
import {Words} from 'words-data';

const DAL = Symbol();

let pending;

@Component({
  selector: 'words-ui'
})
@View({
  templateUrl: 'words-ui.html',
  directives: [For, If]
})
export class WordsUI {
  constructor() {
    this.title = 'Weekly Word';

    this[DAL] = new Words();

    this.update();
  }

  addWord($event, element) {
    $event.preventDefault();

    clearTimeout(pending);

    this.errors = this[DAL]
      .add(element.value);

    if (!this.errors) {
      element.value = '';
    } else {
      pending = setTimeout(() => this.errors = '', 4000);
    }
  }

  update() {
    this[DAL]
      .read(words => {
        this.words = words;
        this.isOpen = this[DAL].open();
      });
  }
}

bootstrap(WordsUI);
