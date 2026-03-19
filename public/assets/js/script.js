function openHeaderMenu() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const btn = document.getElementById('header_menu_btn');
    const menu = document.getElementById('header_menu_list');
    const nav = document.getElementById('header_menu_nav');

    function open() {
        menu.classList.add('open');
        nav.classList.add('open');
    }

    function close(e) {
        if (!btn.contains(e.relatedTarget) && !menu.contains(e.relatedTarget)) {
            menu.classList.remove('open');
            nav.classList.remove('open');
        }
    }

    btn.addEventListener('mouseenter', open);
    menu.addEventListener('mouseenter', open);

    btn.addEventListener('mouseleave', close);
    menu.addEventListener('mouseleave', close);
}

function toggleMenu(){
    const header = document.getElementById('header');
    if (!header) return;
    const menuOverlay = document.getElementById('menu_overlay');
    header.classList.toggle("open");
    menuOverlay.classList.toggle("active");
    document.body.classList.toggle('stop-scroll')
}

function mobileMenu(){
    const mobileMenuBtn = document.getElementById('mobile_menu_btn');
    mobileMenuBtn?.addEventListener('click', () => {
        toggleMenu()
    })
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 50) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }

        lastScroll = currentScroll;
    });
}

document.addEventListener('click', (event) => {
    const menuOverlay = event.target.closest('[data-menu-overlay]');
    if (!menuOverlay) return
    toggleMenu()
})

