import {
    selectors
} from "./constants.js";

const {
    calculationsSelectors: {
        calculationCardSelector,
        calculationTextSelector
    },
} = selectors;

export class CalculationCard {
    constructor(
        templateSelector, eventName, calculationNumber, date, time, calculationId, calculationMembers, calculationCosts,
        {
            clickHandler
        }
    ) {
        this.eventName = eventName;
        this.calculationNumber = calculationNumber;
        this.date = date;
        this.time = time;
        this.calculationId = calculationId;
        this.calculationMembers = calculationMembers;
        this.calculationCosts = calculationCosts;
        this._clickHandler = clickHandler.bind(this);

        this._template = document
            .querySelector(templateSelector)
            .content.querySelector(calculationCardSelector);
    }

    _getTemplate() {
        return this._template.cloneNode(true);
    }

    configureCalculationCard() {
        this._calculationCard = this._getTemplate();

        this._calculationText = this._calculationCard.querySelector(calculationTextSelector);

        this.setProperties(this.eventName, this.calculationNumber, this.date, this.time);
        this._setListeners();
        return this;
    }

    getCalculationCard() {
        return this._calculationCard;
    }

    setProperties(eventName, calculationNumber, date, time) {
        eventName ?
            this._calculationText.innerHTML = `<b>Расчет №${calculationNumber}</b> (${eventName}) от ${date}, ${time}` :
            this._calculationText.innerHTML = `<b>Расчет №${calculationNumber}</b> от ${date}, ${time}`;

        return this;
    }

    _setListeners() {
        this._calculationCard.addEventListener('click', this._clickHandler);
        return this;
    }
}