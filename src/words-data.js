import {MOCK} from 'words-data_mock';

const ERROR_EMPTY = 'No word provided.',
      ERROR_UNIQUE = 'That word has already been used.',
      ERROR_WEEK = 'The word for this week has already been submitted.',
      WEEK = 7 * 24 * 60 * 60 * 1000,
      WORDS = Symbol();

let firebase,
    padd = x => x < 10 ? '0' + x : x;

function format(date) {
  let d = date.getDate(),
      m = date.getMonth() + 1,
      y = date.getFullYear();

  return `${y}/${padd(m)}/${padd(d)}`;
}

function nextMonday(data) {
  let latest = new Date(data[0].date);

  return new Date(WEEK + latest.getTime());
}

function save(date, word, isMock) {
  this[WORDS].push({date: date, word: word});

  if (!isMock) {
    firebase.set(this[WORDS]);
  }
}

export class Words {
  constructor (useMock) {
    this.useMock = !!useMock;

    if (this.useMock) {
      this[WORDS] = MOCK
        .slice(0);

      this.sort();
    } else {
      firebase = new Firebase('https://weekly-word.firebaseio.com')
        .child('words');
    }
  }

  add(word) {
    let error,
        today,
        unique;

    if (word.length) {
      let first = !this[WORDS].length;
      // progressively calculate values only absolutely necessary below

      unique = first || !this.exists(word);

      today = unique && new Date();
    } else {
      error = ERROR_EMPTY;
    }

    if (!error && unique && this.open(today)) {
      save.call(this, format(today), word, this.useMock);
    } else {
      error = error || (unique ? ERROR_WEEK : ERROR_UNIQUE);
    }

    return error;
  }

  exists(word) {
    word = word.toLowerCase();

    return this[WORDS]
      .some(x => x.word.toLowerCase() === word);
  }

  open(day) {

    return !this[WORDS].length || (day || new Date()) >= nextMonday(this[WORDS]);
  }

  read(cb) {
    if (this.useMock) {
      cb(this[WORDS]);
    } else {
      firebase
        .on('value', data => {
          this[WORDS] = data.val() || [];
          this.sort();
          cb(this[WORDS]);
        });
    }
  }

  sort() {
    if (this[WORDS] && this[WORDS].length) {
      this[WORDS] = this[WORDS]
        .sort((a, b) => a.date < b.date);
    }
  }
}
