$(function ($) {

  const $body = document.querySelector('body');
  const $navToggle = $('[data-navigation-toggle]');
  const $navSecondaryToggle = $('[data-navigation-secondary-toggle]');
  const $nav = $('[data-navigation]');
  const $navSecondary = $('[data-subnavigation]');
  const $menuItems = $nav.find('li');
  const $menuLinks = $menuItems.find('a');
  const is_open = 'js-isOpen';
  const today = moment().format();
  let resizeEnd;

  /////////////////////////////////////////////////////////////////////////////
  // Initialise Ghost Hunter search
  /////////////////////////////////////////////////////////////////////////////

  function initSearch() {
    $("#search-field").ghostHunter({
      onKeyUp: true,
      results: "#results",
      includebodysearch: true,
      displaySearchInfo: false,
      result_template: "<a id='gh-{{ref}}' class='gh-search-item' href='{{link}}'><p>{{title}}</p></a>"
    });
  }

  /////////////////////////////////////////////////////////////////////////////
  // Initialise various components and helpers
  /////////////////////////////////////////////////////////////////////////////

  function initGlobalEvents() {

    window.addEventListener("resize", function() {
      clearTimeout(resizeEnd);
      resizeEnd = setTimeout( function() {
        resizeMenu();
      }, 5);
    });

    window.addEventListener("keyup", function(e) {
      if (e.keyCode === 27 && $nav.hasClass(is_open)) {
        $navToggle.click();
      }
    })

    window.addEventListener("orientationchange", function() {
      resizeMenu();
    });
  }

  /////////////////////////////////////////////////////////////////////////////
  // Form helpers
  /////////////////////////////////////////////////////////////////////////////

  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  /////////////////////////////////////////////////////////////////////////////
  // Navigation helpers
  /////////////////////////////////////////////////////////////////////////////

  function resizeMenu() {
    // Hide primary nav
    $navToggle.removeClass(is_open).attr('aria-expanded', false);
    $nav.removeClass(is_open);

    // Hide secondary menu on any resizing
    $navSecondaryToggle.removeClass("active").attr('aria-expanded', false);
    $navSecondary.removeClass("active").attr('aria-hidden', true);

    $body.classList.remove('mz-no-scroll');
    $nav.css('height', 'inherit');
  }

  // Used to prevent page becoming "fixed" while partly out of viewport on
  // trigger of mobile menu

  function resetScrollPosition() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }

  // Mobile navigation toggle

  $navToggle.on('click', function () {
    const $this = $(this);

    $this.toggleClass(is_open)
      .attr('aria-expanded') === 'true' ?
      $this.attr('aria-expanded', false) : $this.attr('aria-expanded', true);

    $nav.toggleClass(is_open)
      .attr('aria-hidden') === 'true' ?
      $nav.attr('aria-hidden', false) : $nav.attr('aria-hidden', true);

    $menuLinks.attr('tabindex') === '-1' ?
      $menuLinks.attr('tabindex', '') : $menuLinks.attr('tabindex', '-1');

    if (window.innerHeight && window.innerWidth) {
      const _ih = window.innerHeight;
      const _iw = window.innerWidth;
      const _top = $nav.offset().top;

      if (_iw < 1024) {

        if ($nav.hasClass(is_open)) {
          const _os = _ih - _top;
          $nav.css('height',  _os + "px");
          resetScrollPosition();
          $body.classList.add('mz-no-scroll');
        } else {
          $body.classList.remove('mz-no-scroll');
          $nav.css('height', 'inherit');
        }

      } else {
        $body.classList.remove('mz-no-scroll');
        $nav.css('height', 'inherit');
      }

    }

    if ($nav.hasClass(is_open)) {
      hideIntercom(true);
    } else {
      hideIntercom(false);
    }

  });

  $navSecondaryToggle.on('click', function(e) {
    const $this = $(this);
    e.preventDefault();

    $(this).toggleClass("active")
      .attr('aria-expanded') === 'true' ?
      $(this).attr('aria-expanded', false) : $(this).attr('aria-expanded', true);

    $navSecondary.toggleClass("active")
      .attr('aria-hidden') === 'true' ?
      $navSecondary.attr('aria-hidden', false) : $navSecondary.attr('aria-hidden', true);

    resetScrollPosition();
  });

  /////////////////////////////////////////////////////////////////////////////
  // Run The Stuff...
  /////////////////////////////////////////////////////////////////////////////

  initGlobalEvents();
  initSearch();

});


