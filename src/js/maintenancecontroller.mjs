export default class MaintenanceController {
    constructor(dataSource, targetWorkspaceId) {
        this.dataSource = dataSource;
        this.workspaceElement = document.getElementById(targetWorkspaceId);
        this.activeVehicle = null;
    }

    // Parse URL parameter strings to extract the asset ID token
    getVehicleIdFromUrl() {
        const parameterString = window.location.search;
        const urlParameters = new URLSearchParams(parameterString);
        return urlParameters.get('id');
    }

    // Query database, extract targeted profile block, and kick off display loop
    async init() {
        const structuralId = this.getVehicleIdFromUrl();

        if (!structuralId) {
            this.renderError("No valid asset tracking token detected in active navigation context.");
            return;
        }

        try {
            // Check localStorage state first so updates flow across pages seamlessly
            const cachedData = localStorage.getItem('fleet_data');
            let fleetArray = [];

            if (cachedData) {
                fleetArray = JSON.parse(cachedData);
            } else {
                const response = await fetch(this.dataSource);
                if (!response.ok) throw new Error(`Data node unavailable: ${response.status}`);
                fleetArray = await response.json();
            }

            this.activeVehicle = fleetArray.find(item => item.vehicleId === structuralId);

            if (!this.activeVehicle) {
                this.renderError(`Asset reference index '${structuralId}' does not exist inside active fleet matrices.`);
                return;
            }

            this.renderDetails();
        } catch (error) {
            console.error("Critical component error mapping target metrics:", error);
            this.renderError("Failed to successfully compile requested vehicle parameter structures.");
        }
    }

    // Calculate if the asset has passed standard service milestones
    evaluateMaintenanceStatus(current, lastService) {
        if (current === 0 && lastService === 0) return { alert: false, text: "System Uninitialized (Asset in Transit)" };

        const mileageDelta = current - lastService;
        const maintenanceIntervalThreshold = 5000; // Hard warning cutoff threshold

        if (mileageDelta >= maintenanceIntervalThreshold) {
            return { alert: true, text: `CRITICAL ACTION REQUIRED: Service Overdue by ${mileageDelta.toLocaleString()} km` };
        }
        return { alert: false, text: `Nominal Status: Next oil change/inspection due in ${(maintenanceIntervalThreshold - mileageDelta).toLocaleString()} km` };
    }

    // Construct markup templates for shipping logistics timelines
    generateTimelineMarkup(milestones) {
        if (!milestones) return `<p class="no-data-msg">Not applicable. Domestic field asset currently assigned to regional operations.</p>`;

        const timelineItems = milestones.map(step => `
            <div class="timeline-step ${step.reached ? 'step-completed' : 'step-pending'}">
                <div class="marker-dot"></div>
                <div class="step-content">
                    <h5>${step.milestone}</h5>
                    <p>${step.reached ? `Completed on: <strong>${step.date}</strong>` : 'Pending processing stage'}</p>
                </div>
            </div>
        `).join('');

        return `<div class="logistics-timeline">${timelineItems}</div>`;
    }

    // Main UI compiler loop
    renderDetails() {
        if (!this.workspaceElement) return;

        const v = this.activeVehicle;
        const serviceStatus = this.evaluateMaintenanceStatus(v.currentOdometer, v.lastServiceOdometer);

        // 🧮 Calculator Engine: Accumulate total resource outlay costs
        const totalCumulativeOutlay = v.operatingExpenses.reduce((sum, item) => sum + item.cost, 0);

        // ⏳ Timeline Engine: Build chronological maintenance track
        const serviceTimelineItems = v.operatingExpenses.length === 0
            ? `<p class="no-data-msg">No historical maintenance logs registered for this asset.</p>`
            : `<div class="logistics-timeline">
                ${v.operatingExpenses.map(log => `
                    <div class="timeline-step step-completed">
                        <div class="marker-dot" style="background: var(--safety-amber); box-shadow: 0 0 8px var(--safety-amber);"></div>
                        <div class="step-content">
                            <h5>${log.description}</h5>
                            <p>Logged: <strong>${log.date || 'Prior Record'}</strong> | Cost: <strong style="color: var(--safety-amber);">$${log.cost}</strong></p>
                        </div>
                    </div>
                `).join('')}
               </div>`;

        this.workspaceElement.innerHTML = `
            <div class="asset-profile-header">
                <h2>${v.makeModel}</h2>
                <span class="asset-token-tag">${v.vehicleId}</span>
            </div>

            <div class="metrics-dashboard-grid">
                <!-- Panel 1: Operational Vital Metrics -->
                <div class="metric-card-block">
                    <h3>Core Diagnostics & Telematics</h3>
                    <p><strong>Powertrain/Engine Config:</strong> ${v.engineType}</p>
                    <p><strong>Current Active Odometer:</strong> ${v.currentOdometer.toLocaleString()} km</p>
                    <p><strong>Last Verified Maintenance Sign-Off:</strong> ${v.lastServiceOdometer.toLocaleString()} km</p>
                    <p><strong>Assigned Operations Driver:</strong> ${v.assignedDriver}</p>
                </div>

                <!-- Panel 2: Maintenance Notification Engine -->
                <div class="metric-card-block alert-block ${serviceStatus.alert ? 'alert-active' : 'alert-nominal'}">
                    <h3>System Advisory Status</h3>
                    <p class="status-alert-text">${serviceStatus.text}</p>
                </div>
            </div>

            <!-- Cumulative Cost Calculator Banner Widget -->
            <div class="cumulative-cost-banner">
                <h4>Total Cumulative Lifecycle Operating Cost: <span>$${totalCumulativeOutlay.toLocaleString()} USD</span></h4>
            </div>

            <!-- Segment 3: Financial Operating Ledger -->
            <div class="ledger-section-block">
                <h3>Asset Operating Ledger (Recent Lifecycle Invoices)</h3>
                <table class="expense-table-ledger">
                    <thead>
                        <tr>
                            <th>Reference ID</th>
                            <th>Operational Resource Allocation Description</th>
                            <th>Financial Outlay Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${v.operatingExpenses.length === 0 ? '<tr><td colspan="3" class="empty-table-msg">No operational overhead outlays logged for this reporting period.</td></tr>' :
                v.operatingExpenses.map(exp => `
                                <tr>
                                    <td><code>${exp.id}</code></td>
                                    <td>${exp.description}</td>
                                    <td><strong>$${exp.cost}</strong></td>
                                </tr>
                            `).join('')
            }
                    </tbody>
                </table>
            </div>

            <div class="management-grid" style="margin-top: 25px; display: grid; gap: 30px;">
                <!-- Chronological Service Timeline Card -->
                <div class="ledger-section-block" style="margin-bottom: 0;">
                    <h3>Chronological Service History Timeline</h3>
                    ${serviceTimelineItems}
                </div>

                <!-- International Supply Pipeline Card -->
                <div class="ledger-section-block" style="margin-bottom: 0;">
                    <h3>International Supply Pipeline Tracking (Import Milestones)</h3>
                    ${this.generateTimelineMarkup(v.importLogistics)}
                </div>
            </div>
        `;
    }

    renderError(msg) {
        if (this.workspaceElement) {
            this.workspaceElement.innerHTML = `<div class="error-banner-frame"><p>⚠️ ${msg}</p></div>`;
        }
    }
}

// Automatically boot up details environment mapping sequences when document reaches interactive state
document.addEventListener('DOMContentLoaded', () => {
    const controllerInstance = new MaintenanceController('/json/fleet.json', 'detailsWorkspace');
    controllerInstance.init();
});