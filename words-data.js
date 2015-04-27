System.register("words-data", ["words-data_mock"], function($__export) {
  "use strict";
  var __moduleName = "words-data";
  var MOCK,
      ERROR_EMPTY,
      ERROR_UNIQUE,
      ERROR_WEEK,
      WEEK,
      WORDS,
      firebase,
      padd,
      Words;
  function format(date) {
    var d = date.getDate(),
        m = date.getMonth() + 1,
        y = date.getFullYear();
    return (y + "/" + padd(m) + "/" + padd(d));
  }
  function nextMonday(data) {
    var latest = new Date(data[0].date);
    return new Date(WEEK + latest.getTime());
  }
  function save(date, word, isMock) {
    this[WORDS].push({
      date: date,
      word: word
    });
    if (!isMock) {
      firebase.set(this[WORDS]);
    }
  }
  return {
    setters: [function($__m) {
      MOCK = $__m.MOCK;
    }],
    execute: function() {
      ERROR_EMPTY = 'No word provided.', ERROR_UNIQUE = 'That word has already been used.', ERROR_WEEK = 'The word for this week has already been submitted.', WEEK = 7 * 24 * 60 * 60 * 1000, WORDS = Symbol();
      padd = (function(x) {
        return x < 10 ? '0' + x : x;
      });
      Words = (function() {
        function Words(useMock) {
          this.useMock = !!useMock;
          if (this.useMock) {
            this[WORDS] = MOCK.slice(0);
            this.sort();
          } else {
            firebase = new Firebase('https://weekly-word.firebaseio.com').child('words');
          }
        }
        return ($traceurRuntime.createClass)(Words, {
          add: function(word) {
            var error,
                today,
                unique;
            if (word.length) {
              var first = !this[WORDS].length;
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
          },
          exists: function(word) {
            word = word.toLowerCase();
            return this[WORDS].some((function(x) {
              return x.word.toLowerCase() === word;
            }));
          },
          open: function(day) {
            return !this[WORDS].length || (day || new Date()) >= nextMonday(this[WORDS]);
          },
          read: function(cb) {
            var $__0 = this;
            if (this.useMock) {
              cb(this[WORDS]);
            } else {
              firebase.on('value', (function(data) {
                $__0[WORDS] = data.val() || [];
                $__0.sort();
                cb($__0[WORDS]);
              }));
            }
          },
          sort: function() {
            if (this[WORDS] && this[WORDS].length) {
              this[WORDS] = this[WORDS].sort((function(a, b) {
                return a.date < b.date;
              }));
            }
          }
        }, {});
      }());
      $__export("Words", Words);
    }
  };
});
