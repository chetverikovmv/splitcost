import {
    menu
} from "./main-menu.js";
import {
    main
} from "./main-content.js";
import {
    calculations
} from "./calculations-page.js";

const locationResolver = (location) => {
    const calculationId = location.slice(2);

    switch (location) {
        case "#/":
            menu.enableMainMode();
            break;

        case "#/calculations":
            menu.enableCalculationsMode();
            break;

        case "#/how-to-use":
            menu.enableHowToUseMode();
            break;

        case "#/about":
            menu.enableAboutMode();
            break;

        case `#/${calculationId}`:
            calculations.showCalculationByLink(calculationId);
            break;
    }
}

window.addEventListener('load', () => {
    let location = '#/';
    if (window.location.hash) {
        location = window.location.hash;
    };
    if (location === '#/') {
        main.status = 'MembersMode'
    }

    locationResolver(location)
})

window.locationResolver = locationResolver; // чтобы работал onclick в разметке