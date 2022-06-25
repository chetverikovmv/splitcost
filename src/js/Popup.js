import {
    selectors,
    keyCodes
} from "./constants.js";

const {
    modalSelectors: {
        exitButtonSelector,
        modalShowClass,
    },
} = selectors;
const {
    escapeKeyCode
} = keyCodes;

export class Popup {
    constructor(popupSelector) {
        this._popup = document.querySelector(popupSelector);
        this._exitButton = this._popup.querySelector(exitButtonSelector);
        this._animationDuration =
            parseFloat(getComputedStyle(this._popup).transitionDuration) * 1000;
        this._handleEscClose = this._handleEscClose.bind(this);
    }

    _removeScroll() {
        window.scrollTo(0, window.scrollPositionTop);
    }

    open() {
        window.scrollPositionTop = window.pageYOffset;
        document.addEventListener('keydown', this._handleEscClose);
        this._popup.classList.add(modalShowClass);
        window.addEventListener('scroll', this._removeScroll);
    }

    close() {
        this._popup.classList.remove(modalShowClass);
        document.removeEventListener('keydown', this._handleEscClose);
        window.removeEventListener('scroll', this._removeScroll);
    }

    _handleEscClose(evt) {
        if (evt.key === escapeKeyCode) {
            this.close();
        }
    }

    setEventListeners() {
        this._exitButton.addEventListener("click", () => this.close());
    }
}