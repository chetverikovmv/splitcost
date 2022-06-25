import {
    selectors
} from "./constants.js";

const {
    costsSelectors: {
        costSelector,
        costNameSelector,
        costsPayerSelector,
        costsValueSelector,
        costsDeleteSelector,
    },

} = selectors;

export class Cost {
    constructor(
        templateSelector, costId, costName, costPayer, costValue, {
            clickHandler,
            deleteHandler
        }
    ) {
        this._clickHandler = clickHandler.bind(this);
        this._deleteHandler = deleteHandler.bind(this);

        this.costId = costId;
        this.costName = costName;
        this.costPayer = costPayer;
        this.costValue = costValue;

        this._template = document
            .querySelector(templateSelector)
            .content.querySelector(costSelector);
    }

    _getTemplate() {
        return this._template.cloneNode(true);
    }

    configureCost() {
        this._cost = this._getTemplate();

        this._costNameText = this._cost.querySelector(costNameSelector);
        this._costsPayerText = this._cost.querySelector(costsPayerSelector);
        this._costsValueText = this._cost.querySelector(costsValueSelector);
        this._deleteButton = this._cost.querySelector(costsDeleteSelector);

        this.setProperties(this.costId, this.costName, this.costPayer, this.costValue);
        this._setListeners();
        return this;
    }

    getCost() {
        return this._cost;
    }

    setProperties(costId, costName, costPayer, costValue) {
        this._costNameText.innerHTML = `<b>${costName}</b>`;
        this._costsPayerText.innerHTML = `Оплатил: <span class="colortext">${costPayer}</span>`;
        this._costsValueText.textContent = `${costValue} ₽`;
        return this;
    }

    _setListeners() {
        this._deleteButton.addEventListener('click', this._deleteHandler);
        this._cost.addEventListener('click', this._clickHandler);
        return this;
    }
}