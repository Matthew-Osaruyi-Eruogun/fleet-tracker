import"./style-B9kXS-O0.js";var e=class{constructor(e,t){this.dataSource=e,this.workspaceElement=document.getElementById(t),this.activeVehicle=null}getVehicleIdFromUrl(){let e=window.location.search;return new URLSearchParams(e).get(`id`)}async init(){let e=this.getVehicleIdFromUrl();if(!e){this.renderError(`No valid asset tracking token detected in active navigation context.`);return}try{let t=localStorage.getItem(`fleet_data`),n=[];if(t)n=JSON.parse(t);else{let e=await fetch(this.dataSource);if(!e.ok)throw Error(`Data node unavailable: ${e.status}`);n=await e.json()}if(this.activeVehicle=n.find(t=>t.vehicleId===e),!this.activeVehicle){this.renderError(`Asset reference index '${e}' does not exist inside active fleet matrices.`);return}this.renderDetails()}catch(e){console.error(`Critical component error mapping target metrics:`,e),this.renderError(`Failed to successfully compile requested vehicle parameter structures.`)}}evaluateMaintenanceStatus(e,t){if(e===0&&t===0)return{alert:!1,text:`System Uninitialized (Asset in Transit)`};let n=e-t,r=5e3;return n>=r?{alert:!0,text:`CRITICAL ACTION REQUIRED: Service Overdue by ${n.toLocaleString()} km`}:{alert:!1,text:`Nominal Status: Next oil change/inspection due in ${(r-n).toLocaleString()} km`}}generateTimelineMarkup(e){return e?`<div class="logistics-timeline">${e.map(e=>`
            <div class="timeline-step ${e.reached?`step-completed`:`step-pending`}">
                <div class="marker-dot"></div>
                <div class="step-content">
                    <h5>${e.milestone}</h5>
                    <p>${e.reached?`Completed on: <strong>${e.date}</strong>`:`Pending processing stage`}</p>
                </div>
            </div>
        `).join(``)}</div>`:`<p class="no-data-msg">Not applicable. Domestic field asset currently assigned to regional operations.</p>`}renderDetails(){if(!this.workspaceElement)return;let e=this.activeVehicle,t=this.evaluateMaintenanceStatus(e.currentOdometer,e.lastServiceOdometer),n=e.operatingExpenses.reduce((e,t)=>e+t.cost,0),r=e.operatingExpenses.length===0?`<p class="no-data-msg">No historical maintenance logs registered for this asset.</p>`:`<div class="logistics-timeline">
                ${e.operatingExpenses.map(e=>`
                    <div class="timeline-step step-completed">
                        <div class="marker-dot" style="background: var(--safety-amber); box-shadow: 0 0 8px var(--safety-amber);"></div>
                        <div class="step-content">
                            <h5>${e.description}</h5>
                            <p>Logged: <strong>${e.date||`Prior Record`}</strong> | Cost: <strong style="color: var(--safety-amber);">$${e.cost}</strong></p>
                        </div>
                    </div>
                `).join(``)}
               </div>`;this.workspaceElement.innerHTML=`
            <div class="asset-profile-header">
                <h2>${e.makeModel}</h2>
                <span class="asset-token-tag">${e.vehicleId}</span>
            </div>

            <div class="metrics-dashboard-grid">
                <!-- Panel 1: Operational Vital Metrics -->
                <div class="metric-card-block">
                    <h3>Core Diagnostics & Telematics</h3>
                    <p><strong>Powertrain/Engine Config:</strong> ${e.engineType}</p>
                    <p><strong>Current Active Odometer:</strong> ${e.currentOdometer.toLocaleString()} km</p>
                    <p><strong>Last Verified Maintenance Sign-Off:</strong> ${e.lastServiceOdometer.toLocaleString()} km</p>
                    <p><strong>Assigned Operations Driver:</strong> ${e.assignedDriver}</p>
                </div>

                <!-- Panel 2: Maintenance Notification Engine -->
                <div class="metric-card-block alert-block ${t.alert?`alert-active`:`alert-nominal`}">
                    <h3>System Advisory Status</h3>
                    <p class="status-alert-text">${t.text}</p>
                </div>
            </div>

            <!-- Cumulative Cost Calculator Banner Widget -->
            <div class="cumulative-cost-banner">
                <h4>Total Cumulative Lifecycle Operating Cost: <span>$${n.toLocaleString()} USD</span></h4>
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
                        ${e.operatingExpenses.length===0?`<tr><td colspan="3" class="empty-table-msg">No operational overhead outlays logged for this reporting period.</td></tr>`:e.operatingExpenses.map(e=>`
                                <tr>
                                    <td><code>${e.id}</code></td>
                                    <td>${e.description}</td>
                                    <td><strong>$${e.cost}</strong></td>
                                </tr>
                            `).join(``)}
                    </tbody>
                </table>
            </div>

            <div class="management-grid" style="margin-top: 25px; display: grid; gap: 30px;">
                <!-- Chronological Service Timeline Card -->
                <div class="ledger-section-block" style="margin-bottom: 0;">
                    <h3>Chronological Service History Timeline</h3>
                    ${r}
                </div>

                <!-- International Supply Pipeline Card -->
                <div class="ledger-section-block" style="margin-bottom: 0;">
                    <h3>International Supply Pipeline Tracking (Import Milestones)</h3>
                    ${this.generateTimelineMarkup(e.importLogistics)}
                </div>
            </div>
        `}renderError(e){this.workspaceElement&&(this.workspaceElement.innerHTML=`<div class="error-banner-frame"><p>⚠️ ${e}</p></div>`)}};document.addEventListener(`DOMContentLoaded`,()=>{new e(`/json/fleet.json`,`detailsWorkspace`).init()});