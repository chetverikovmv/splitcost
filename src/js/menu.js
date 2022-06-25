// меню "бургер" для мобильных
import {
    selectors
} from "./constants.js";

const {
    menuSelectors: {
        navMainSelector,
        navToggleSelector,
        navCloseSelector,
        containerSelector,
        barWrapperSelector
    },
} = selectors;

const navMain = document.querySelector(navMainSelector);
const navToggle = document.querySelector(navToggleSelector);
const navClose = document.querySelector(navCloseSelector);
const container = document.querySelector(containerSelector);
const barWrapper = document.querySelector(barWrapperSelector);

export const mobileMenu = {
    _addShadow() {
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this._removeScroll);
        navMain.classList.add('shadow');
        barWrapper.classList.add('shadow-bg');
        document.body.classList.add('body-modal');
    },

    _removeShadow() {
        navMain.classList.remove('shadow');
        barWrapper.classList.remove('shadow-bg');
        document.body.classList.remove('body-modal');
    },

    closeMobileMenu() {
        navMain.classList.remove('main-nav--opened');
        navMain.classList.add('main-nav--closed');
        container.classList.remove('container--appearance');
        container.classList.add('container--leaving');
        this._removeShadow();
        window.removeEventListener('scroll', this._removeScroll); 
    },

    _removeScroll() {       
        window.scrollTo(0, 0);  
    },

    setListeners() {
        navToggle.addEventListener('click', () => {
            if (navMain.classList.contains('main-nav--closed')) {
                navMain.classList.remove('main-nav--closed');
                navMain.classList.add('main-nav--opened');
                container.classList.remove('container--leaving');
                container.classList.add('container--appearance');
                this._addShadow();                
            }
        });

        navClose.addEventListener('click', () => {
            this.closeMobileMenu();
        });
    }
}

mobileMenu.setListeners();