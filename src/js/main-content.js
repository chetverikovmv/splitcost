import {
    selectors
} from "./constants.js";

import {
    members
} from "./members.js";

import {
    Notification
} from "./Notification.js";

const {
    headerSelectors: {
        pageHeaderSelector,
        pageHeaderInnerClass,
    },
    mainSelectors: {
        headingH1Selector,
        headingH2Selector,
        membersSectionSelector,
        costsSectionSelector,
        resultSectionSelector,
        nextStepButtonSelector,
        pageMainSelector,
        pageMainInnerClass,
        displayNoneClass,
    },
    arrowButtons: {
        arrowButtonMembersSelector,
        arrowButtonCostsSelector,
        arrowButtonResultsSelector,
        arrowButtonActiveClass,
    },

    membersSelectors: {
        addMemberButtonSelector,
        membersDeleteButtonSelector
    },

} = selectors;

const pageHeader = document.querySelector(pageHeaderSelector);
const headingH1 = document.querySelector(headingH1Selector);
const headingH2 = document.querySelector(headingH2Selector);
const nextStepButton = document.querySelector(nextStepButtonSelector);
const pageMain = document.querySelector(pageMainSelector);

const arrowMemberLink = document.querySelector(arrowButtonMembersSelector);
const arrowCostsLink = document.querySelector(arrowButtonCostsSelector);
const arrowResultLink = document.querySelector(arrowButtonResultsSelector);

const membersSection = document.querySelector(membersSectionSelector);
const costsSection = document.querySelector(costsSectionSelector);
const resultSection = document.querySelector(resultSectionSelector);

const addMemberButton = document.querySelector(addMemberButtonSelector);

const diabledNotif = new Notification();

function showNotifIfDisabled() {
    diabledNotif.open('отредактировать участников уже нельзя!', 4000);
}

const disabledOn = () => {
    const allInputs = document.querySelectorAll('input');
    const allSelects = document.querySelectorAll('select');
    const membersDeleteButtons = document.querySelectorAll(membersDeleteButtonSelector);

    allInputs.forEach(input => {
        input.disabled = true; 
    })

    allSelects.forEach(select => {
        select.disabled = true;
    })

    membersDeleteButtons.forEach(button => {
        button.disabled = true;
        button.classList.add(displayNoneClass)
    })

    addMemberButton.disabled = true;
    setTimeout(showNotifIfDisabled, 200)
}

const disabledOff = () => {
    const allInputs = document.querySelectorAll('input');
    const allSelects = document.querySelectorAll('select');
    const membersDeleteButtons = document.querySelectorAll(membersDeleteButtonSelector);

    allInputs.forEach(input => {
        input.disabled = false;
    })

    allSelects.forEach(select => {
        select.disabled = false;
    })

    membersDeleteButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove(displayNoneClass)
    })

    addMemberButton.disabled = false;
}

export const main = {
    status: '',

    enableMembersMode() {
        headingH2.textContent = '';

        arrowMemberLink.classList.add(arrowButtonActiveClass);
        arrowCostsLink.classList.remove(arrowButtonActiveClass);
        arrowResultLink.classList.remove(arrowButtonActiveClass);

        pageHeader.classList.remove(pageHeaderInnerClass);
        pageMain.classList.remove(pageMainInnerClass);

        membersSection.classList.remove(displayNoneClass);
        costsSection.classList.add(displayNoneClass);
        resultSection.classList.add(displayNoneClass);

        headingH1.textContent = 'Участники мероприятия';
        nextStepButton.innerHTML = `<span class="next-step--hidden-text-mobile">далее</span><span
        class="next-step--hidden-text-tablet">перейти </span><span class="next-step--hidden-text-dt">к
        записи расходов</span> >>>`;

        disabledOff();

        this.status = 'MembersMode';
    },

    enableDisabledMembersMode() {
        headingH2.textContent = '';

        arrowMemberLink.classList.add(arrowButtonActiveClass);
        arrowCostsLink.classList.remove(arrowButtonActiveClass);
        arrowResultLink.classList.remove(arrowButtonActiveClass);

        pageHeader.classList.remove(pageHeaderInnerClass);
        pageMain.classList.remove(pageMainInnerClass);

        membersSection.classList.remove(displayNoneClass);
        costsSection.classList.add(displayNoneClass);
        resultSection.classList.add(displayNoneClass);

        headingH1.textContent = 'Участники мероприятия';
        nextStepButton.innerHTML = `<span class="next-step--hidden-text-mobile">далее</span><span
        class="next-step--hidden-text-tablet">перейти </span><span class="next-step--hidden-text-dt">к
        записи расходов</span> >>>`;

        disabledOn();

        this.status = 'DisabledMembersMode';
    },

    enableCostsMode() {
        headingH2.textContent = '';

        arrowCostsLink.classList.add(arrowButtonActiveClass);
        arrowMemberLink.classList.remove(arrowButtonActiveClass);
        arrowResultLink.classList.remove(arrowButtonActiveClass);

        pageHeader.classList.add(pageHeaderInnerClass);
        pageMain.classList.add(pageMainInnerClass);

        membersSection.classList.add(displayNoneClass);
        costsSection.classList.remove(displayNoneClass);
        resultSection.classList.add(displayNoneClass);

        headingH1.textContent = 'Внесение расходов';
        nextStepButton.innerHTML = `<span class="next-step--hidden-text-tablet">перейти к </span>результат<span class="next-step--hidden-text-tablet">у</span> расчета >>>`;

        disabledOff();

        this.status = 'CostsMode';
    },

    enableResultMode() {
        arrowResultLink.classList.add(arrowButtonActiveClass);
        arrowMemberLink.classList.remove(arrowButtonActiveClass);
        arrowCostsLink.classList.remove(arrowButtonActiveClass);

        pageHeader.classList.add(pageHeaderInnerClass);
        pageMain.classList.add(pageMainInnerClass);

        membersSection.classList.add(displayNoneClass);
        costsSection.classList.add(displayNoneClass);
        resultSection.classList.remove(displayNoneClass);

        headingH1.textContent = 'Результат расчёта';
        members.eventName ? headingH2.textContent = members.eventName : headingH2.textContent = '';

        disabledOff();

        nextStepButton.innerHTML = `новый расчет`;
        this.status = 'ResultMode';
    },
}