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
  const lastVisited = localStorage.getItem("mallzee__lastVisited");
  const ctaHasSignedUp = localStorage.getItem("mallzee__dropCTAHasSignedUp");
  const ctaLastShown = localStorage.getItem("mallzee__dropCTALastShown");
  let resizeEnd;

  localStorage.setItem("mallzee__lastVisited", today);

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
  // Bespoke tracking
  /////////////////////////////////////////////////////////////////////////////

  const url = window.location.href;

  $("#newsletterForm").submit(
    e => {
      gtag("event", "the drop signup", {
        event_category: "form",
        event_label: url
      });
  });

  $("#js-resource").submit(
    e => {
      gtag("event", "request download", {
        event_category: "form",
        event_label: `resource - ${url}`
      });
  });

  $("#newsletterFooter").submit(
    e => {
      gtag("event", "the drop signup", {
        event_category: "form",
        event_label: `footer - ${url}`
      });
  });

  $("#newsletterModal").submit(
    e => {
      gtag("event", "the drop signup", {
          event_category: "form",
          event_label: `popup - ${url}`
      });
  });

  $("#contactForm").submit(
    e => {
      gtag("event", "get in touch", {
        event_category: "form",
        event_label: url
      });
  });

  $(".js-social").click(
    e => {
      const network = $(this).data("network");
      gtag("event", "go to social", {
        event_category: "social button",
        event_label: network
      });
  });

  // Add this class to any link (a tag) that downloads something if you want to track the file
  $(".js-download").click(
    e => {
      const file = $(this).attr("href");
      gtag("event", "download", {
        event_category: "resource",
        event_label: file
      });
  });

  /////////////////////////////////////////////////////////////////////////////
  // The Drop modal handling (timed)
  /////////////////////////////////////////////////////////////////////////////

  function initPageTimer() {
    if (!ctaHasSignedUp) {
      if (!ctaLastShown) {
        const popupDelay = 90; // seconds
        let timer = 0;
        setInterval(
          () => {
            timer++;
            if (timer === popupDelay) {
              const url = window.location.href;
              const now = moment().format();
              localStorage.setItem("mallzee__dropCTALastShown", now);
              $(".js-subscribe").removeClass("hidden");

              gtag("event", "view", {
                event_category: "popup",
                event_label: url
              });
            }
          }, 1000
        );
      }
      if (lastVisited) {
        // We have shown the modal before
        if (ctaLastShown) {
          const ls = moment(ctaLastShown);
          const lv = moment(lastVisited);
          const duration = moment.duration(lv.diff(ls));
          const days = duration.asDays();
          if (days > 29) {
            // It has been 30 days since it was last show
            localStorage.removeItem("mallzee__dropCTALastShown");
          }
        }
      }
    }
    $(".js-modal-close").on("click", () => {
      $(".js-subscribe").addClass("hidden");
      gtag("event", "close", {
          event_category: "popup",
          event_label: url
      });
    })
    $(".js-sign-up").on("click", () => {
      localStorage.setItem("mallzee__dropCTAHasSignedUp", "true");
      $(".js-subscribe").addClass("hidden");
    })
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

  function injectLinkedInTracker( pid, conversionId ) {
    let _pixel = document.createElement('img');
    _pixel.style.visibility = "hidden";
    _pixel.style.width= "1px";
    _pixel.style.height= "1px";
    _pixel.src = `https://dc.ads.linkedin.com/collect/?pid=${pid}&conversionId=${conversionId}&fmt=gif`;
    $body.appendChild(_pixel);
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

  function initForm( formSelector ) {

    const $mzForm = $( formSelector );
    const url = "https://script.google.com/macros/s/AKfycbzYtwIV_HmIBdfpd9cdzj7TrmYvHAGIVDoks7KAgDhy5QiNCaQ/exec";
    const $submitButton = $mzForm.find("[data-contact-submit]");

    $mzForm.on("submit", function(e) {
      const now = new Date();
      const $timeStamp = $("#when");
      const $ref = $("#ref");

      let dd = now.getDate();
      let mm = now.getMonth() + 1;
      let yyyy = now.getFullYear();

      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      $timeStamp.val( dd + '/' + mm + '/' + yyyy);
      $ref.val( window.location.href );

      e.preventDefault();

      let data = $mzForm.serializeObject();
      let thisForm = $.ajax({
        url: url,
        method: "POST",
        dataType: "json",
        data: data
      });

      let oldText = $submitButton.val();

      $submitButton.val("Sending form...");
      $mzForm.find("input").attr("disabled", "disabled").not("input[type=submit]").addClass("mz-fade");
      thisForm.done(function() {
        if (!$mzForm.hasClass("mz-no-message")) {
          injectLinkedInTracker("169970", "240505");
          $submitButton.before("<h3>Thanks, we'll be in touch!</h3>");
          $submitButton.hide();
        } else {
          $submitButton.val(oldText);
        }
      });

      thisForm.fail( function() {
        $submitButton.val( oldText );
        $mzForm.find("input").removeAttr("disabled");
        $submitButton.before("<h3>Apologies, unable to submit this form right now. Please contact hq@mallzee.com</h3>")
      });

    });
  }

    function initResourceForm() {
      const $mzForm = $("#js-resourceForm");
      const url ="https://script.google.com/macros/s/AKfycbzMleiJwtydMVfVQceUZHy5pviZmV5zMHoYcFgOXfV5grS5iwE/exec"

      $mzForm.on("submit", function(e) {
        e.preventDefault();
        const now = new Date();
        const $date = $("#date");
        const $page = $("#page");
        const file = $("#file").val();
        const destination = $("#destination").val();

        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yyyy = now.getFullYear();

        if (dd < 10) {
          dd = "0" + dd;
        }

        if (mm < 10) {
          mm = "0" + mm;
        }

        $date.val(dd + "/" + mm + "/" + yyyy);
        $page.val(window.location.href);

        e.preventDefault();

        let data = $mzForm.serializeObject();
        let thisForm = $.ajax({
            url: url,
            method: "POST",
            dataType: "json",
            data: data
        });

        thisForm.done(function() {
          gtag("event", "download", {
              event_category: "resource",
              event_label: file
          });
          window.location.replace(destination);
        });

        thisForm.fail(function() {
          console.log("ERROR")
        });
      });
    }


  /////////////////////////////////////////////////////////////////////////////
  // Mallzee Team
  /////////////////////////////////////////////////////////////////////////////

  function initMallzeeTeamGrid() {
    const api = new GhostContentAPI({
      url: "https://content.mallzee.com",
      key: "24c8d026081fd061cca7648918",
      version: 'v2'
    });
    const grid = $(".js-teamGrid");
    if (grid.length) {
      api.posts.browse({ filter: 'tag:hash-staff', limit: "all" })
        .then(authors => {
          let image;
          let sortedTeam = _.sortBy(authors, ['title'])
          sortedTeam.forEach(author => {
            if (author.feature_image) {
              image = `<img src=${author.feature_image} alt="${author.title}" />`;
            } else {
              image = "";
            }
            let employee = `<div class="team-grid__employee">
              <div class="team-grid__image">${image}</div>
              <div class="team-grid__name">${author.title}</div>
              <div class="team-grid__role">${author.excerpt}</div>
            </div>
          `;
            grid.append(employee);
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }


  /////////////////////////////////////////////////////////////////////////////
  // ROI
  /////////////////////////////////////////////////////////////////////////////

  function initROI() {
    // Input
    const roi = $("#js-roi");
    const action = $(roi).find("#js-action");
    const turnover = $(roi).find("#_turnover");
    const lines = $(roi).find("#_lines");
    const gross = $(roi).find("#_gross");
    const net = $(roi).find("#_net");
    // Output (current)
    const _revenue = $(roi).find("#_c_revenue");
    const _profit = $(roi).find("#_c_profit");
    // Output (mallzee)
    const _m_revenue = $(roi).find("#_cm_revenue");
    const _m_net = $(roi).find("#_cm_net");
    const _m_increase_net = $(roi).find("#_cm_increase_net");
    const _m_roi = $(roi).find("#_cm_roi");

    action.on( "click", function(e) {
      e.preventDefault;

      const t = turnover.val() * 1000000;
      const l = lines.val();

      // Populate current performance // current.toFixed(2)
      const calcRevenue = t / l;
      const calcProfit = t / (l * net.val());
      _revenue.val(calcRevenue.toFixed(2));
      _profit.val(calcProfit.toFixed(2));

      // Populate Mallzee Insights performance
      const calcMallzeeNetMargin = net.val() * 1.061;
      _m_net.val(calcMallzeeNetMargin.toFixed(2));

      const calcMallzeeAverageLine = ((t / l) * calcMallzeeNetMargin) / 100;
      _m_revenue.val(calcMallzeeAverageLine.toFixed(2));

      const calcMallzeeIncrease = ((calcMallzeeNetMargin / net.val()) -1) * 100;
      _m_increase_net.val(calcMallzeeIncrease.toFixed(2));

      // const roi = (calcProfit / calcMallzeeAverageLine);

      _m_roi.val(100);

    })
  }

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

  // If we have Intercom chat engaugement active, it can cover elements of the
  // mobile menu, so here we hide Intercom if the menu is toggled

  function hideIntercom( bool ) {
    $intercom = document.getElementById("intercom-container");
    if ($intercom) {
      if (bool) {
        $intercom.style.display = 'none';
      } else {
        $intercom.style.display = 'block';
      }
    }
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
  initMallzeeTeamGrid();
  initForm( "[data-contact-form]" );
  initForm( "[data-trial-form]" );
  initResourceForm();
  initPageTimer();
  initSearch();
  initROI();

});


