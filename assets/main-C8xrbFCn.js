import"./style-B9kXS-O0.js";var e=class{constructor(e,t){this.dataSource=e,this.gridElement=document.getElementById(t),this.vehicles=[]}async init(){try{let e=await fetch(this.dataSource);if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return this.vehicles=await e.json(),this.render(this.vehicles),!0}catch(e){return console.error(`Initialization failed mapping fleet array:`,e),this.gridElement&&(this.gridElement.innerHTML=`<p class="feedback-error">Error loading tracking matrix data components.</p>`),!1}}vehicleCardTemplate(e){let t=`status-active`;e.status===`In Service`&&(t=`status-service`),e.status===`In Transit`&&(t=`status-transit`);let n=e.status===`In Transit`?`Not Applicable`:`${e.currentOdometer.toLocaleString()} km`,r=e.assignedDriver||`Unassigned`,i=``,a=5e3;if(e.status!==`In Transit`){let t=e.currentOdometer-e.lastServiceOdometer;i=t>=a?`
                    <div class="maintenance-alert alert-active">
                        ⚠️ WARNING: Service Overdue by ${(t-a).toLocaleString()} km!
                    </div>
                `:`
                    <div class="maintenance-alert alert-nominal">
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
                <div class="card-footer">
                    <a href="./vehicle-details.html?id=${e.vehicleId}" class="view-details-btn">View Metrics Deep-Dive →</a>
                </div>
            </article>
        `}render(e){if(!this.gridElement)return;if(e.length===0){this.gridElement.innerHTML=`<p class="loading-msg">No active fleet parameters match your search filters.</p>`;return}let t=e.map(e=>this.vehicleCardTemplate(e));this.gridElement.innerHTML=t.join(``)}setupFilters(e,t){let n=document.getElementById(e),r=document.getElementById(t),i=()=>{let e=n?n.value.toLowerCase().trim():``,t=r?r.value:`all`,i=this.vehicles.filter(n=>{let r=n.vehicleId?n.vehicleId.toLowerCase():``,i=n.makeModel?n.makeModel.toLowerCase():``,a=n.assignedDriver?n.assignedDriver.toLowerCase():``,o=r.includes(e)||i.includes(e)||a.includes(e),s=t===`all`||n.status===t;return o&&s});this.render(i)};n&&n.addEventListener(`input`,i),r&&r.addEventListener(`change`,i)}};document.addEventListener(`DOMContentLoaded`,async()=>{let n=localStorage.getItem(`fleet_data`),r=n?`DATA_ALREADY_CACHED`:`/json/fleet.json`,i=new e(r,`fleetGrid`);r===`DATA_ALREADY_CACHED`?(i.vehicles=JSON.parse(n),i.render(i.vehicles)):(await i.init(),localStorage.setItem(`fleet_data`,JSON.stringify(i.vehicles))),i.setupFilters(`fleetSearch`,`statusFilter`),t()});function t(){let e=document.createElement(`button`);e.id=`devCacheResetBtn`,e.innerHTML=`🔄 Reset Demo Cache`,e.style.position=`fixed`,e.style.bottom=`20px`,e.style.right=`20px`,e.style.padding=`10px 16px`,e.style.backgroundColor=`#1a1a1a`,e.style.color=`var(--safety-amber, #ffb300)`,e.style.border=`1px solid var(--border-color, #333)`,e.style.borderRadius=`4px`,e.style.cursor=`pointer`,e.style.fontSize=`0.85rem`,e.style.fontWeight=`500`,e.style.zIndex=`9999`,e.style.boxShadow=`0 4px 12px rgba(0, 0, 0, 0.6)`,e.style.transition=`background-color 0.2s ease, border-color 0.2s ease`,e.addEventListener(`mouseenter`,()=>{e.style.backgroundColor=`#262626`,e.style.borderColor=`var(--safety-amber, #ffb300)`}),e.addEventListener(`mouseleave`,()=>{e.style.backgroundColor=`#1a1a1a`,e.style.borderColor=`var(--border-color, #333)`}),e.addEventListener(`click`,()=>{confirm(`Reset system data layers? This action clears all localized odometer history logs and resets the configuration matrices back to default templates.`)&&(localStorage.removeItem(`fleet_data`),window.location.reload())}),document.body.appendChild(e)}