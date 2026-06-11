// src/js/FleetList.mjs

export default class FleetList {
    constructor(dataSource, targetGridId) {
        this.dataSource = dataSource;
        this.gridElement = document.getElementById(targetGridId);
        this.vehicles = [];
    }

    /**
     * Fetch original configuration metrics if storage layer is uninitialized
     */
    async init() {
        try {
            const response = await fetch(this.dataSource);
            if (!response.ok) throw new Error(`HTTP stream status failed: ${response.status}`);
            this.vehicles = await response.json();
            this.render(this.vehicles);
        } catch (error) {
            console.error("Critical error loading inventory matrix source streams:", error);
            if (this.gridElement) {
                this.gridElement.innerHTML = `<p class="feedback-error">Failed to synchronize active tracking systems.</p>`;
            }
        }
    }

    /**
     * Builds responsive asset visual display components dynamically 
     */
    render(fleetData) {
        if (!this.gridElement) return;

        if (fleetData.length === 0) {
            this.gridElement.innerHTML = `<p class="loading-msg">No active fleet parameters match your search criteria.</p>`;
            return;
        }

        this.gridElement.innerHTML = fleetData.map(v => {
            // Determine structural status styling markers
            let badgeClass = 'status-active';
            if (v.status === 'In Service') badgeClass = 'status-service';
            if (v.status === 'In Transit') badgeClass = 'status-transit';

            // Build dynamic display metadata contexts safely
            const displayOdometer = v.status === "In Transit" ? "Not Applicable" : `${v.currentOdometer.toLocaleString()} km`;
            const displayDriver = v.assignedDriver || "Unassigned";

            return `
                <article class="vehicle-card">
                    <header class="card-header">
                        <h4>${v.makeModel}</h4>
                        <span class="status-badge ${badgeClass}">${v.status}</span>
                    </header>
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
     * Attaches interactive keyup and selector input filter query mechanics
     */
    setupFilters(searchId, filterDropdownId) {
        const searchInput = document.getElementById(searchId);
        const statusFilter = document.getElementById(filterDropdownId);

        const executeFilterLogic = () => {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const statusCriteria = statusFilter ? statusFilter.value : 'all';

            const filteredResults = this.vehicles.filter(v => {
                // Match criteria against primary string data
                const matchesSearch =
                    v.vehicleId.toLowerCase().includes(query) ||
                    v.makeModel.toLowerCase().includes(query) ||
                    (v.assignedDriver && v.assignedDriver.toLowerCase().includes(query));

                const matchesStatus = statusCriteria === 'all' || v.status === statusCriteria;

                return matchesSearch && matchesStatus;
            });

            this.render(filteredResults);
        };

        // Connect functional listeners to physical user interfaces
        searchInput?.addEventListener('input', executeFilterLogic);
        statusFilter?.addEventListener('change', executeFilterLogic);
    }
}