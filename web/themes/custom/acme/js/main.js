"use strict";

(function ($) {

  Drupal.behaviors.se_main = {

    attach(context, settings) {

      console.log('Javascript is working');
    },
    detach(context, settings, trigger) {

    }
  }

}(jQuery));