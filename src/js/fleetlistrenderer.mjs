// src/js/fleetlist.mjs
export default class FleetList { // Renamed and exported perfectly
    constructor(dataSource, targetGridId) { // Added targetGridId to match utils.mjs
        this.dataSource = dataSource;
        this.gridElement = document.getElementById(targetGridId);
        this.vehicles = [];
    }

    // Attach real-time event listeners to filtering controls
    setupFilters(searchId, filterId) {
        const searchInput = document.getElementById(searchId);
        const statusSelect = document.getElementById(filterId);

        // Unified execution loop for both input channels
        const executeFilter = () => {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const selectedStatus = statusSelect ? statusSelect.value : 'all';

            // Filter the master array without mutating the original dataset
            const filteredSubset = this.vehicles.filter(vehicle => {
                // Evaluation 1: Detailed Text Search Matching
                const matchesSearch =
                    vehicle.vehicleId.toLowerCase().includes(query) ||
                    vehicle.makeModel.toLowerCase().includes(query) ||
                    vehicle.assignedDriver.toLowerCase().includes(query);

                // Evaluation 2: Dropdown Deployment State Matching
                const matchesStatus = (selectedStatus === 'all') || (vehicle.status === selectedStatus);

                // Both conditions must pass for the vehicle card to remain visible
                return matchesSearch && matchesStatus;
            });

            // Push the compiled matrix array back to the view layer
            this.render(filteredSubset);
        };

        // Bind execution contexts to respective DOM event triggers
        if (searchInput) {
            searchInput.addEventListener('input', executeFilter);
        }
        if (statusSelect) {
            statusSelect.addEventListener('change', executeFilter);
        }
    }

    // Fetch the mock asset data array
    async init() {
        try {
            const response = await fetch(this.dataSource);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.vehicles = await response.json();
            this.render(this.vehicles);
            return true; // Resolves promise to let setupFilters execute safely
        } catch (error) {
            console.error("Initialization failed mapping fleet array:", error);
            if (this.targetElement) {
                this.targetElement.innerHTML = `<p class="error-msg">Error loading tracking matrix data components.</p>`;
            }
            return false;
        }
    }

    // Generate individual vehicle template markups
    vehicleCardTemplate(vehicle) {
        // Basic structural status color selector
        let statusClass = "status-active";
        if (vehicle.status === "In Service") statusClass = "status-service";
        if (vehicle.status === "In Transit") statusClass = "status-transit";

        return `
            <div class="vehicle-card" data-id="${vehicle.vehicleId}">
                <div class="card-header">
                    <h4>${vehicle.vehicleId}</h4>
                    <span class="status-badge ${statusClass}">${vehicle.status}</span>
                </div>
                <div class="card-body">
                    <p><strong>Model:</strong> ${vehicle.makeModel}</p>
                    <p><strong>Engine:</strong> ${vehicle.engineType}</p>
                    <p><strong>Odometer:</strong> ${vehicle.currentOdometer.toLocaleString()} km</p>
                    <p><strong>Driver:</strong> ${vehicle.assignedDriver}</p>
                </div>
                <div class="card-footer">
                    <a href="/vehicle-details.html?id=${vehicle.vehicleId}" class="view-details-btn">View Full Metrics</a>
                </div>
            </div>
        `;
    }

    // Render arrays cleanly to the screen
    render(list) {
        if (!this.targetElement) return;

        if (list.length === 0) {
            this.targetElement.innerHTML = `<p class="no-results">No vehicle units match your search filters.</p>`;
            return;
        }

        const htmlStrings = list.map(vehicle => this.vehicleCardTemplate(vehicle));
        this.targetElement.innerHTML = htmlStrings.join('');
    }
}