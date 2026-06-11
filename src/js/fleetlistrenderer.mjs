export default class FleetList { 
    constructor(dataSource, targetGridId) { 
        this.dataSource = dataSource;
        this.gridElement = document.getElementById(targetGridId); 
        this.vehicles = [];
    }

   
    async init() {
        try {
            const response = await fetch(this.dataSource);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.vehicles = await response.json();
            this.render(this.vehicles);
            return true; 
        } catch (error) {
            console.error("Initialization failed mapping fleet array:", error);
            if (this.gridElement) {
                this.gridElement.innerHTML = `<p class="feedback-error">Error loading tracking matrix data components.</p>`;
            }
            return false;
        }
    }


    vehicleCardTemplate(vehicle) {
        // Base structural status styling markers
        let statusClass = "status-active";
        if (vehicle.status === "In Service") statusClass = "status-service";
        if (vehicle.status === "In Transit") statusClass = "status-transit";

        // Build dynamic display metadata contexts safely
        const displayOdometer = vehicle.status === "In Transit" ? "Not Applicable" : `${vehicle.currentOdometer.toLocaleString()} km`;
        const displayDriver = vehicle.assignedDriver || "Unassigned";

        // --- PROACTIVE MAINTENANCE ALERT WIDGET SYSTEM ---
        let alertBannerHTML = '';
        const MAINTENANCE_THRESHOLD = 5000; // 5,000 km limit
        
        if (vehicle.status !== "In Transit") {
            const mileageDelta = vehicle.currentOdometer - vehicle.lastServiceOdometer;
            
            if (mileageDelta >= MAINTENANCE_THRESHOLD) {
                alertBannerHTML = `
                    <div class="maintenance-alert alert-active">
                        ⚠️ WARNING: Service Overdue by ${(mileageDelta - MAINTENANCE_THRESHOLD).toLocaleString()} km!
                    </div>
                `;
            } else {
                alertBannerHTML = `
                    <div class="maintenance-alert alert-nominal">
                        ✅ Status: Nominal (${(MAINTENANCE_THRESHOLD - mileageDelta).toLocaleString()} km remaining)
                    </div>
                `;
            }
        }

       
        return `
            <article class="vehicle-card" data-id="${vehicle.vehicleId}">
                <header class="card-header">
                    <h4>${vehicle.makeModel}</h4>
                    <span class="status-badge ${statusClass}">${vehicle.status}</span>
                </header>
                
                ${alertBannerHTML}

                <div class="card-body">
                    <p><strong>Asset ID:</strong> <code>${vehicle.vehicleId}</code></p>
                    <p><strong>Powertrain:</strong> ${vehicle.engineType}</p>
                    <p><strong>Current Log:</strong> ${displayOdometer}</p>
                    <p><strong>Driver Assignee:</strong> ${displayDriver}</p>
                </div>
                <div class="card-footer">
                    <a href="./vehicle-details.html?id=${vehicle.vehicleId}" class="view-details-btn">View Metrics Deep-Dive →</a>
                </div>
            </article>
        `;
    }


    render(list) {
        if (!this.gridElement) return;

        if (list.length === 0) {
            this.gridElement.innerHTML = `<p class="loading-msg">No active fleet parameters match your search filters.</p>`;
            return;
        }

        const htmlStrings = list.map(vehicle => this.vehicleCardTemplate(vehicle));
        this.gridElement.innerHTML = htmlStrings.join('');
    }

   
    setupFilters(searchId, filterId) {
        const searchInput = document.getElementById(searchId);
        const statusSelect = document.getElementById(filterId);

        const executeFilter = () => {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const selectedStatus = statusSelect ? statusSelect.value : 'all';

            const filteredSubset = this.vehicles.filter(vehicle => {
                // Secure text properties against null crashes safely
                const targetId = vehicle.vehicleId ? vehicle.vehicleId.toLowerCase() : '';
                const targetModel = vehicle.makeModel ? vehicle.makeModel.toLowerCase() : '';
                const targetDriver = vehicle.assignedDriver ? vehicle.assignedDriver.toLowerCase() : '';

                const matchesSearch =
                    targetId.includes(query) ||
                    targetModel.includes(query) ||
                    targetDriver.includes(query);

                const matchesStatus = (selectedStatus === 'all') || (vehicle.status === selectedStatus);

                return matchesSearch && matchesStatus;
            });

            this.render(filteredSubset);
        };

        if (searchInput) searchInput.addEventListener('input', executeFilter);
        if (statusSelect) statusSelect.addEventListener('change', executeFilter);
    }
}