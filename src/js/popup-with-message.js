import {
    Popup
} from "./Popup.js";

import {
    selectors,
    keyCodes
} from "./constants.js";

const {
    modalSelectors: {
        modalShowClass
    },
    popupWithMessageSelectors: {
        messageHeadingSelector,
        messageTextSelector,
        messageButtonSelector,
        messageButtonCancelSelector,
    },

    mainSelectors: {
        displayNoneClass,
    },

} = selectors;

const {
    enterKeyCode
} = keyCodes;

export class PopupWithMessage extends Popup {
    constructor(popupSelector, submitHandler, canselHandler) {
        super(popupSelector);
        this._messageHeading = this._popup.querySelector(messageHeadingSelector);
        this._messageText = this._popup.querySelector(messageTextSelector);
        this._messageButton = this._popup.querySelector(messageButtonSelector);
        this._messageButtonCancel = this._popup.querySelector(messageButtonCancelSelector);
        this._submitHandler = submitHandler.bind(this);
        this._canselHandler = canselHandler.bind(this);
        this._handleEnterClose = this._handleEnterClose.bind(this);
        this.setEventListeners();
    }

    open(heading, text, button, buttonCancel) {
        this._messageHeading.textContent = heading;
        this._messageText.textContent = text;
        this._messageButton.textContent = button;
        this._messageButtonCancel.textContent = buttonCancel;
        this._messageButtonCancel.classList.remove(displayNoneClass)
        if (buttonCancel == 'no cancel button') {
            this._messageButtonCancel.classList.add(displayNoneClass)
        }

        this._messageButton.addEventListener('click', this._submitHandler);
        this._messageButtonCancel.addEventListener('click', this._canselHandler);

        if (!this._popup.classList.contains(modalShowClass)) {
            super.open();
        }
        document.addEventListener('keydown', this._handleEnterClose);

    }

    close() {
        this._messageButton.removeEventListener('click', this._submitHandler);
        this._messageButtonCancel.removeEventListener('click', this._canselHandler);
        document.removeEventListener('keydown', this._handleEnterClose);
        super.close();
    }

    _handleEnterClose(evt) {
        if (evt.key === enterKeyCode) {
            this._submitHandler();            
        }
    }

    setEventListeners() {
        super.setEventListeners();
        return this;
    }
}