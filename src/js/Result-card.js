import {
    selectors
} from "./constants.js";

const {
    resultSelectors: {
        resultCardSelector,
        resultTextSelector
    },

} = selectors;

export class ResultCard {
    constructor(
        templateSelector, isPair, isPaymentWithinPair, summ, creditor, name1, name2 = ''
    ) {
        this.isPair = isPair;
        this.isPaymentWithinPair = isPaymentWithinPair;
        this.summ = summ;
        this.creditor = creditor;
        this.name1 = name1;
        this.name2 = name2;

        this._template = document
            .querySelector(templateSelector)
            .content.querySelector(resultCardSelector);
    }

    _getTemplate() {
        return this._template.cloneNode(true);
    }

    configureResultCard() {
        this._resultCard = this._getTemplate();

        this._resultText = this._resultCard.querySelector(resultTextSelector);

        this.setProperties(this.isPair, this.isPaymentWithinPair, this.summ, this.creditor, this.name1, this.name2);
        return this;
    }

    getResultCard() {
        return this._resultCard;
    }

    setProperties(isPair, isPaymentWithinPair, summ, creditor, name1, name2) {        
        if (isPair) {
            this._resultText.innerHTML = `<span class="colortext">${name1}</span> (в паре с <b>${name2}</b>) переводит <b>${summ} ₽</b> в адрес <span class="colortext">${creditor}</span>`
        } else {
            isPaymentWithinPair ?
                this._resultText.innerHTML = `<span class="graytext">Внутри пары:</span> <b>${name1}</b> переводит <b>${summ} ₽</b> в адрес <b>${creditor}</b>` :
                this._resultText.innerHTML = `<span class="colortext">${name1}</span> переводит <b>${summ} ₽</b> в адрес <span class="colortext">${creditor}</span>`
        }
        return this;
    }
}