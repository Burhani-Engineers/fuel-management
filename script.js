// Data Management
let vehicles = [
    'KBH 952V', 'KBM 190H', 'KBP 540Q', 'KCK 951W', 'KCN 684B', 
    'KCQ 103H', 'KCQ 251B', 'KCQ 257Q', 'KCR 853N', 'KCU 452S'
];

let projects = [
    { code: '51095', name: 'Project 51095' },
    { code: '51105', name: 'Project 51105' },
    { code: '51166', name: 'Project 51166' }
];

let requisitions = [
    { 
        id: 'REQ-001',
        vehicle: 'KBH 952V',
        project: '51095',
        amount: 10000,
        remainingBalance: 10000
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    renderCurrentForm();
    lucide.createIcons(); // Initialize icons
});

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderCurrentForm();
        });
    });
}

function getActiveTab() {
    return document.querySelector('.tab.active').dataset.tab;
}

function renderCurrentForm() {
    const container = document.getElementById('form-container');
    const activeTab = getActiveTab();
    
    if (activeTab === 'requisition') {
        container.innerHTML = createRequisitionForm();
    } else {
        container.innerHTML = createFillingForm();
    }
    lucide.createIcons(); // Refresh icons
}

// Form Generation
function createRequisitionForm() {
    return `
        <div class="form-container">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Vehicle Number</label>
                    <div class="flex gap-2">
                        <select class="w-full p-2 border rounded" id="vehicle-select">
                            <option value="">Select Vehicle</option>
                            ${vehicles.map(v => `<option value="${v}">${v}</option>`).join('')}
                        </select>
                        <button onclick="openModal('add-vehicle-modal')" 
                                class="px-3 py-2 border rounded hover:bg-gray-50">
                            <i data-lucide="plus-circle"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Project Code</label>
                    <div class="flex gap-2">
                        <select class="w-full p-2 border rounded" id="project-select">
                            <option value="">Select Project</option>
                            ${projects.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('')}
                        </select>
                        <button onclick="openModal('add-project-modal')"
                                class="px-3 py-2 border rounded hover:bg-gray-50">
                            <i data-lucide="plus-circle"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Amount Required (KES)</label>
                    <input type="number" class="w-full p-2 border rounded" id="amount-input" placeholder="Enter amount">
                </div>

                <button onclick="submitRequisition()" 
                        class="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800">
                    Submit Requisition
                </button>
            </div>
        </div>
    `;
}
function createFillingForm() {
    return `
        <div class="form-container">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Requisition ID</label>
                    <select class="w-full p-2 border rounded" id="requisition-select" onchange="handleRequisitionSelect(this.value)">
                        <option value="">Select Requisition</option>
                        ${requisitions.map(r => `
                            <option value="${r.id}">
                                ${r.id} - ${r.vehicle} (Balance: KES ${r.remainingBalance.toLocaleString()})
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Vehicle Number</label>
                        <input type="text" class="w-full p-2 border rounded bg-gray-50" id="filling-vehicle" disabled>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Project Code</label>
                        <input type="text" class="w-full p-2 border rounded bg-gray-50" id="filling-project" disabled>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Current Mileage</label>
                    <input type="number" class="w-full p-2 border rounded" id="filling-mileage">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Litres Filled</label>
                        <input type="number" class="w-full p-2 border rounded" id="filling-litres" 
                               onchange="calculateTotal()">
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Price per Litre (KES)</label>
                        <input type="number" class="w-full p-2 border rounded" id="filling-price"
                               onchange="calculateTotal()">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Total Cost (KES)</label>
                    <input type="text" class="w-full p-2 border rounded bg-gray-50" id="filling-total" disabled>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Receipt Upload</label>
                    <input type="file" accept="image/*,.pdf" class="w-full p-2 border rounded" id="filling-receipt">
                </div>

                <button onclick="submitFilling()" 
                        class="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800">
                    Submit Fuel Filling
                </button>
            </div>
        </div>
    `;
}

// Event Handlers
function handleRequisitionSelect(requisitionId) {
    const requisition = requisitions.find(r => r.id === requisitionId);
    if (requisition) {
        document.getElementById('filling-vehicle').value = requisition.vehicle;
        document.getElementById('filling-project').value = requisition.project;
    }
}

function calculateTotal() {
    const litres = Number(document.getElementById('filling-litres').value);
    const price = Number(document.getElementById('filling-price').value);
    const total = litres * price;
    document.getElementById('filling-total').value = total.toFixed(2);
}

// Form Submissions
function submitRequisition() {
    const vehicle = document.getElementById('vehicle-select').value;
    const project = document.getElementById('project-select').value;
    const amount = Number(document.getElementById('amount-input').value);

    if (!vehicle || !project || !amount) {
        alert('Please fill in all fields');
        return;
    }

    const requisition = {
        id: 'REQ-' + new Date().getTime().toString().slice(-6),
        vehicle,
        project,
        amount,
        remainingBalance: amount
    };

    requisitions.push(requisition);
    alert('Requisition submitted successfully!');
    renderCurrentForm();
}

function submitFilling() {
    const requisitionId = document.getElementById('requisition-select').value;
    const receipt = document.getElementById('filling-receipt').files[0];
    const total = Number(document.getElementById('filling-total').value);

    if (!requisitionId || !receipt || !total) {
        alert('Please fill in all fields and upload a receipt');
        return;
    }

    const requisition = requisitions.find(r => r.id === requisitionId);
    if (total > requisition.remainingBalance) {
        alert('Total cost exceeds remaining balance');
        return;
    }

    requisition.remainingBalance -= total;
    alert('Fuel filling submitted successfully!');
    renderCurrentForm();
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function addNewVehicle() {
    const vehicle = document.getElementById('new-vehicle-input').value;
    if (vehicle && !vehicles.includes(vehicle)) {
        vehicles.push(vehicle);
        closeModal('add-vehicle-modal');
        document.getElementById('new-vehicle-input').value = '';
        renderCurrentForm();
    }
}

function addNewProject() {
    const code = document.getElementById('new-project-code').value;
    const name = document.getElementById('new-project-name').value;
    
    if (code && name && !projects.find(p => p.code === code)) {
        projects.push({ code, name });
        closeModal('add-project-modal');
        document.getElementById('new-project-code').value = '';
        document.getElementById('new-project-name').value = '';
        renderCurrentForm();
    }
}
