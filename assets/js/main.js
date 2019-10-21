$(document).ready(function () {
    $(".nav__button").click(function () {
        $("html").toggleClass("no-scroll");
        $(this).toggleClass("expanded").siblings(".nav__menu").toggleClass("expanded");
    });

    responsiveVariables();
    desktopSubNavigation();
    navScrollIndicators();
});

function responsiveVariables() {
    // Below from https://stackoverflow.com/a/31410149
    // Allows us to check whether we're on mobile/desktop based on screen width

    var mobile = desktop = false;
    var resizeTimer, width;

    // This should mirror $grid-breakpoints.md from overrides.scss
    var breakpoint = 768;

    $(window).resize(function () {
        // clear the timeout
        clearTimeout(resizeTimer);

        // execute breakpointChange() once the viewport
        // has stopped changing in size for 400ms
        resizeTimer = setTimeout(breakpointChange(), 400);
    });

    function breakpointChange() {
        width = window.innerWidth;
        if (!mobile && width < breakpoint) {
            desktop = false;
            mobile = true;
            $(".nav-menu").removeClass("desktop");
            $(".nav-menu").addClass("mobile");
            console.log("mobile")
        }
        if (!desktop && width >= breakpoint) {
            mobile = false;
            desktop = true;
            $(".nav-menu").removeClass("mobile");
            $(".nav-menu").addClass("desktop");
            console.log("desktop")
        }
    }
    $(window).resize();
}

function desktopSubNavigation() {
    // Manages tabindexes to maintain logic tabbing order
    // Opens/Closes subnav menu based on mouse/focus events

    let aList = $(".nav-panel a");
    let navItemParents = $(".nav__item--parent>a");

    // Equalise all tab indexes
    aList.each(function () {
        $(this).attr("tabindex", "1");
    });

    navItemParents.each(function (i) {
        $(this).on("mouseenter focusin", function () {
            if (desktop) {
                let index = i + 1;
                let subnavChild = $(".nav__subnav #subnav-" + index);

                // Ensure all previously showing subnav children are hidden
                hideAll();

                // Set current link to tabindex 1
                $(this).attr("tabindex", "1");
                // Set all subnav links tabindex 2
                subnavChild.find("a").attr("tabindex", "2");
                // Set each link after current link to tabindex 3
                $(this).parent().nextAll().children("a").attr("tabindex", "3");
                $(".nav__subnav").nextAll().children("a").attr("tabindex", "3");

                // Open subnav and display appropriate subnav items
                openSubnav();
                subnavChild.show();
                $(this).addClass("hover");

                // Ensure subnav items don't fall off the bottom of the page
                let padding;
                if ($(this).offset().top - $(window).scrollTop() + subnavChild.outerHeight(true) > $(window).outerHeight(true))
                    padding = $(window).outerHeight(true) - subnavChild.outerHeight(true);
                else
                    padding = $(this).offset().top - $(window).scrollTop();
                $(".nav__subnav").css("padding-top", padding);
            }
        })
    });

    // Open subnav, maintain hover styling for parent
    $(".nav__subnav").on("mouseenter focusin", function () {
        if (desktop) {
            let hoverEl = $(".nav__item--parent>a.hover");
            openSubnav();
            hoverEl.addClass("hover");
        }
    });

    // Only close subnav if mouse or focus moves away from main link or subnav items
    $(".nav-panel a").on("mouseenter focusin", function () {
        if (desktop && !$(this).parent().is(".nav__item--parent, .subnav__item")) {
            closeSubnav();
        }
    });
    $(".nav__footer").on("mouseenter focusin", function () {
        if (desktop)
            closeSubnav();
    });
    $(".nav__menu").on("mouseleave", function () {
        if (desktop)
            closeSubnav();
    });

    function openSubnav() {
        navItemParents.removeClass("hover");
        $(".nav__subnav").addClass("visible").removeClass("hidden");
    }
    function closeSubnav() {
        navItemParents.removeClass("hover");
        $(".nav__subnav").removeClass("visible").addClass("hidden");

        aList.each(function () {
            $(this).attr("tabindex", "1");
        });
    }
    function hideAll() {
        $(".nav__subnav").find("ul").removeAttr("style");
    }
}

// Show/hide shadows at top/bottom of nav element to indicate more content to scroll to
function navScrollIndicators() {
    let $nav = $("nav");
    let $wrapper = $nav.find(".simplebar-content-wrapper");
    let $content = $wrapper.children(".simplebar-content");
    let visibleHeight = Math.round($content.outerHeight(true) - $wrapper.outerHeight(true));

    showIndicators();
    $wrapper.on("scroll", function () {
        showIndicators();
    })

    function showIndicators() {
        if (Math.round($wrapper.scrollTop()) != 0)
            $nav.addClass("more-above")
        else
            $nav.removeClass("more-above")

        if (Math.round($wrapper.scrollTop()) < visibleHeight)
            $nav.addClass("more-below")
        else
            $nav.removeClass("more-below")

        console.log(visibleHeight);
        console.log(Math.round($wrapper.scrollTop()));
    }
}
