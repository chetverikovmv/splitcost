import {
    menu
} from "./main-menu.js";
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
            menu.enableMainMode();
            calculations.showCalculationByLink(calculationId);
            break;
    }
}

window.addEventListener('load', () => {
    const location = window.location.hash;

    if (location) {
        locationResolver(location)
    }
})

window.locationResolver = locationResolver; // чтобы работал onclick в разметке