function initTabs() {
    document.querySelectorAll('[data-tabs-block]').forEach(block => {
        const tabs = block.querySelectorAll('[data-pane]');
        const contents = block.querySelectorAll('[data-container]');

        if (!tabs.length || !contents.length) return;

        tabs[0].classList.add('active');
        contents[0].classList.add('active');

        block.addEventListener('click', (e) => {
            const tab = e.target.closest('[data-pane]');
            if (!tab) return;

            const index = [...tabs].indexOf(tab);

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            contents[index]?.classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    openHeaderMenu();
    mobileMenu()
    initHeaderScroll();
    initTabs()
})




document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('[data-input-mask="phone"]');

    // длины номеров для выбранных стран (без кода страны)
    const phoneLengths = {
        '7': 10,    // Россия/Казахстан
        '374': 8,   // Армения
        '375': 9,   // Беларусь
    };

    inputs.forEach(input => {
        const iti = window.intlTelInput(input, {
            initialCountry: "ru",
            preferredCountries: ["ru", "am", "kz", "by"],
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js",
            nationalMode: false,
            separateDialCode: false,
            autoPlaceholder: "off",
        });

        input._iti = iti;

        let maxLength = 15; // дефолтное значение

        function updateMaxLength() {
            const dialCode = iti.getSelectedCountryData().dialCode;
            maxLength = phoneLengths[dialCode] || 10;
        }

/*        function setDialCode() {
            const dialCode = iti.getSelectedCountryData().dialCode;
            input.value = `+${dialCode} `;
            setTimeout(() => {
                input.setSelectionRange(input.value.length, input.value.length);
            });
        }*/

        function setPlaceholder() {
            const dialCode = iti.getSelectedCountryData().dialCode;
            input.placeholder = `+${dialCode} (___) ___-__-__`;
        }

        // init
        updateMaxLength();
        // setDialCode();
        setPlaceholder();

        input.addEventListener('countrychange', () => {
            updateMaxLength();
            // setDialCode();
            setPlaceholder();
        });

        input.addEventListener('keydown', (e) => {
            const dialCode = '+' + iti.getSelectedCountryData().dialCode;

            if (
                input.selectionStart <= dialCode.length &&
                (e.key === 'Backspace' || e.key === 'Delete')
            ) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', () => {
            const dialCode = '+' + iti.getSelectedCountryData().dialCode;
            let value = input.value;

            if (!value.startsWith(dialCode)) {
                value = dialCode;
            }

            let numbers = value.slice(dialCode.length).replace(/\D/g, '');
            numbers = numbers.slice(0, maxLength);

            input.value = dialCode + numbers;
            input.setSelectionRange(input.value.length, input.value.length);
        });
    });
});

















/*

function openCloseBlock() {
    const openBlockBtn = document.querySelectorAll('[data-open-block-btn]');
    openBlockBtn.forEach(openBtn => {
        openBtn?.addEventListener('click', (event) => {
            const openBlockWrapper = event.target.closest('[data-open-block-wrapper]');
            const openingBlock = openBlockWrapper.querySelector('[data-open-block]');
            const hasChangeText = openBtn.hasAttribute('data-change-btn-text');

            openBlockWrapper.classList.toggle('open');
            if (openingBlock.style.maxHeight) {
                openingBlock.removeAttribute('style');
                if (hasChangeText) {
                    openBtn.textContent = 'Показать еще';
                }
            } else {
                openingBlock.style.maxHeight = openingBlock.scrollHeight + 'px';
                if (hasChangeText) {
                    openBtn.textContent = 'Скрыть';
                }
            }
        })
    })
}
function stopScrollBody(mobileMenu) {
    const popupOverlay = document.getElementById('popupOverlay');
    document.body.classList.add('popup-open');
    popupOverlay.classList.add('active');
    popupOverlay.focus();
}
function resetScrollBody() {
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.classList.remove('active');
    document.body.classList.remove('popup-open');
}
function closePopUp(){
    const popups = document.querySelectorAll('[data-popup]');
    popups.forEach(popup => {
        popup.classList.remove('active');
    })
    resetPopupReviews()
    resetScrollBody()
}
function openPopUp() {
    const openPopupButtons = document.querySelectorAll('[data-open-popup]');
    openPopupButtons.forEach(openBtn => {
        openBtn.addEventListener('click', () => {
            const popupType = openBtn.dataset.openPopup;
            const currentPopUp = document.getElementById(`${popupType}`)
            currentPopUp.classList.add('active');


            const popupGetTitle = currentPopUp.querySelector('[data-popup-get-title]');
            const popupGetButtonText = currentPopUp.querySelector('[data-popup-get-button-text]');

            if (popupGetTitle){
                popupGetTitle.innerText = openBtn.dataset.popupSetTitle;
                popupGetButtonText.innerText = openBtn.dataset.popupSetTitle;
            }


            stopScrollBody()
            closeAllMenu()
        });
    })

    const closePopupBtn = document.querySelectorAll('[data-close-popup]');
    closePopupBtn.forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const popup = e.target.closest('[data-popup]');
            popup.classList.remove('active');
            resetScrollBody()
        })
    })
}
function closeByESC() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape'){
            closePopUp()
        }
    });
}
function closeByOverlay() {
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay?.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopUp()
        }
    });
}
function initFancybox(){
    Fancybox.bind("[data-fancybox='certificates-gallery']", {
        Thumbs: {
            autoStart: true,
        },
    });
}



document.addEventListener('DOMContentLoaded', function() {

    initTabs()
    openCloseBlock()
    openPopUp()
    closeByESC()
    closeByOverlay()
    initFancybox()

})

function initSliders() {
    const sliderGroupItems = document.querySelectorAll('[data-slider-group-item]');
    if (!sliderGroupItems.length) return;

    sliderGroupItems.forEach(sliderItem => {
        const {
            sliderGroupItem,
            spaceBetween,
            spaceBetweenTablet,
            spaceBetweenMobile,
            slidesView,
            slidesViewTablet,
            slidesViewMobile,
            grabCursor,
            autoPlay,
            slidesLoop,
            reverseDirection,
            slidesSpeed,
            paginationClickable,
            slidesDelay,
            paginationType,
            paginationTypeTablet,
            paginationTypeMobile,

        } = sliderItem.dataset;

        const isGrabCursor = grabCursor === 'true';
        const isAutoPlay = autoPlay === 'true';
        const isSlidesLoop = slidesLoop === 'true';
        const isReverseDirection = reverseDirection === 'true';
        const isPaginationClickable = paginationClickable === 'true';

        const getPaginationType = () => {
            const width = window.innerWidth;
            if (width < 576) return paginationTypeMobile || paginationTypeTablet || paginationType || 'bullets';
            if (width < 992) return paginationTypeTablet || paginationType || 'bullets';
            return paginationType || 'bullets';
        };

        const paginationEl = `#swiper-pagination__${sliderGroupItem}`;

        const swiperConfig = {
            grabCursor: isGrabCursor,
            loop: isSlidesLoop,
            navigation: {
                nextEl: `#toRight_${sliderGroupItem}`,
                prevEl: `#toLeft_${sliderGroupItem}`,
            },
            breakpoints: {
                300: {
                    spaceBetween: parseFloat(spaceBetweenMobile) || 0,
                    slidesPerView: slidesViewMobile === "auto"? 'auto': parseFloat(slidesViewMobile),
                },
                992: {
                    spaceBetween: parseFloat(spaceBetweenTablet) || 0,
                    slidesPerView: slidesViewTablet === "auto"? 'auto': parseFloat(slidesViewTablet),
                },
                1220: {
                    spaceBetween: parseFloat(spaceBetween) || 0,
                    slidesPerView: slidesView === "auto"? 'auto': parseFloat(slidesView),
                },
            },
            pagination: {
                el: paginationEl,
                clickable: isPaginationClickable,
                type: getPaginationType(),
                progressbarFillClass: 'swiper-pagination-progressbar-fill',
                renderProgressbar(progressbarFillClass) {
                    return `<span class="${progressbarFillClass}"></span>`;
                },
            },
            speed: parseInt(slidesSpeed) || 1000,
            autoplay: isAutoPlay ? {
                delay: parseInt(slidesDelay) || 3000,
                reverseDirection: isReverseDirection,
            } : false,
        };

        const swiper = new Swiper(`#${sliderGroupItem}`, swiperConfig);

        window.addEventListener('resize', () => {
            const newType = getPaginationType();
            if (swiper.params.pagination.type !== newType) {
                swiper.params.pagination.type = newType;
                swiper.pagination.destroy();
                swiper.pagination.init();
                swiper.pagination.render();
                swiper.pagination.update();
            }
        });
    });
}
initSliders()











*/
