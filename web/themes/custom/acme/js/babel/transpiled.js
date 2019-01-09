"use strict";

(function ($) {
  Drupal.behaviors.se_main = {
    attach: function attach(context, settings) {
      console.log('Javascript is working');
    },
    detach: function detach(context, settings, trigger) {}
  };
})(jQuery);