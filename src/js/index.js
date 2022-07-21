import "../index.html"

import "../style/index.scss";

import "./constants.js"; // константы
import "./menu.js"; // мобильное меню
import "./Popup.js"; // класс Popup
import "./popup-with-message.js"; // класс PopupWithMessage extends Popup
import "./popup-with-form.js"; // класс PopupWithForm extends Popup
import "./main-content.js"; // управление состояниями главной страницы
import "./members.js"; // объект с данными об участниках
import "./Member.js"; // класс Member
import "./Cost.js"; // класс Cost
import "./costs.js"; // объект с данными о расходах
import "./result.js"; // объект с данными о результатах расчета
import "./Result-card.js"; // класс ResultCard
import "./Notification.js"; // класс Notification
import "./main-menu.js"; // уравление состояниями при работе с главным меню
import "./section-members.js"; // раздел "участники"
import "./section-costs.js"; // раздел "расходы"
import "./section-result.js"; // раздел "результат"
import "./location-resolver.js"; // роутер главного меню
import "./backend.js"; // бэкенд
import "./Calculation-card.js"; // класс CalculationCard
import "./calculations-page.js"; // страница "Мои расчеты"

import {
    PopupWithMessage
} from "./popup-with-message.js";
import {
    selectors
} from "./constants.js";
import {
    main
} from "./main-content.js";
import {
    members
} from "./members.js";
import {
    costs
} from "./costs.js";
import {
    result
} from "./result.js";
import {
    menu
} from "./main-menu.js";
import {
    sectionMembers
} from "./section-members.js";
import {
    sectionCosts
} from "./section-costs.js";
import {
    sectionResult
} from "./section-result.js";
import {
    Backend
} from "./backend.js";
import {
    calculations
} from "./calculations-page.js";
import { ResultCard } from "./Result-card.js";

const {
    menuSelectors: {
        siteListItemMainSelector,
        siteListItemHowToUseSelector,
        siteListItemAboutSelector,
    },

    popupsSelectors: {
        popupMessageSelector,
    },

    arrowButtons: {
        arrowButtonMembersSelector,
        arrowButtonCostsSelector,
        arrowButtonResultsSelector
    },

    membersSelectors: {
        memberSelector,
        validationMessageMemberSelector,
    },

    mainSelectors: {
        nextStepButtonSelector,
        displayNoneClass
    },
} = selectors;

/// УПРАВЛЕНИЕ "СТРЕЛОЧНЫМ" МЕНЮ ///

const arrowMemberLink = document.querySelector(arrowButtonMembersSelector);
const arrowCostsLink = document.querySelector(arrowButtonCostsSelector);
const arrowResultLink = document.querySelector(arrowButtonResultsSelector);

arrowMemberLink.addEventListener('click', (evt) => { // кнопка "УЧАСТНИКИ"
    evt.preventDefault();
    switch (main.status) {
        // case 'MembersMode':
        //     break;

        case 'CostsMode':
            confirmBackToMembersFromCosts.open('Вернуться к внесению участников?', `Вся расходы будут удалены!`, 'ОК', 'отмена');
            break;

        case 'ResultMode':
            startNewCalculation();
            break;
    }

});

arrowCostsLink.addEventListener('click', (evt) => { // кнопка "РАСХОДЫ"
    evt.preventDefault();
    switch (main.status) {
        case 'MembersMode':
            checkAndEnableCostMode();
            break;

            // case 'CostsMode':
            //     break;

        case 'ResultMode':
            main.enableCostsMode();
            result.membersList.length = 0;
            result.costsList.length = 0;
            sectionResult.clearResults();
            break;
    }

});

arrowResultLink.addEventListener('click', (evt) => { // кнопка "РЕЗУЛЬТАТ"
    evt.preventDefault();
    switch (main.status) {
        case 'MembersMode':
            confirmNextStepPopup.open('Нельзя перейти сразу к результату', `Сначала введите расходы`, 'ОК', 'no cancel button')
            break;

        case 'CostsMode':
            checkAndEnableResultMode();
            break;

            // case 'ResultMode':
            //     break;
    }

});

/// УПРАВЛЕНИЕ КНОПКОЙ "ДАЛЕЕ" ///

// Подтверждение перехода к расходам при невалидных полях
const confirmNextStepPopup = new PopupWithMessage(
    popupMessageSelector,

    () => { // по клику на "да" (сабмит)
        confirmNextStepPopup.close();
    },

    () => { // по клику на "отмена"
        confirmNextStepPopup.close();
    }
);

