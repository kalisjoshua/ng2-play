System.register("words-ui", ["angular2/angular2", "words-data"], function($__export) {
  "use strict";
  var __moduleName = "words-ui";
  var Component,
      View,
      bootstrap,
      For,
      If,
      Words,
      DAL,
      pending,
      WordsUI;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      View = $__m.View;
      bootstrap = $__m.bootstrap;
      For = $__m.For;
      If = $__m.If;
    }, function($__m) {
      Words = $__m.Words;
    }],
    execute: function() {
      DAL = Symbol();
      WordsUI = (function() {
        function WordsUI() {
          this.title = 'Weekly Word';
          this[DAL] = new Words();
          this.update();
        }
        return ($traceurRuntime.createClass)(WordsUI, {
          addWord: function($event, element) {
            var $__0 = this;
            $event.preventDefault();
            clearTimeout(pending);
            this.errors = this[DAL].add(element.value);
            if (!this.errors) {
              element.value = '';
            } else {
              pending = setTimeout((function() {
                return $__0.errors = '';
              }), 4000);
            }
          },
          update: function() {
            var $__0 = this;
            this[DAL].read((function(words) {
              $__0.words = words;
              $__0.isOpen = $__0[DAL].open();
            }));
          }
        }, {});
      }());
      $__export("WordsUI", WordsUI);
      Object.defineProperty(WordsUI, "annotations", {get: function() {
          return [new Component({selector: 'words-ui'}), new View({
            templateUrl: 'words-ui.html',
            directives: [For, If]
          })];
        }});
      bootstrap(WordsUI);
    }
  };
});
