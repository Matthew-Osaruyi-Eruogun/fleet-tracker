import FleetList from './fleetlist.mjs'; // Synchronized file reference

document.addEventListener('DOMContentLoaded', async () => {
    const cachedData = localStorage.getItem('fleet_data');
    const targetGridId = 'fleetGrid';

    // Use a clean relative path for Vite asset pipelines
    const defaultJsonPath = './json/fleet.json';

    const fleetTracker = new FleetList(defaultJsonPath, targetGridId);

    if (cachedData) {
        // If local cache exists, seed the dataset directly and skip network load
        fleetTracker.vehicles = JSON.parse(cachedData);
        fleetTracker.render(fleetTracker.vehicles);
    } else {
        // Fetch original JSON assets safely if uninitialized
        await fleetTracker.init();
        if (fleetTracker.vehicles.length > 0) {
            localStorage.setItem('fleet_data', JSON.stringify(fleetTracker.vehicles));
        }
    }

    // Attach search and status dropdown tracking filters
    fleetTracker.setupFilters('fleetSearch', 'statusFilter');

    // Append Developer Tools Reset Cache System Component
    injectSystemResetButton();
});

/**
 * Injects a fixed desktop action element to clear local data storage arrays during runtime testing.
 */
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
    resetBtn.style.fontSize = '0.85rem';
    resetBtn.style.fontWeight = '500';
    resetBtn.style.zIndex = '9999';
    resetBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.6)';
    resetBtn.style.transition = 'background-color 0.2s ease, border-color 0.2s ease';

    resetBtn.addEventListener('mouseenter', () => {
        resetBtn.style.backgroundColor = '#262626';
        resetBtn.style.borderColor = 'var(--safety-amber, #ffb300)';
    });
    resetBtn.addEventListener('mouseleave', () => {
        resetBtn.style.backgroundColor = '#1a1a1a';
        resetBtn.style.borderColor = 'var(--border-color, #333)';
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset system data layers? This action clears all localized odometer history logs and resets the configuration matrices back to default templates.')) {
            localStorage.removeItem('fleet_data');
            window.location.reload();
        }
    });

    document.body.appendChild(resetBtn);
}