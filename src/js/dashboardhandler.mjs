const DATA_SOURCE = '/json/fleet.json';
const CACHE_KEY = 'fleet_data';

// Fetch array matrix out of state storage or fallback to base configuration file
async function getFleetData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);

    try {
        const response = await fetch(DATA_SOURCE);
        if (!response.ok) throw new Error(`Network block failure: ${response.status}`);
        const primaryData = await response.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify(primaryData));
        return primaryData;
    } catch (err) {
        console.error("Failed to compile initialize baseline array stack:", err);
        return [];
    }
}

// Synchronize changes back to persistent storage layers
function saveFleetData(array) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(array));
}

// Dynamically seed selectors inside forms
async function populateVehicleDropdowns() {
    const fleet = await getFleetData();
    const mileageSelect = document.getElementById('mileageVehicleSelect');
    const expenseSelect = document.getElementById('expenseVehicleSelect');

    const defaultOptions = fleet.length === 0
        ? '<option value="" disabled>No assets discovered.</option>'
        : '<option value="" disabled selected>Choose registration index...</option>' +
        fleet.map(v => `<option value="${v.vehicleId}">${v.vehicleId} — ${v.makeModel}</option>`).join('');

    if (mileageSelect) mileageSelect.innerHTML = defaultOptions;
    if (expenseSelect) expenseSelect.innerHTML = defaultOptions;
}

// Application Orchestrator Lifecycle Loop Setup
document.addEventListener('DOMContentLoaded', async () => {
    await populateVehicleDropdowns();

    const mileageForm = document.getElementById('mileageForm');
    const expenseForm = document.getElementById('expenseForm');
    const registerForm = document.getElementById('registerAssetForm');

    // --- FORM 1 HANDLER: MILEAGE SYSTEM ---
    if (mileageForm) {
        mileageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const targetId = document.getElementById('mileageVehicleSelect').value;
            const odometerVal = parseInt(document.getElementById('newOdometer').value, 10);
            const feedback = document.getElementById('mileageFeedback');

            const fleet = await getFleetData();
            const index = fleet.findIndex(v => v.vehicleId === targetId);

            if (index !== -1) {
                if (odometerVal < fleet[index].currentOdometer) {
                    feedback.innerHTML = `<span style="color: #ff4d4d;">⚠️ Conflict: Mileage cannot roll backward from ${fleet[index].currentOdometer.toLocaleString()} km.</span>`;
                    return;
                }
                fleet[index].currentOdometer = odometerVal;
                saveFleetData(fleet);
                feedback.innerHTML = `<span style="color: #2ec4b6;">✔ Asset metrics updated successfully.</span>`;
                mileageForm.reset();
                await populateVehicleDropdowns();
            }
        });
    }

    // --- FORM 2 HANDLER: OPERATING OVERHEAD ---
    if (expenseForm) {
        expenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const targetId = document.getElementById('expenseVehicleSelect').value;
            const desc = document.getElementById('expenseDesc').value.trim();
            const date = document.getElementById('expenseDate').value;
            const cost = parseInt(document.getElementById('expenseCost').value, 10);
            const feedback = document.getElementById('expenseFeedback');

            const fleet = await getFleetData();
            const index = fleet.findIndex(v => v.vehicleId === targetId);

            if (index !== -1) {
                const uniqueInvoiceId = `INV-${Date.now().toString().slice(-6)}`;

                if (!fleet[index].operatingExpenses) fleet[index].operatingExpenses = [];

                fleet[index].operatingExpenses.push({
                    id: uniqueInvoiceId,
                    description: desc,
                    date: date,
                    cost: cost
                });

                saveFleetData(fleet);
                feedback.innerHTML = `<span style="color: #2ec4b6;">✔ Operational invoice assigned successfully. Reference: ${uniqueInvoiceId}</span>`;
                expenseForm.reset();
            }
        });
    }

    // --- FORM 3 HANDLER: PERSISTENT PROFILE CREATOR ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const vehicleId = document.getElementById('newVehicleId').value.trim().toUpperCase();
            const makeModel = document.getElementById('newMakeModel').value.trim();
            const engineType = document.getElementById('newEngineType').value.trim();
            const currentOdometer = parseInt(document.getElementById('newCurrentOdometer').value, 10) || 0;
            const lastServiceOdometer = parseInt(document.getElementById('newLastServiceOdometer').value, 10) || 0;
            const status = document.getElementById('newAssetStatus').value;
            const assignedDriver = document.getElementById('newAssignedDriver').value.trim() || "Unassigned";
            const feedback = document.getElementById('registerFeedback');

            const fleet = await getFleetData();

            // Primary key safety validation guard
            if (fleet.some(v => v.vehicleId === vehicleId)) {
                feedback.innerHTML = `<span style="color: #ff4d4d;">⚠️ Execution Error: Identifier '${vehicleId}' already exists inside system cache.</span>`;
                return;
            }

            // Construct proposal-compliant model schema
            const newAssetObject = {
                vehicleId,
                makeModel,
                engineType,
                currentOdometer,
                lastServiceOdometer,
                status,
                assignedDriver,
                operatingExpenses: [],
                importLogistics: status === "In Transit" ? [
                    { milestone: "Port Outbound", reached: true, date: new Date().toISOString().split('T')[0] },
                    { milestone: "Sea Transit", reached: false, date: "" },
                    { milestone: "Customs Cleared", reached: false, date: "" },
                    { milestone: "Arrived at Hub", reached: false, date: "" }
                ] : null
            };

            fleet.push(newAssetObject);
            saveFleetData(fleet);

            feedback.innerHTML = `<span style="color: #2ec4b6;">✔ Asset ${vehicleId} successfully compiled into data arrays.</span>`;
            registerForm.reset();

            // Re-populate system selectors so new vehicle can immediately accept updates
            await populateVehicleDropdowns();
        });
    }
});