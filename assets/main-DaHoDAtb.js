import"./style-B9kXS-O0.js";var e=class{constructor(e){this.gridElement=document.getElementById(e),this.vehicles=[]}render(e){if(this.gridElement){if(e.length===0){this.gridElement.innerHTML=`<p class="loading-msg">No active fleet parameters match your search criteria.</p>`;return}this.gridElement.innerHTML=e.map(e=>{let t=`status-active`;e.status===`In Service`&&(t=`status-service`),e.status===`In Transit`&&(t=`status-transit`);let n=e.status===`In Transit`?`Not Applicable`:`${e.currentOdometer.toLocaleString()} km`,r=e.assignedDriver||`Unassigned`,i=``,a=5e3;if(e.status!==`In Transit`){let t=e.currentOdometer-e.lastServiceOdometer;i=t>=a?`
                        <div class="maintenance-alert alert-active" style="background-color: #721c24; color: #f8d7da; padding: 6px 10px; margin: 8px 0; border-radius: 4px; font-size: 0.85rem; font-weight: bold; border-left: 4px solid #dc3545;">
                            ⚠️ WARNING: Service Overdue by ${(t-a).toLocaleString()} km!
                        </div>
                    `:`
                        <div class="maintenance-alert alert-nominal" style="background-color: #155724; color: #d4edda; padding: 6px 10px; margin: 8px 0; border-radius: 4px; font-size: 0.85rem; border-left: 4px solid #28a745;">
                            ✅ Status: Nominal (${(a-t).toLocaleString()} km remaining)
                        </div>
                    `}return`
                <article class="vehicle-card" data-id="${e.vehicleId}">
                    <header class="card-header">
                        <h4>${e.makeModel}</h4>
                        <span class="status-badge ${t}">${e.status}</span>
                    </header>
                    
                    ${i}

                    <div class="card-body">
                        <p><strong>Asset ID:</strong> <code>${e.vehicleId}</code></p>
                        <p><strong>Powertrain:</strong> ${e.engineType}</p>
                        <p><strong>Current Log:</strong> ${n}</p>
                        <p><strong>Driver Assignee:</strong> ${r}</p>
                    </div>
                    <footer class="card-footer">
                        <a href="./vehicle-details.html?id=${e.vehicleId}" class="view-details-btn">View Metrics Deep-Dive →</a>
                    </footer>
                </article>
            `}).join(``)}}setupFilters(e,t){let n=document.getElementById(e),r=document.getElementById(t),i=()=>{let e=n?n.value.toLowerCase().trim():``,t=r?r.value:`all`,i=this.vehicles.filter(n=>{let r=n.vehicleId?n.vehicleId.toLowerCase():``,i=n.makeModel?n.makeModel.toLowerCase():``,a=n.assignedDriver?n.assignedDriver.toLowerCase():``,o=r.includes(e)||i.includes(e)||a.includes(e),s=t===`all`||n.status===t;return o&&s});this.render(i)};n?.addEventListener(`input`,i),r?.addEventListener(`change`,i)}},t=[{vehicleId:`TRK-2026-001`,makeModel:`Toyota Hilux GR Sport`,engineType:`1GR-FE V6`,currentOdometer:124500,lastServiceOdometer:12e4,status:`Active`,importLogistics:null,operatingExpenses:[{id:`EXP-101`,description:`Oil Filter Exchange`,cost:75},{id:`EXP-102`,description:`Brake Pad Replacement`,cost:180}],assignedDriver:`Francis Macheme`},{vehicleId:`TRK-2026-002`,makeModel:`Volkswagen Golf 4`,engineType:`2.0L SOHC`,currentOdometer:198200,lastServiceOdometer:191e3,status:`In Service`,importLogistics:null,operatingExpenses:[{id:`EXP-201`,description:`Alternator Swap`,cost:320}],assignedDriver:`Unassigned`},{vehicleId:`TRK-2026-003`,makeModel:`Mercedes-Benz Sprinter Cargo`,engineType:`OM651 Inline-4`,currentOdometer:0,lastServiceOdometer:0,status:`In Transit`,importLogistics:[{milestone:`Port Outbound`,reached:!0,date:`2026-05-10`},{milestone:`Sea Transit`,reached:!0,date:`2026-05-25`},{milestone:`Customs Cleared`,reached:!1,date:null},{milestone:`Arrived at Hub`,reached:!1,date:null}],operatingExpenses:[],assignedDriver:`Pending Import Delivery`}];document.addEventListener(`DOMContentLoaded`,()=>{let r=localStorage.getItem(`fleet_data`),i=new e(`fleetGrid`);r?i.vehicles=JSON.parse(r):(i.vehicles=t,localStorage.setItem(`fleet_data`,JSON.stringify(t))),i.render(i.vehicles),i.setupFilters(`fleetSearch`,`statusFilter`),n()});function n(){let e=document.createElement(`button`);e.id=`devCacheResetBtn`,e.innerHTML=`🔄 Reset Demo Cache`,e.style.position=`fixed`,e.style.bottom=`20px`,e.style.right=`20px`,e.style.padding=`10px 16px`,e.style.backgroundColor=`#1a1a1a`,e.style.color=`var(--safety-amber, #ffb300)`,e.style.border=`1px solid var(--border-color, #333)`,e.style.borderRadius=`4px`,e.style.cursor=`pointer`,e.style.zIndex=`9999`,e.addEventListener(`click`,()=>{confirm(`Reset system data layers?`)&&(localStorage.removeItem(`fleet_data`),window.location.reload())}),document.body.appendChild(e)}