// Подтверждение перехода к новому расчету
const confirmNewCalculationPopup = new PopupWithMessage(
    popupMessageSelector,

    () => { // по клику на "да" (сабмит)                
        confirmNewCalculationPopup.close();

        members.membersList = [{
                id: 1,
                name: "",
                pair: 0,
            },
            {
                id: 2,
                name: "",
                pair: 0,
            },
        ];
        costs.costsList.length = 0;
        result.membersList.length = 0;
        result.costsList.length = 0;
        localStorage.removeItem('current');

        window.location.hash = '#/';
        window.locationResolver('#/');

        sectionCosts.costsTextHint.classList.remove(displayNoneClass);

        sectionMembers.clearMembers();
        sectionMembers.renderMembers();
        sectionCosts.clearCosts();
        sectionResult.clearResults();

        members.eventName = '';
        members.calculationId = '';
        sectionMembers.eventNameInput.value = '';

        main.enableMembersMode();
    },

    () => { // по клику на "отмена"
        confirmNewCalculationPopup.close();
    }
);

// Подтверждение перехода из раздела "Расходы" в раздел "Участники"
const confirmBackToMembersFromCosts = new PopupWithMessage(
    popupMessageSelector,

    () => { // по клику на "да" (сабмит)                
        confirmBackToMembersFromCosts.close();

        costs.costsList.length = 0;
        result.membersList.length = 0;
        result.costsList.length = 0;

        sectionCosts.costsTextHint.classList.remove(displayNoneClass);

        sectionCosts.clearCosts();
        sectionResult.clearResults();
        main.enableMembersMode();
    },

    () => { // по клику на "отмена"
        confirmBackToMembersFromCosts.close();
    }
);

// обрабатываем переход по кнопке "далее"
const nextStepButton = document.querySelector(nextStepButtonSelector);

const checkAndEnableCostMode = () => {
    if (checkMembersValidity().length > 0) {
        confirmNextStepPopup.open('Пустые поля', `Заполните пропущенные имена участников`, 'ОК', 'no cancel button')
    }

    if (checkMembersRepeatability()) {
        confirmNextStepPopup.open('Повторные имена участников', `Введите уникальные имена для участников`, 'ОК', 'no cancel button')
    }

    if (checkMembersValidity().length == 0 && !checkMembersRepeatability()) {
        main.enableCostsMode()
    }
}

const sendDataToServer = (method) => {
    const jointOriginalObjects = calculations.mergeOriginalObjects(members.eventName, members.calculationId, members.membersList, costs.costsList);
    jointOriginalObjects.date = new Date().toJSON();
    const backend = new Backend();

    switch (method) {
        case 'POST':
            backend.create(jointOriginalObjects,  sectionResult.makeLinkToCalculation);
            break;

        case 'PATCH':
            backend.change(jointOriginalObjects);
            break;
    }
}

const checkAndSendAndEnable = () => {
    if (localStorage.getItem('current')) {
        sendDataToServer('PATCH');
    } else {
        sendDataToServer('POST');

    }

    main.enableResultMode();

}


const checkAndEnableResultMode = () => {
    sectionResult.calculateResult();   
  
    costs.costsList.length == 0 ?
        confirmNextStepPopup.open('Нет расходов', `Добавьте хотя бы один расход`, 'ОК', 'no cancel button') :
        checkAndSendAndEnable();
}

const startNewCalculation = () => {
    confirmNewCalculationPopup.open('Начать новый расчет?', `Вся информация будет очищена`, 'ОК', 'отмена');
}

nextStepButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    nextStepButton.blur(); // убираем фокус чтобы корректно отробатывало закрытие окна на "enter"    

    switch (main.status) {
        case 'MembersMode':
            checkAndEnableCostMode();
            break;

        case 'CostsMode':
            checkAndEnableResultMode();
            break;

        case 'ResultMode':
            startNewCalculation();
            break;
    }

});

// проверка валидности полей участников
const checkMembersValidity = () => {
    const invalidInputs = [];

    const memberNodes = document.querySelectorAll(memberSelector);

    memberNodes.forEach((itemNode, idNode) => {
        let selectNode = itemNode.querySelector(`#member-name-${idNode+1}`);

        let validationMessage = itemNode.querySelector(validationMessageMemberSelector);

        if (!selectNode.validity.valid) {
            invalidInputs.push(`"Участник №${idNode+1}"`);
            validationMessage.textContent = 'Введите имя'
        }
    })
    return invalidInputs
}

// проверка повторов полей участников
const checkMembersRepeatability = () => {
    const inputs = [];

    let isRepeatMembers = false;

    const memberNodes = document.querySelectorAll(memberSelector);

    memberNodes.forEach((itemNode, idNode) => {
        let selectNode = itemNode.querySelector(`#member-name-${idNode+1}`);
        inputs.push(selectNode.value);
    })

    const uniqInputs = Array.from(new Set(inputs));
    uniqInputs.length == inputs.length ? isRepeatMembers = false : isRepeatMembers = true;

    return isRepeatMembers
}

// Запуск состояний при первой загрузке ///

// запуск режима "Главная" в первый раз
menu.enableMainMode();

// запуск режима "Участники" в первый раз
main.enableMembersMode();

// чистим куррент локалстордж
localStorage.removeItem('current');

// рендерим участников в первый раз
sectionMembers.renderMembers();