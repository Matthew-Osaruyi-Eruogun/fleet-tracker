class DashboardHandler {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.vehicles = [];
        this.mileageSelect = document.getElementById('mileageVehicleSelect');
        this.expenseSelect = document.getElementById('expenseVehicleSelect');
    }

    async init() {
        try {
            // Check localStorage first so changes persist across page clicks
            const cachedData = localStorage.getItem('fleet_data');

            if (cachedData) {
                this.vehicles = JSON.parse(cachedData);
            } else {
                const response = await fetch(this.dataSource);
                if (!response.ok) throw new Error("Data stream unavailable.");
                this.vehicles = await response.json();
                this.saveToStorage();
            }

            this.populateDropdowns();
            this.bindEvents();
        } catch (error) {
            console.error("Failed to initialize Management Hub data states:", error);
        }
    }

    saveToStorage() {
        localStorage.setItem('fleet_data', JSON.stringify(this.vehicles));
    }

    populateDropdowns() {
        // Generate options only for vehicles that aren't 'In Transit'
        const operationalVehicles = this.vehicles.filter(v => v.status !== "In Transit");

        const optionsHtml = operationalVehicles.map(v =>
            `<option value="${v.vehicleId}">${v.vehicleId} — ${v.makeModel}</option>`
        ).join('');

        if (this.mileageSelect && this.expenseSelect) {
            this.mileageSelect.innerHTML = `<option value="" disabled selected>Select an asset...</option>` + optionsHtml;
            this.expenseSelect.innerHTML = `<option value="" disabled selected>Select an asset...</option>` + optionsHtml;
        }
    }

    bindEvents() {
        // Mileage Form Handler
        document.getElementById('mileageForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const targetId = this.mileageSelect.value;
            const newMiles = parseInt(document.getElementById('newOdometer').value);
            const feedback = document.getElementById('mileageFeedback');

            const asset = this.vehicles.find(v => v.vehicleId === targetId);
            if (asset) {
                if (newMiles < asset.currentOdometer) {
                    this.showFeedback(feedback, "⚠️ Error: New reading cannot be lower than current record.", "error");
                    return;
                }
                asset.currentOdometer = newMiles;
                this.saveToStorage();
                this.showFeedback(feedback, `✅ Success: ${targetId} mileage updated to ${newMiles.toLocaleString()} km!`, "success");
                e.target.reset();
            }
        });

        // Expense Form Handler
        document.getElementById('expenseForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const targetId = this.expenseSelect.value;
            const desc = document.getElementById('expenseDesc').value;
            const cost = parseInt(document.getElementById('expenseCost').value);
            const selectedDate = document.getElementById('expenseDate').value; // Captures custom interactive date
            const feedback = document.getElementById('expenseFeedback');

            const asset = this.vehicles.find(v => v.vehicleId === targetId);
            if (asset) {
                const uniqueExpenseId = `EXP-${Math.floor(100 + Math.random() * 900)}`;

                // APPENDING INTERACTIVE DATE LOGS
                asset.operatingExpenses.push({
                    id: uniqueExpenseId,
                    description: desc,
                    cost: cost,
                    date: selectedDate
                });

                this.saveToStorage();
                this.showFeedback(feedback, `✅ Success: Logged ${uniqueExpenseId} ($${cost}) to ${targetId}!`, "success");
                e.target.reset();
            }
        });
    }

    showFeedback(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `form-feedback feedback-${type}`;
        setTimeout(() => { element.textContent = ''; }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const hub = new DashboardHandler('/json/fleet.json');
    hub.init();
});