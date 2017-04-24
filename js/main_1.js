jQuery(document).ready(function ($) {
    //check if background-images have been loaded and show list items
    $('.cd-single-project').bgLoaded({
        afterLoaded: function () {
            showCaption($('.projects-container li').eq(0));
        }
    });

    //open project
    $('.cd-single-project').on('click', function () {
        var selectedProject = $(this),
            toggle = !selectedProject.hasClass('is-full-width');
        if (toggle) toggleProject($(this), $('.projects-container'), toggle);
    });

    //close project
    $('.projects-container .cd-close').on('click', function () {
        toggleProject($('.is-full-width'), $('.projects-container'), false);
    });

    //scroll to project info
    $('.projects-container .cd-scroll').on('click', function () {
        $('.projects-container').animate({'scrollTop': $(window).height()}, 500);
    });

    //update title and .cd-scroll opacity while scrolling
    $('.projects-container').on('scroll', function () {
        window.requestAnimationFrame(changeOpacity);
    });

    function toggleProject(project, container, bool) {
        if (bool) {
            //expand project
            container.addClass('project-is-open');
            project.addClass('is-full-width').siblings('li').removeClass('is-loaded');
        } else {
            //check media query
            var mq = window.getComputedStyle(document.querySelector('.projects-container'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, ""),
                delay = ( mq == 'mobile' ) ? 100 : 0;

            container.removeClass('project-is-open');
            //fade out project
            project.animate({opacity: 0}, 800, function () {
                project.removeClass('is-loaded');
                $('.projects-container').find('.cd-scroll').attr('style', '');
                setTimeout(function () {
                    project.attr('style', '').removeClass('is-full-width').find('.cd-title').attr('style', '');
                }, delay);
                setTimeout(function () {
                    showCaption($('.projects-container li').eq(0));
                }, 300);
            });
        }
    }

    function changeOpacity() {
        var newOpacity = 1 - ($('.projects-container').scrollTop()) / 300;
        $('.projects-container .cd-scroll').css('opacity', newOpacity);
        $('.is-full-width .cd-title').css('opacity', newOpacity);
        //Bug fixed - Chrome background-attachment:fixed rendering issue
        $('.is-full-width').hide().show(0);
    }

    function showCaption(project) {
        if (project.length > 0) {
            setTimeout(function () {
                project.addClass('is-loaded');
                showCaption(project.next());
            }, 150);
        }
    }
});

/*
 * BG Loaded
 * Copyright (c) 2014 Jonathan Catmull
 * Licensed under the MIT license.
 */
(function ($) {
    $.fn.bgLoaded = function (custom) {
        var self = this;

        // Default plugin settings
        var defaults = {
            afterLoaded: function () {
                this.addClass('bg-loaded');
            }
        };

        // Merge default and user settings
        var settings = $.extend({}, defaults, custom);

        // Loop through element
        self.each(function () {
            var $this = $(this),
                bgImgs = window.getComputedStyle($this.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
            $this.data('loaded-count', 0);
            $.each(bgImgs, function (key, value) {
                var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                $('<img/>').attr('src', img).load(function () {
                    $(this).remove(); // prevent memory leaks
                    $this.data('loaded-count', $this.data('loaded-count') + 1);
                    if ($this.data('loaded-count') >= bgImgs.length) {
                        settings.afterLoaded.call($this);
                    }
                });
            });

        });
    };
    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    $(function() {

        var $window = $(window),
            $body = $('body');

        // Disable animations/transitions until the page has loaded.
            $body.addClass('is-loading');

            $window.on('load', function() {
                window.setTimeout(function() {
                    $body.removeClass('is-loading');
                }, 0);
            });

        // Touch mode.
            if (skel.vars.mobile)
                $body.addClass('is-touch');

        // Fix: Placeholder polyfill.
            $('form').placeholder();

        // Prioritize "important" elements on medium.
            skel.on('+medium -medium', function() {
                $.prioritize(
                    '.important\\28 medium\\29',
                    skel.breakpoint('medium').active
                );
            });

        // Scrolly links.
            $('.scrolly').scrolly({
                speed: 2000
            });

        // Dropdowns.
            $('#nav > ul').dropotron({
                alignment: 'right',
                hideDelay: 350
            });

        // Off-Canvas Navigation.

            // Title Bar.
                $(
                    '<div id="titleBar">' +
                        '<a href="#navPanel" class="toggle"></a>' +
                        '<span class="title">' + $('#logo').html() + '</span>' +
                    '</div>'
                )
                    .appendTo($body);

            // Navigation Panel.
                $(
                    '<div id="navPanel">' +
                        '<nav>' +
                            $('#nav').navList() +
                        '</nav>' +
                    '</div>'
                )
                    .appendTo($body)
                    .panel({
                        delay: 500,
                        hideOnClick: true,
                        hideOnSwipe: true,
                        resetScroll: true,
                        resetForms: true,
                        side: 'left',
                        target: $body,
                        visibleClass: 'navPanel-visible'
                    });

            // Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
                if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
                    $('#titleBar, #navPanel, #page-wrapper')
                        .css('transition', 'none');

        // Parallax.
        // Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
            if (skel.vars.browser == 'ie'
            ||  skel.vars.mobile) {

                $.fn._parallax = function() {

                    return $(this);

                };

            }
            else {

                $.fn._parallax = function() {

                    $(this).each(function() {

                        var $this = $(this),
                            on, off;

                        on = function() {

                            $this
                                .css('background-position', 'center 0px');

                            $window
                                .on('scroll._parallax', function() {

                                    var pos = parseInt($window.scrollTop()) - parseInt($this.position().top);

                                    $this.css('background-position', 'center ' + (pos * -0.15) + 'px');

                                });

                        };

                        off = function() {

                            $this
                                .css('background-position', '');

                            $window
                                .off('scroll._parallax');

                        };

                        skel.on('change', function() {

                            if (skel.breakpoint('medium').active)
                                (off)();
                            else
                                (on)();

                        });

                    });

                    return $(this);

                };

                $window
                    .on('load resize', function() {
                        $window.trigger('scroll');
                    });

            }

        // Spotlights.
            var $spotlights = $('.spotlight');

            $spotlights
                ._parallax()
                .each(function() {

                    var $this = $(this),
                        on, off;

                    on = function() {

                        // Use main <img>'s src as this spotlight's background.
                            $this.css('background-image', 'url("' + $this.find('.image.main > img').attr('src') + '")');

                        // Enable transitions (if supported).
                            if (skel.canUse('transition')) {

                                var top, bottom, mode;

                                // Side-specific scrollex tweaks.
                                    if ($this.hasClass('top')) {

                                        mode = 'top';
                                        top = '-20%';
                                        bottom = 0;

                                    }
                                    else if ($this.hasClass('bottom')) {

                                        mode = 'bottom-only';
                                        top = 0;
                                        bottom = '20%';

                                    }
                                    else {

                                        mode = 'middle';
                                        top = 0;
                                        bottom = 0;

                                    }

                                // Add scrollex.
                                    $this.scrollex({
                                        mode:       mode,
                                        top:        top,
                                        bottom:     bottom,
                                        initialize: function(t) { $this.addClass('inactive'); },
                                        terminate:  function(t) { $this.removeClass('inactive'); },
                                        enter:      function(t) { $this.removeClass('inactive'); },

                                        // Uncomment the line below to "rewind" when this spotlight scrolls out of view.

                                        //leave:    function(t) { $this.addClass('inactive'); },

                                    });

                            }

                    };

                    off = function() {

                        // Clear spotlight's background.
                            $this.css('background-image', '');

                        // Disable transitions (if supported).
                            if (skel.canUse('transition')) {

                                // Remove scrollex.
                                    $this.unscrollex();

                            }

                    };

                    skel.on('change', function() {

                        if (skel.breakpoint('medium').active)
                            (off)();
                        else
                            (on)();

                    });

                });

        // Wrappers.
            var $wrappers = $('.wrapper');

            $wrappers
                .each(function() {

                    var $this = $(this),
                        on, off;

                    on = function() {

                        if (skel.canUse('transition')) {

                            $this.scrollex({
                                top:        250,
                                bottom:     0,
                                initialize: function(t) { $this.addClass('inactive'); },
                                terminate:  function(t) { $this.removeClass('inactive'); },
                                enter:      function(t) { $this.removeClass('inactive'); },

                                // Uncomment the line below to "rewind" when this wrapper scrolls out of view.

                                //leave:    function(t) { $this.addClass('inactive'); },

                            });

                        }

                    };

                    off = function() {

                        if (skel.canUse('transition'))
                            $this.unscrollex();

                    };

                    skel.on('change', function() {

                        if (skel.breakpoint('medium').active)
                            (off)();
                        else
                            (on)();

                    });

                });

        // Banner.
            var $banner = $('#banner');

            $banner
                ._parallax();

    });
})(jQuery);