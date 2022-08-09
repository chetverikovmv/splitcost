// состояния при работе с главным меню
import {
    selectors
} from "./constants.js";
import {
    main
} from "./main-content.js";
import {
    mobileMenu
} from "./menu.js";
// import {
//     Backend
// } from "./backend.js";
import {
    calculations
} from "./calculations-page.js";


const {
    menuSelectors: {
        siteListItemActiveClass,
        siteListItemMainSelector,
        siteListItemCalculationsSelector,
        siteListItemHowToUseSelector,
        siteListItemAboutSelector,
    },
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
        nextStepSelector,
        pageMainSelector,
        loadingSelector,
        pageMainInnerClass,
        displayNoneClass,
    },
    arrowButtons: {
        arrowNavSelector,
    },
    menuPagesSelectors: {
        calculationsSelector,
        howToUseSelector,
        aboutSelector,
    },

    calculationsSelectors: {
        defaultHtmlText,
    },
} = selectors;

const pageHeader = document.querySelector(pageHeaderSelector);
const headingH1 = document.querySelector(headingH1Selector);
const headingH2 = document.querySelector(headingH2Selector);
const nextStepSection = document.querySelector(nextStepSelector);
const pageMain = document.querySelector(pageMainSelector);
const arrowNav = document.querySelector(arrowNavSelector);
const loadingSection = document.querySelector(loadingSelector);

const membersSection = document.querySelector(membersSectionSelector);
const costsSection = document.querySelector(costsSectionSelector);
const resultSection = document.querySelector(resultSectionSelector);

const siteListItemMain = document.querySelector(siteListItemMainSelector);
const siteListItemCalculations = document.querySelector(siteListItemCalculationsSelector);
const siteListItemHowToUse = document.querySelector(siteListItemHowToUseSelector);
const siteListItemAbout = document.querySelector(siteListItemAboutSelector);

const calculationsSection = document.querySelector(calculationsSelector);
const howToUseSection = document.querySelector(howToUseSelector);
const aboutSection = document.querySelector(aboutSelector);

export const menu = {
    status: '',

    enableMainMode() {
        loadingSection.classList.add(displayNoneClass);
        mobileMenu.closeMobileMenu();
        headingH2.textContent = '';        

        arrowNav.classList.remove(displayNoneClass);
        nextStepSection.classList.remove(displayNoneClass);

        siteListItemMain.classList.add(siteListItemActiveClass);
        siteListItemCalculations.classList.remove(siteListItemActiveClass);
        siteListItemHowToUse.classList.remove(siteListItemActiveClass);
        siteListItemAbout.classList.remove(siteListItemActiveClass);

        if (!main.status) {
            main.status = 'MembersMode'
        }

        switch (main.status) {


            case 'MembersMode':
                main.enableMembersMode();
                break;

            case 'CostsMode':
                main.enableCostsMode();
                break;

            case 'ResultMode':
                main.enableResultMode();
                break;
        }

        calculationsSection.classList.add(displayNoneClass);
        howToUseSection.classList.add(displayNoneClass);
        aboutSection.classList.add(displayNoneClass);

        this.status = 'MainMode'
    },

    enableCalculationsMode() {
        loadingSection.classList.add(displayNoneClass);
        mobileMenu.closeMobileMenu();
        headingH2.textContent = '';

        arrowNav.classList.add(displayNoneClass);

        siteListItemMain.classList.remove(siteListItemActiveClass);
        siteListItemCalculations.classList.add(siteListItemActiveClass);
        siteListItemHowToUse.classList.remove(siteListItemActiveClass);
        siteListItemAbout.classList.remove(siteListItemActiveClass);

        pageHeader.classList.add(pageHeaderInnerClass);
        pageMain.classList.add(pageMainInnerClass);

        membersSection.classList.add(displayNoneClass);
        costsSection.classList.add(displayNoneClass);
        resultSection.classList.add(displayNoneClass);

        headingH1.textContent = 'Мои расчеты';
        nextStepSection.classList.add(displayNoneClass);

        calculationsSection.classList.remove(displayNoneClass);
        howToUseSection.classList.add(displayNoneClass);
        aboutSection.classList.add(displayNoneClass);

        // const backend = new Backend();
        calculations.render(calculationsSelector, defaultHtmlText);

        this.status = 'Calculations'
    },

    enableHowToUseMode() {
        loadingSection.classList.add(displayNoneClass);
        mobileMenu.closeMobileMenu();
        headingH2.textContent = '';

        arrowNav.classList.add(displayNoneClass);

        siteListItemMain.classList.remove(siteListItemActiveClass);
        siteListItemCalculations.classList.remove(siteListItemActiveClass);
        siteListItemHowToUse.classList.add(siteListItemActiveClass);
        siteListItemAbout.classList.remove(siteListItemActiveClass);

        pageHeader.classList.add(pageHeaderInnerClass);
        pageMain.classList.add(pageMainInnerClass);

        membersSection.classList.add(displayNoneClass);
        costsSection.classList.add(displayNoneClass);
        resultSection.classList.add(displayNoneClass);

        headingH1.textContent = 'Как пользоваться SplitCost';
        nextStepSection.classList.add(displayNoneClass);

        calculationsSection.classList.add(displayNoneClass);
        howToUseSection.classList.remove(displayNoneClass);
        aboutSection.classList.add(displayNoneClass);

        this.status = 'HowToUseMode'
    },

    enableAboutMode() {
        loadingSection.classList.add(displayNoneClass);
        mobileMenu.closeMobileMenu();
        headingH2.textContent = '';

        arrowNav.classList.add(displayNoneClass);

        siteListItemMain.classList.remove(siteListItemActiveClass);
        siteListItemCalculations.classList.remove(siteListItemActiveClass);
        siteListItemHowToUse.classList.remove(siteListItemActiveClass);
        siteListItemAbout.classList.add(siteListItemActiveClass);

        pageHeader.classList.add(pageHeaderInnerClass);
        pageMain.classList.add(pageMainInnerClass);

        membersSection.classList.add(displayNoneClass);
        costsSection.classList.add(displayNoneClass);
        resultSection.classList.add(displayNoneClass);

        headingH1.textContent = 'О проекте SplitCost';
        nextStepSection.classList.add(displayNoneClass);

        calculationsSection.classList.add(displayNoneClass);
        howToUseSection.classList.add(displayNoneClass);
        aboutSection.classList.remove(displayNoneClass);

        this.status = 'AboutMode'
    },

    enableLoadingMode() {
        loadingSection.classList.remove(displayNoneClass);
        mobileMenu.closeMobileMenu();
        headingH2.textContent = '';

        arrowNav.classList.add(displayNoneClass);

        siteListItemMain.classList.remove(siteListItemActiveClass);
        siteListItemCalculations.classList.remove(siteListItemActiveClass);
        siteListItemHowToUse.classList.remove(siteListItemActiveClass);
        siteListItemAbout.classList.remove(siteListItemActiveClass);

        pageHeader.classList.add(pageHeaderInnerClass);
        pageMain.classList.add(pageMainInnerClass);

        membersSection.classList.add(displayNoneClass);
        costsSection.classList.add(displayNoneClass);
        resultSection.classList.add(displayNoneClass);

        headingH1.textContent = '';
        nextStepSection.classList.add(displayNoneClass);

        calculationsSection.classList.add(displayNoneClass);
        howToUseSection.classList.add(displayNoneClass);
        aboutSection.classList.add(displayNoneClass);

        this.status = 'LoadingMode'
    },
}