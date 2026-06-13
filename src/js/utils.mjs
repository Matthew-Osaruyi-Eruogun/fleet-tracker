import FleetList from './fleetlist.mjs';
import defaultFleetData from '../json/fleet.json'; // Vite bundles this directly into production!

document.addEventListener('DOMContentLoaded', () => {
    const cachedData = localStorage.getItem('fleet_data');
    const targetGridId = 'fleetGrid';

    // Initialize tracking engine without needing an unstable URL path string
    const fleetTracker = new FleetList(targetGridId);

    if (cachedData) {
        fleetTracker.vehicles = JSON.parse(cachedData);
    } else {
        // Seed local storage with your bundled dataset automatically
        fleetTracker.vehicles = defaultFleetData;
        localStorage.setItem('fleet_data', JSON.stringify(defaultFleetData));
    }

    // Render the dataset to your dashboard immediately
    fleetTracker.render(fleetTracker.vehicles);

    // Attach search and status dropdown tracking filters
    fleetTracker.setupFilters('fleetSearch', 'statusFilter');

    // Append Developer Tools Reset Cache System Component
    injectSystemResetButton();
});

function injectSystemResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.id = 'devCacheResetBtn';
    resetBtn.innerHTML = '🔄 Reset Demo Cache';
    resetBtn.style.position = 'fixed';
    resetBtn.style.bottom = '20px';
    resetBtn.style.right = '20px';
    resetBtn.style.padding = '10px 16px';
    resetBtn.style.backgroundColor = '#1a1a1a';
    resetBtn.style.color = 'var(--safety-amber, #ffb300)';
    resetBtn.style.border = '1px solid var(--border-color, #333)';
    resetBtn.style.borderRadius = '4px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.zIndex = '9999';

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset system data layers?')) {
            localStorage.removeItem('fleet_data');
            window.location.reload();
        }
    });
    document.body.appendChild(resetBtn);
}