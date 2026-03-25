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
    let topTimer = null;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (topTimer) clearTimeout(topTimer);

        topTimer = setTimeout(() => {
            if (currentScroll <= 0) {
                header.classList.add('at-top');
                header.classList.remove('toTop');
            } else {
                header.classList.remove('at-top');
            }
        }, 100);

        // Скрытие / показ (без задержки)
        if (currentScroll > lastScroll && currentScroll > 0) {
            header.classList.add('hide');
            header.classList.remove('toTop');
        } else {
            header.classList.remove('hide');
            header.classList.add('toTop');
        }

        lastScroll = currentScroll;
    });
}

document.addEventListener('click', (event) => {
    const menuOverlay = event.target.closest('[data-menu-overlay]');
    if (!menuOverlay) return
    toggleMenu()
})

function initAnchors() {
    const sections = document.querySelectorAll('[data-anchor]');
    const links = document.querySelectorAll('.article-anchors a');

    if (!sections.length || !links.length) return;

    let isClickScrolling = false;

    const observer = new IntersectionObserver(
        (entries) => {
            if (isClickScrolling) return;

            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const current = entry.target.dataset.anchor;

                links.forEach((link) => {
                    link.classList.toggle(
                        'active',
                        link.dataset.link === current
                    );
                });
            });
        },
        {
            rootMargin: '-40% 0px -50% 0px',
            threshold: 0
        }
    );

    sections.forEach((section) => observer.observe(section));

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const id = link.getAttribute('href')?.replace('#', '');
            const target = document.getElementById(id);

            if (!target) return;

            isClickScrolling = true;

            // ✅ СРАЗУ ставим active
            links.forEach((linkItem) => {
                linkItem.classList.toggle(
                    'active',
                    linkItem === link
                );
            });

            const y =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                window.innerHeight / 2 +
                target.offsetHeight / 2;

            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isClickScrolling = false;
            }, 600);
        });
    });
}

function openCloseBlock() {
    const buttons = document.querySelectorAll('[data-open-block-btn]');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('[data-open-block-wrapper]');
            const content = wrapper?.querySelector('[data-open-block]');
            if (!wrapper || !content) return;

            const isOpen = wrapper.classList.toggle('open');

            if (isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }

            if (btn.hasAttribute('data-change-text')) {
                const openText = btn.dataset.openText || 'Показать ещё';
                const closeText = btn.dataset.closeText || 'Скрыть';

                btn.textContent = isOpen ? closeText : openText;
            }
        });
    });
}

function checkHeight(){
    const blockHeight = document.querySelectorAll('[data-block-height]');
    if (blockHeight) {
        for (let i = 0; i < blockHeight.length; i++) {
            if (blockHeight[i].scrollHeight > blockHeight[i].clientHeight) {
                if ( !blockHeight[i].closest('[data-block-height-wrapper]').classList.contains('show-btn')){
                    blockHeight[i].closest('[data-block-height-wrapper]').classList.add('show-btn');
                }

            } else {
                blockHeight[i].closest('[data-block-height-wrapper]').classList.remove('show-btn');
            }
        }
    }
}

function handleResize() {
    checkHeight()
}
window.addEventListener("resize", handleResize);

function initFancybox(){
    Fancybox.bind("[data-fancybox]", {
        Thumbs: {
            autoStart: true,
        },
    });
}

function initMapScrollEvents() {
    const mapWrapper = document.getElementById('mapWrapper');
    if (!mapWrapper) return
    const map = mapWrapper.querySelector('iframe');

    map?.addEventListener('click', (e) => {
        e.stopPropagation();
        map.style.pointerEvents = 'auto';
    });

    mapWrapper.addEventListener('click', (e) => {
        if (e.target !== map) {
            map.style.pointerEvents = 'none';
        }
    });
}



function resetScrollBody() {
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.classList.remove('active');
    document.body.classList.remove('popup-open');
}
function stopScrollBody(mobileMenu) {
    const popupOverlay = document.getElementById('popupOverlay');
    document.body.classList.add('popup-open');
    popupOverlay.classList.add('active');
    popupOverlay.focus();
}

function closePopUp(){
    const popups = document.querySelectorAll('[data-popup]');
    popups.forEach(popup => {
        popup.classList.remove('active');
    })

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
            const popupGetSubTitle = currentPopUp.querySelector('[data-popup-get-subtitle]');
            const popupGetButtonText = currentPopUp.querySelector('[data-popup-get-button-text]');

            console.log(openBtn.dataset.popupSetTitle)


            if (popupGetTitle){
                popupGetTitle.innerText = openBtn.dataset.popupSetTitle;
                popupGetSubTitle.innerText = openBtn.dataset.popupSetSubtitle
                popupGetButtonText.innerText = openBtn.dataset.popupSetButtonText;
            }
            stopScrollBody()
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

function initCustomSelect(){
    document.querySelectorAll('[data-custom-select]').forEach(select => {
        const trigger = select.querySelector('[data-custom-select-trigger]');
        const valueSpan = select.querySelector('[data-custom-select-value]');
        const options = select.querySelectorAll('[data-custom-select-option]');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            select.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                valueSpan.textContent = option.textContent;
                select.classList.remove('open');
            });
        });

        document.addEventListener('click', () => {
            select.classList.remove('open');
        });
    });

}


document.addEventListener('DOMContentLoaded', function() {
    openHeaderMenu();
    mobileMenu()
    initHeaderScroll();
    initAnchors()
    openCloseBlock()
    checkHeight()
    initFancybox()
    initMapScrollEvents()


    openPopUp()
    closeByESC()
    closeByOverlay()

    initCustomSelect()
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
            pagination,
            paginationTablet,
            paginationMobile,

        } = sliderItem.dataset;

        const isGrabCursor = grabCursor === 'true';
        const isAutoPlay = autoPlay === 'true';
        const isSlidesLoop = slidesLoop === 'true';
        const isReverseDirection = reverseDirection === 'true';
        const isPaginationClickable = paginationClickable === 'true';

        const getPaginationType = () => {
            const width = window.innerWidth;
            if (width < 576) return paginationMobile || paginationTablet || pagination || 'bullets';
            if (width < 992) return paginationTablet || pagination || 'bullets';
            return pagination || 'bullets';
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
                576: {
                    spaceBetween: parseFloat(spaceBetweenTablet) || 0,
                    slidesPerView: slidesViewTablet === "auto"? 'auto': parseFloat(slidesViewTablet),
                },
                992: {
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



document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('[data-input-mask="phone"]');

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

        let maxLength = 15;

        function updateMaxLength() {
            const dialCode = iti.getSelectedCountryData().dialCode;
            maxLength = phoneLengths[dialCode] || 10;
        }

        function setPlaceholder() {
            const dialCode = iti.getSelectedCountryData().dialCode;
            input.placeholder = `+${dialCode} (___) ___-__-__`;
        }

        updateMaxLength();
        setPlaceholder();

        input.addEventListener('countrychange', () => {
            updateMaxLength();
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



