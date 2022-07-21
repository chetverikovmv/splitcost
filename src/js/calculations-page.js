import {
    selectors
} from "./constants.js";
import {
    CalculationCard
} from "./Calculation-card.js";
import {
    PopupWithMessage
} from "./popup-with-message.js";
import {
    members
} from "./members.js";
import {
    costs
} from "./costs.js";
import {
    menu
} from "./main-menu.js";
import {
    sectionResult
} from "./section-result.js";
import {
    main
} from "./main-content.js";
import {
    sectionMembers
} from "./section-members.js";
import {
    sectionCosts
} from "./section-costs.js";
import {
    Backend
} from "./backend.js";

const {
    popupsSelectors: {
        popupMessageSelector,
    },
    menuPagesSelectors: {
        calculationsSelector,
    },
    mainSelectors: {
        displayNoneClass
    },
    calculationsSelectors: {
        defaultHtmlText,
        templateCalculation,
    },
} = selectors;

const confirmTransitionToCalculationPopup = new PopupWithMessage(
    popupMessageSelector,

    () => { // по клику на "да" (сабмит)
        const currentCalculationId = confirmTransitionToCalculationPopup._cardElement.calculationId
        
        members.eventName = confirmTransitionToCalculationPopup._cardElement.eventName;
        members.membersList = confirmTransitionToCalculationPopup._cardElement.calculationMembers;
        members.calculationId = currentCalculationId; // удалить

        localStorage.setItem('current', currentCalculationId);
        menu.enableMainMode();

        sectionResult.makeLinkToCalculation(currentCalculationId);
        window.location.hash = `#/${currentCalculationId}`;
        costs.costsList = confirmTransitionToCalculationPopup._cardElement.calculationCosts;


        // window.location.hash = '#/';
        // window.locationResolver('#/');

        calculations.clearAndRenderCalculation();

        confirmTransitionToCalculationPopup.close();
    },

    () => { // по клику на "отмена"
        confirmTransitionToCalculationPopup.close();
    }
);

const configureCard = (calculation, calculationNumber) => {
    const date = new Date(calculation.date).toLocaleDateString();
    const time = new Date(calculation.date).toLocaleTimeString();

    return new CalculationCard(templateCalculation, calculation.eventName, calculationNumber + 1, date, time, calculation.id, calculation.members, calculation.costs, {
        clickHandler(evt) {
            evt.preventDefault();
            confirmTransitionToCalculationPopup._cardElement = this;
            confirmTransitionToCalculationPopup.open('Перейти к расчету', 'Вы уверены?', 'да', 'отмена');
        }
    }).configureCalculationCard().getCalculationCard()

};

const invaliLinkPopup = new PopupWithMessage(
    popupMessageSelector,

    () => { // по клику на "да" (сабмит)      
        invaliLinkPopup.close();
    },

    () => { // по клику на "отмена"
        invaliLinkPopup.close();
    }
);

export const calculations = {
    mergeOriginalObjects(eventName, calcuulationId, members, costs) {
        return {
            eventName,
            members,
            costs
        }
    },

    clearAndRenderCalculation() {
        sectionMembers.clearMembers();
        sectionMembers.renderMembers();
        sectionMembers.eventNameInput.value = members.eventName;


        sectionCosts.clearCosts();
        sectionCosts.renderCosts();
        sectionCosts.costsTextHint.classList.add(displayNoneClass);

        sectionResult.clearResults();
        sectionResult.calculateResult();
        main.enableResultMode();
    },

    render(nodeSelector, defaultHtmlText) {
        const calculations = JSON.parse(localStorage.getItem('original-objects') || '[]');
        const node = document.querySelector(nodeSelector);

        node.innerHTML = '';

        calculations.length ?
            calculations.forEach((calculation, calculationNumber) => {
                node.prepend(configureCard(calculation, calculationNumber));
            }) :
            node.innerHTML = defaultHtmlText;

    },

    showCalculationByLink(calculationId) {
        const backend = new Backend();
        backend.read(calculationId)
            .then(result => {
                if (result) {
                members.eventName = result.eventName;
                members.membersList = result.members;
                localStorage.setItem('current', calculationId);
                sectionResult.makeLinkToCalculation(localStorage.getItem('current'));
                costs.costsList = result.costs;

                calculations.clearAndRenderCalculation();
                } else {
                    invaliLinkPopup.open('Такого расчета нет', 'проверьте адрес ссылки на расчет', 'OK', 'no cancel button')
                }
            })
    },

    setListeners() {
        window.addEventListener('load', this.render(calculationsSelector, defaultHtmlText))
    },
}

calculations.setListeners();