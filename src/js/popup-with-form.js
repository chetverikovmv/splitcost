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
    popupWithFormSelectors: {
        formSelector,
        inputSelector,
        submitButtonSelector,
        headerSelector
    },
} = selectors;

const {
    enterKeyCode
} = keyCodes;

export class PopupWithForm extends Popup {
    constructor(
        popupSelector,
        submitHandler,
        submitButtonText
    ) {
        super(popupSelector);
        this._form = this._popup.querySelector(formSelector);
        this._inputs = Array.from(this.formElement.querySelectorAll(inputSelector));
        this._inputSum = this.formElement.querySelector('[type="number"]');

        this._submitButton = this.formElement.querySelector(submitButtonSelector);
        this._submitButtonText = submitButtonText;
        this._submitButton.textContent = submitButtonText;

        this._header = this.formElement.querySelector(headerSelector);

        this._submitHandler = submitHandler.bind(this);
        this._handleEnterClose = this._handleEnterClose.bind(this);
        this.setEventListeners();
    }

    open(headerText, costUsersList, selectSelector, costUsersNodes, costUsersSelector) {

        if (!this._popup.classList.contains(modalShowClass)) {
            super.open();
        }
        this._header.textContent = headerText;

        const costUsersCheckboxList = document.querySelector(costUsersSelector); // создние чекбоксов из списка участников
        costUsersCheckboxList.innerHTML = '';
        costUsersNodes.forEach((item) => {
            costUsersCheckboxList.append(item)
        });

        const select = document.querySelector(selectSelector); // создание селекта выбора плательщика
        select.length = 0;
        select.append(new Option('Выберите', 0));
        costUsersList.forEach((item) => {
            select.append(new Option(item.name, item.id))
        });
        select[0].disabled = true;

        this._form.addEventListener('submit', this._submitHandler);
        document.addEventListener('keydown', this._handleEnterClose);       
    }

    getInputValues() {
        const result = {};
        this._inputs.forEach((input) => (result[input.name] = input.value));
        return result;
    }


    getSelectValues(checkboxSelector) {
        const result = {};
        this._selects = Array.from(this.formElement.querySelectorAll(checkboxSelector));
        this._selects.forEach((select) => (
            select.checked ? result[select.name] = true : result[select.name] = false
        ))
        return result;
    }

    setSelectValues(checkboxSelector, id, costsList) {
        this._selects = Array.from(this.formElement.querySelectorAll(checkboxSelector));

        const objValues = Object.values(costsList[id - 1].users);
        this._selects.forEach((select, i) => (
            objValues[i] ? select.checked = true : select.checked = false
        ));
    }

    setInputValues(data) {
        this._inputs.forEach((input) => {
            if (data[input.name]) {
                input.value = data[input.name];
            }
        });
    }

    close() {
        setTimeout(() => this.formElement.reset(), this._animationDuration);
        this._form.removeEventListener('submit', this._submitHandler);
        document.removeEventListener('keydown', this._handleEnterClose);
        super.close();
    }

    _handleEnterClose(evt) {
        if (evt.key === enterKeyCode) {

            if (this._inputSum == document.activeElement) {
                this._inputSum.blur(); // по нажатию на enter убираем фокус и не делаем сабмит формы, чтобы юзер успел ввести плательщика и пользователей платежа
            } else {
                evt.preventDefault();
                this._submitHandler();
            }
        }
    }

    setEventListeners() {
        super.setEventListeners();
        return this;
    }

    // Добавляем геттер без сеттера, чтобы не было возможности изменить элемент формы
    get formElement() {
        return this._form;
    }
}