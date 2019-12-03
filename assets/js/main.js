$(document).ready(function () {
    responsiveVariables();
    tabbingBehaviour();
    desktopSubNavigation();
    mobileSubNavigation();
    navScrollIndicators();
    customDataTablesClickableRows();
    customDataTablesHover();
    datatableStatusTooltips();
    enablePanelToggle();
    enableDocumentLibraryToggle();
});

// Overriding DataTables default options
$.extend(true, $.fn.dataTable.defaults, {
    scrollX: true,
    dom: "tpl",
    language: {
        "lengthMenu":
            "<div class='form__field field--select field--small'>" +
            "<label class='field__label' for='" + $(this).id + "-pageLength'>No. Per Page</label>" +
            "_MENU_</div>"
    },
    initComplete: function () {
        let $table = $(this).parents(".dataTables_wrapper");

        // Style page selects
        $table.find(".dataTables_length select").addClass("field__input");

        // Add custom sorting arrows
        $table.find("thead th").append("<i></i>");


        // Recalculate column sizes once all data is initialised
        let dataTable = $(this).DataTable();
        setTimeout(function () {
            dataTable.columns.adjust();
        }, 0);
    },
    "lengthMenu": [10, 20, 50]
});
$.extend(true, $.fn.dataTable.Buttons.defaults, {
    dom: {
        button: {
            className: 'mb-button mb-button--small'
        }
    }
});

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

// Add class to <body> when user is tabbing
function tabbingBehaviour() {

    function handleFirstTab(e) {
        if (e.keyCode === 9) {
            document.body.classList.add('user-is-tabbing');

            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
        }
    }

    function handleMouseDownOnce() {
        document.body.classList.remove('user-is-tabbing');

        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    }

    window.addEventListener('keydown', handleFirstTab);
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

// Mobile navigation/subnavigation behaviour
// Opens/Closes each item's subnav on nav__item__toggle click
function mobileSubNavigation() {

    $(".nav__button").click(function () {
        $("html").toggleClass("no-scroll");
        $(this).toggleClass("expanded").siblings(".nav__menu").toggleClass("expanded");
    });

    let $arrow = $(".nav__item__toggle");

    $arrow.click(function () {
        if (mobile) {
            $(this).parent().toggleClass("nav__item--expanded");
            $(this).next(".nav__item__subnav").stop().slideToggle(200, function () {
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
    let buffer = 10;

    function showIndicators() {
        let visibleHeight = Math.round($content.outerHeight(true) - $wrapper.outerHeight(true));

        if (Math.round($wrapper.scrollTop()) > buffer)
            $nav.addClass("more-above")
        else
            $nav.removeClass("more-above")

        if (Math.round($wrapper.scrollTop()) < visibleHeight - buffer)
            $nav.addClass("more-below")
        else
            $nav.removeClass("more-below")
    }

    showIndicators();
    $wrapper.on("scroll", function () {
        showIndicators();
    })
    $(window).resize(function () {
        showIndicators();
    })
}

function customDataTablesClickableRows() {
    // If DataTable <tr> has data-href, navigate there on click
    $(".mb-datatable").on("click", "tbody tr[data-href]", function (e) {
        if (e.target.tagName == "TD" || e.target.tagName == "TR")
            window.location.href = $(this).data("href");
    });
}

// Custom hover classes for DataTables
// Adds hover class to entire row (only if it is clickable with [data-href]), as well as corresponding row in FixedColumns wrapper.
function customDataTablesHover() {
    let hoverClass = "datatable-hover";
    let $hoveredRow = $();

    $(".mb-datatable").on("mouseenter", "tbody tr[data-href]", function () {
        let $table = $(this).parents(".dataTables_wrapper");
        let index = $(this).parent().children().index(this);
        $hoveredRow = $()

        $table.find("tbody").each(function () {
            $hoveredRow.push($(this).children(":eq(" + index + ")")[0]);
        });
        $hoveredRow.addClass(hoverClass);
    }).on("mouseleave", "tbody tr[data-href]", function () {
        $hoveredRow.removeClass(hoverClass);
        $hoveredRow = $();
    });
}

// Initialises tooltips for datatable status indicators
function datatableStatusTooltips() {

    function tooltipTitle() {
        if ($(this).hasClass("datatable__status--grey"))
            return "No expected completion date";
        else if ($(this).hasClass("datatable__status--green"))
            return "Expected completion date has not passed";
        else if ($(this).hasClass("datatable__status--orange"))
            return "Expected completion date is today";
        else if ($(this).hasClass("datatable__status--red"))
            return "Expected completion date has passed";
        else return "";
    }

    $(".mb-datatable").tooltip({
        selector: ".datatable__status",
        title: tooltipTitle,
        delay: { "show": 300, "hide": 100 },
        boundary: "viewport"
    });
}

// Adds optional toggle functionality for panels
function enablePanelToggle() {
    $(".panel__toggle").click(function () {
        let $panel = $(this).parents(".panel");
        let $content = $(this).parent().next();

        if ($panel.hasClass("panel--opening") || $panel.hasClass("panel--closing"))
            $panel.toggleClass("panel--opening").toggleClass("panel--closing");
        else if ($content.is(":visible"))
            $panel.addClass("panel--closing");
        else
            $panel.addClass("panel--opening");

        $content.stop().slideToggle(300, function () {
            if ($panel.hasClass("panel--opening"))
                $panel.removeClass("panel--opening").addClass("panel--open").removeClass("panel--closed");
            if ($panel.hasClass("panel--closing"))
                $panel.removeClass("panel--closing").addClass("panel--closed").removeClass("panel--open");
        });
    })
}

// Enables toggle functionality for document-library
function enableDocumentLibraryToggle() {
    // Component starts visually hidden, relying on JS to .hide() it
    // This is a workaround for slideToggle() behaving weirdly for display: flex elements, overshooting its first slideDown
    $(".document-library__file").addClass("document-library__file--enabled").find(".document-library__info").hide();

    $(".document-library__toggle").click(function () {
        let $file = $(this).parents(".document-library__file");
        let $info = $file.find(".document-library__info");

        $file.toggleClass("document-library__file--open");
        $info.stop();
        $info.slideToggle(300, function () {
            if ($(this).is(':visible'))
                $(this).css('display', 'flex');
        });
    })
}