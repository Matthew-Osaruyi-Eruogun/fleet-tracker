import"./style-B9kXS-O0.js";var e=class{constructor(e,t){this.dataSource=e,this.gridElement=document.getElementById(t),this.vehicles=[]}async init(){try{let e=await fetch(this.dataSource);if(!e.ok)throw Error(`HTTP stream status failed: ${e.status}`);this.vehicles=await e.json(),this.render(this.vehicles)}catch(e){console.error(`Critical error loading inventory matrix source streams:`,e),this.gridElement&&(this.gridElement.innerHTML=`<p class="feedback-error">Failed to synchronize active tracking systems.</p>`)}}render(e){if(this.gridElement){if(e.length===0){this.gridElement.innerHTML=`<p class="loading-msg">No active fleet parameters match your search criteria.</p>`;return}this.gridElement.innerHTML=e.map(e=>{let t=`status-active`;e.status===`In Service`&&(t=`status-service`),e.status===`In Transit`&&(t=`status-transit`);let n=e.status===`In Transit`?`Not Applicable`:`${e.currentOdometer.toLocaleString()} km`,r=e.assignedDriver||`Unassigned`,i=``,a=5e3;if(e.status!==`In Transit`){let t=e.currentOdometer-e.lastServiceOdometer;i=t>=a?`
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
            `}).join(``)}}setupFilters(e,t){let n=document.getElementById(e),r=document.getElementById(t),i=()=>{let e=n?n.value.toLowerCase().trim():``,t=r?r.value:`all`,i=this.vehicles.filter(n=>{let r=n.vehicleId?n.vehicleId.toLowerCase():``,i=n.makeModel?n.makeModel.toLowerCase():``,a=n.assignedDriver?n.assignedDriver.toLowerCase():``,o=r.includes(e)||i.includes(e)||a.includes(e),s=t===`all`||n.status===t;return o&&s});this.render(i)};n?.addEventListener(`input`,i),r?.addEventListener(`change`,i)}};document.addEventListener(`DOMContentLoaded`,async()=>{let n=localStorage.getItem(`fleet_data`),r=new e(`./json/fleet.json`,`fleetGrid`);n?(r.vehicles=JSON.parse(n),r.render(r.vehicles)):(await r.init(),r.vehicles.length>0&&localStorage.setItem(`fleet_data`,JSON.stringify(r.vehicles))),r.setupFilters(`fleetSearch`,`statusFilter`),t()});function t(){let e=document.createElement(`button`);e.id=`devCacheResetBtn`,e.innerHTML=`🔄 Reset Demo Cache`,e.style.position=`fixed`,e.style.bottom=`20px`,e.style.right=`20px`,e.style.padding=`10px 16px`,e.style.backgroundColor=`#1a1a1a`,e.style.color=`var(--safety-amber, #ffb300)`,e.style.border=`1px solid var(--border-color, #333)`,e.style.borderRadius=`4px`,e.style.cursor=`pointer`,e.style.fontSize=`0.85rem`,e.style.fontWeight=`500`,e.style.zIndex=`9999`,e.style.boxShadow=`0 4px 12px rgba(0, 0, 0, 0.6)`,e.style.transition=`background-color 0.2s ease, border-color 0.2s ease`,e.addEventListener(`mouseenter`,()=>{e.style.backgroundColor=`#262626`,e.style.borderColor=`var(--safety-amber, #ffb300)`}),e.addEventListener(`mouseleave`,()=>{e.style.backgroundColor=`#1a1a1a`,e.style.borderColor=`var(--border-color, #333)`}),e.addEventListener(`click`,()=>{confirm(`Reset system data layers? This action clears all localized odometer history logs and resets the configuration matrices back to default templates.`)&&(localStorage.removeItem(`fleet_data`),window.location.reload())}),document.body.appendChild(e)}