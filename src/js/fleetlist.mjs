export default class FleetList {
    constructor(targetGridId) {
        this.gridElement = document.getElementById(targetGridId);
        this.vehicles = [];
    }

    /**
     * Builds responsive asset visual display components dynamically with Proactive Alerts
     */
    render(fleetData) {
        if (!this.gridElement) return;

        if (fleetData.length === 0) {
            this.gridElement.innerHTML = `<p class="loading-msg">No active fleet parameters match your search criteria.</p>`;
            return;
        }

        this.gridElement.innerHTML = fleetData.map(v => {
            let badgeClass = 'status-active';
            if (v.status === 'In Service') badgeClass = 'status-service';
            if (v.status === 'In Transit') badgeClass = 'status-transit';

            const displayOdometer = v.status === "In Transit" ? "Not Applicable" : `${v.currentOdometer.toLocaleString()} km`;
            const displayDriver = v.assignedDriver || "Unassigned";

            // --- PROACTIVE MAINTENANCE ALERT WIDGET SYSTEM ---
            let alertBannerHTML = '';
            const MAINTENANCE_THRESHOLD = 5000; // 5,000 km mileage limit

            if (v.status !== "In Transit") {
                const mileageDelta = v.currentOdometer - v.lastServiceOdometer;

                if (mileageDelta >= MAINTENANCE_THRESHOLD) {
                    alertBannerHTML = `
                        <div class="maintenance-alert alert-active" style="background-color: #721c24; color: #f8d7da; padding: 6px 10px; margin: 8px 0; border-radius: 4px; font-size: 0.85rem; font-weight: bold; border-left: 4px solid #dc3545;">
                            ⚠️ WARNING: Service Overdue by ${(mileageDelta - MAINTENANCE_THRESHOLD).toLocaleString()} km!
                        </div>
                    `;
                } else {
                    alertBannerHTML = `
                        <div class="maintenance-alert alert-nominal" style="background-color: #155724; color: #d4edda; padding: 6px 10px; margin: 8px 0; border-radius: 4px; font-size: 0.85rem; border-left: 4px solid #28a745;">
                            ✅ Status: Nominal (${(MAINTENANCE_THRESHOLD - mileageDelta).toLocaleString()} km remaining)
                        </div>
                    `;
                }
            }

            return `
                <article class="vehicle-card" data-id="${v.vehicleId}">
                    <header class="card-header">
                        <h4>${v.makeModel}</h4>
                        <span class="status-badge ${badgeClass}">${v.status}</span>
                    </header>
                    
                    ${alertBannerHTML}

                    <div class="card-body">
                        <p><strong>Asset ID:</strong> <code>${v.vehicleId}</code></p>
                        <p><strong>Powertrain:</strong> ${v.engineType}</p>
                        <p><strong>Current Log:</strong> ${displayOdometer}</p>
                        <p><strong>Driver Assignee:</strong> ${displayDriver}</p>
                    </div>
                    <footer class="card-footer">
                        <a href="./vehicle-details.html?id=${v.vehicleId}" class="view-details-btn">View Metrics Deep-Dive →</a>
                    </footer>
                </article>
            `;
        }).join('');
    }

    /**
     * Attaches interactive input and selector filter query mechanics safely
     */
    setupFilters(searchId, filterDropdownId) {
        const searchInput = document.getElementById(searchId);
        const statusFilter = document.getElementById(filterDropdownId);

        const executeFilterLogic = () => {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const statusCriteria = statusFilter ? statusFilter.value : 'all';

            const filteredResults = this.vehicles.filter(v => {
                const targetId = v.vehicleId ? v.vehicleId.toLowerCase() : '';
                const targetModel = v.makeModel ? v.makeModel.toLowerCase() : '';
                const targetDriver = v.assignedDriver ? v.assignedDriver.toLowerCase() : '';

                const matchesSearch =
                    targetId.includes(query) ||
                    targetModel.includes(query) ||
                    targetDriver.includes(query);

                const matchesStatus = statusCriteria === 'all' || v.status === statusCriteria;

                return matchesSearch && matchesStatus;
            });

            this.render(filteredResults);
        };

        searchInput?.addEventListener('input', executeFilterLogic);
        statusFilter?.addEventListener('change', executeFilterLogic);
    }
}