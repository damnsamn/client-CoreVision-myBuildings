$(document).ready(function () {
    $(".nav__button").click(function () {
        $("html").toggleClass("no-scroll");
        $(this).toggleClass("expanded").siblings(".nav__menu").toggleClass("expanded");
    });

    responsiveVariables();
    desktopSubNavigation();
    mobileSubNavigation();
    navScrollIndicators();
});
overrideKendoDefaults();

// Below from https://stackoverflow.com/a/31410149
// Allows us to check whether we're on mobile/desktop based on screen width
var mobile = laptop = desktop = false;
function responsiveVariables() {

    var resizeTimer, width;

    // This should mirror $grid-breakpoints.md from overrides.scss
    var mdBreakpoint = 768;
    var xlBreakpoint = 1200;

    $(window).resize(function () {
        // clear the timeout
        clearTimeout(resizeTimer);

        // execute breakpointChange() once the viewport
        // has stopped changing in size for 400ms
        resizeTimer = setTimeout(breakpointChange(), 400);
    });

    function breakpointChange() {
        width = window.innerWidth;
        if (!mobile && width < mdBreakpoint) {
            laptop = desktop = false;
            mobile = true;
            console.log("mobile/tablet")
        }

        if (!laptop && width >= mdBreakpoint && width < xlBreakpoint) {
            mobile = desktop = false;
            laptop = true;
            console.log('laptop');
        }
        if (!desktop && width >= xlBreakpoint) {
            mobile = laptop = false;
            desktop = true;
            console.log("desktop")
        }
    }
    $(window).resize();
}

// Desktop navigation/subnavigation behaviour
// Manages tabindexes to maintain logic tabbing order
// Opens/Closes subnav menu based on mouse/focus events
function desktopSubNavigation() {

    let aList = $(".nav-panel a");
    let navItemParentLinks = $(".nav__item--parent>a");

    // Equalise all tab indexes
    aList.each(function () {
        $(this).attr("tabindex", "1");
    });

    navItemParentLinks.each(function (i) {
        $(this).on("mouseenter focusin", function () {
            if (!mobile) {
                let subnavChild = $(".nav__subnav #subnav-" + i);

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
                $(this).parent().addClass("nav__item--expanded");

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

    // Open subnav, maintain expanded styling for parent
    $(".nav__subnav.visible").on("mouseenter focusin", function () {
        if (!mobile) {
            let expandedEl = $(".nav__item--expanded");
            openSubnav();
            expandedEl.addClass("nav__item--expanded");
        }
    });

    // Only close subnav if mouse or focus moves away from main link or subnav items
    $(".nav-panel a").on("mouseenter focusin", function () {
        if (!mobile && !$(this).parent().is(".nav__item--parent, .subnav__item")) {
            closeSubnav();
        }
    });
    $(".nav__footer").on("mouseenter focusin", function () {
        if (!mobile)
            closeSubnav();
    });
    $(".nav__menu").on("mouseleave", function () {
        if (!mobile)
            closeSubnav();
    });

    function openSubnav() {
        navItemParentLinks.parent().removeClass("nav__item--expanded");
        $(".nav__subnav").addClass("visible").removeClass("hidden");
    }
    function closeSubnav() {
        if ($(".nav__subnav").hasClass("visible")) {
            navItemParentLinks.parent().removeClass("nav__item--expanded");
            $(".nav__subnav").removeClass("visible").addClass("hidden");

            aList.each(function () {
                $(this).attr("tabindex", "1");
            });
        }
    }
    function hideAll() {
        $(".nav__subnav").find("ul").removeAttr("style");
    }
}

function mobileSubNavigation() {
    // Mobile navigation/subnavigation behaviour
    // Opens/Closes each item's subnav on nav__item__toggle click

    let $arrow = $(".nav__item__toggle");

    $arrow.click(function () {
        if (mobile) {
            $(this).parent().toggleClass("nav__item--expanded");
            $(this).next(".nav__item__subnav").stop().slideToggle(function () {
                $("nav .simplebar-content-wrapper").off("scroll");
                navScrollIndicators();
            });
        }
    });
}

// Show/hide shadows at top/bottom of nav element to indicate more content to scroll to
function navScrollIndicators() {
    let $nav = $("nav");
    let $wrapper = $nav.find(".simplebar-content-wrapper");
    let $content = $wrapper.children(".simplebar-content");
    let visibleHeight = Math.round($content.outerHeight(true) - $wrapper.outerHeight(true));
    let buffer = 10;

    showIndicators();
    $wrapper.on("scroll", function () {
        showIndicators();
    })

    function showIndicators() {
        if (Math.round($wrapper.scrollTop()) > buffer)
            $nav.addClass("more-above")
        else
            $nav.removeClass("more-above")

        if (Math.round($wrapper.scrollTop()) < visibleHeight - buffer)
            $nav.addClass("more-below")
        else
            $nav.removeClass("more-below")
    }
}

function overrideKendoDefaults() {
    kendo.ui.Grid.fn.options.sortable = true;
}

// Tables to be handled by Kendo UI
// function tableEqualise() {

//     $(".table").each(function () {
//         let $table = $(this);
//         let colSelector = ".table__col";
//         let rowSelector = ".table__header, .table__row";

//         let $fixedRows = $table.find(".table__fixed").find(rowSelector);
//         let $scrollRows = $table.find(".table__scroll").find(rowSelector);
//         let rows = [];


//         $fixedRows.each(function (i) {
//             if (rows[i] == null)
//                 rows[i] = [$(this).children()];
//             else
//                 rows[i].push($(this).children());
//         });

//         $scrollRows.each(function (i) {
//             if (rows[i] == null)
//             $(this).children().each(function() {
//                 rows[i].push(this));
//             else
//                 rows[i].push($(this).children());
//         });

//         console.table(rows);

//         let cols = [];

//         $.each(rows, function () {
//             // [div.table__row, div.table__row]
//             $.each(this, function (i) {
//                 // div.table__row
//                 let children = [];
//                 $(this).children().each(function (n) {
//                     if (cols[n] == null)
//                     cols[n] = [this];
//                     else
//                     cols[n].push(this);
//                 })
//                 // console.table(children);

//                 // if (cols[i] == null)
//                 //     cols[i] = [children[i]];
//                 // else
//                 //     cols[i].push(children[i]);

//             })
//         })
//         // console.table(cols);


//     });
// }
