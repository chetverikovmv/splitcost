export const keyCodes = {
    enterKeyCode: 'Enter',
    escapeKeyCode: 'Escape',
};

export const selectors = {

    menuSelectors: {
        navMainSelector: '.main-nav',
        navToggleSelector: '.main-nav__toggle',
        navCloseSelector: '.main-nav__close',
        containerSelector: '.container',
        barWrapperSelector: '.main-nav__bar-wrapper',

        siteListItemMainSelector: '.site-list__item--main',
        siteListItemCalculationsSelector: '.site-list__item--calculations',
        siteListItemHowToUseSelector: '.site-list__item--how-to-use',
        siteListItemAboutSelector: '.site-list__item--about',
        siteListItemActiveClass: 'site-list__item--active',
    },

    headerSelectors: {
        pageHeaderSelector: '.page-header',

        pageHeaderInnerClass: 'page-header--inner',
    },

    mainSelectors: {
        headingH1Selector: '.heading-h1',
        headingH2Selector: '.heading-h2',
        membersSectionSelector: '.members',
        costsSectionSelector: '.costs',
        resultSectionSelector: '.result',
        nextStepSelector: '.next-step',
        nextStepButtonSelector: '.next-step__button',
        pageMainSelector: '.page-main',
        loadingSelector: '.loading',


        pageMainInnerClass: 'page-main--inner',
        displayNoneClass: 'display-none',
    },

    arrowButtons: {
        arrowNavSelector: '.arrow-nav',
        arrowButtonMembersSelector: '.arrow-list__item--members',
        arrowButtonCostsSelector: '.arrow-list__item--costs',
        arrowButtonResultsSelector: '.arrow-list__item--results',

        arrowButtonActiveClass: 'arrow-list__item--active',
    },

    membersSelectors: {
        eventNameSelector: '#event-name',
        addMemberButtonSelector: '.members__button',
        membersDeleteButtonSelector: '.members__delete',
        memberSelector: '.members__member',
        memberNameSelector: '.members__member-name',
        memberPairSelector: '.members__member-pair',
        validationMessageMemberSelector: '.validation-message-member',
        templateMember: '.template-member',

    },

    costsSelectors: {
        addCostButtonSelector: '.costs__button',
        costSelector: '.costs__cost',
        costNameSelector: '.costs__cost-name',
        costsPayerSelector: '.costs__payer',
        costsValueSelector: '.costs__value',
        costsDeleteSelector: '.costs__delete',
        checkboxSelector: ".checkbox-input",
        FiftyFiftySelector: "#fifty-fifty",
        validationMessageCostSelector: '.validation-message-cost',
        costsTextSelector: '.costs__text',
        templateCost: '.template-cost',
        templateCostUser: '.template-cost-user',
    },

    resultSelectors: { 
        resultCardSelector: '.result__card',
        resultTextSelector: '.result__text',
        resultCopySelector: '.result__wrapper',
        resultCopyButtonSelector: '.result__copy',
        resultTextLinkSelector: '.result__text-link',
        resultCopyLinkButtonSelector: '.result__copy-link',
        resultStatsSelector: '.result__stats',
        resultStatsBodySelector: '.result__stats-body',  
        resultStatsHeaderSelector: '.result__stats-header',          
        resultStatsTotalSelector: '.result__stats-total',  
        arrowIconSelector: '.arrow-icon ',  
        templateResult: '.template-result',
        domain: 'https://splitcost.ru/'
    },

    calculationsSelectors: {
        calculationCardSelector: '.calculation__card',
        calculationTextSelector: '.calculation__text',
        templateCalculation: '.template-calculations',
        defaultHtmlText: `<p class="calculations__text">Здесь будут указаны Ваши расчеты.</p>`,
    },


    modalSelectors: {
        exitButtonSelector: '.modal__exit-button',
        modalShowClass: 'modal-show',
    },

    modalCostSelectors: {
        selectSelector: '.select',
    },

    popupsSelectors: {
        popupMessageSelector: '.popup-message',
        popupAddCostSelector: '.popup-cost',
    },

    popupWithMessageSelectors: {
        messageHeadingSelector: '.modal-message__heading-text',
        messageTextSelector: '.modal-message__text',
        messageButtonSelector: '.modal-message__button',
        messageButtonCancelSelector: '.modal-message__button-cancel',
    },

    popupWithFormSelectors: {
        formSelector: ".form",
        inputSelector: ".input",
        submitButtonSelector: ".button-type-submit",
        headerSelector: ".h2-site",
        userListSelector: ".modal-cost__users-list",
    },

    notificationSelectors: {
        notificationSelector: ".notification",
        notificationTextSelector: ".notification__text",
        notificationExitButtonSelector: ".notification__exit-button",
        notificationShowClass: "notification-show",
    },

    menuPagesSelectors: {
        calculationsSelector: '.calculations',
        howToUseSelector: '.how-to-use',
        aboutSelector: '.about',
    },

    canvasSelectors: {
        canvasSumOfCostPerUserSelector: '#canvas-sum-of-cost-per-user',
        canvasBalanceSelector: '#canvas-balance',
    }
};