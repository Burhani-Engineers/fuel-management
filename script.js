// Data
const vehicles = [
    'KBH 952V', 'KBM 190H', 'KBP 540Q', 'KCK 951W', 'KCN 684B', 
    'KCQ 103H', 'KCQ 251B', 'KCQ 257Q', 'KCR 853N', 'KCU 452S',
    'KCU 967G', 'KCV 952J', 'KCW 914H', 'KCW 952C', 'KCW 953C',
    'KCZ 652S', 'KDC 153R', 'KDD 553V', 'KDH 113Y', 'KDJ 027M'
];

const projects = [
    { code: '51095', name: 'Project 51095' },
    { code: '51105', name: 'Project 51105' },
    { code: '51166', name: 'Project 51166' },
    { code: '51212', name: 'Project 51212' },
    { code: '51268', name: 'Project 51268' },
    { code: '51302', name: 'Project 51302' },
    { code: '51307', name: 'Project 51307' }
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    lucide.createIcons();

    // Initialize dropdowns
    populateDropdowns();

    // Setup tabs
    setupTabs();

    // Form handlers
    setupFormHandlers();

    // Create initial requisition form
    createRequisitionForm();

    // Set default dates
    setDefaultDate();
});

function populateDropdowns() {
    // Populate vehicle dropdowns
    const vehicleSelect = document.getElementById('vehicleSelect');
    if (vehicleSelect) {
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle;
            option.textContent = vehicle;
            vehicleSelect.appendChild(option);
        });
    }

    // Populate project dropdowns
    const projectSelect = document.getElementById('projectSelect');
    if (projectSelect) {
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.code;
            option.textContent = `${project.code} - ${project.name}`;
            projectSelect.appendChild(option);
        });
    }
}

function setupTabs() {
    const fillingTab = document.getElementById('fillingTab');
    const requisitionTab = document.getElementById('requisitionTab');
    const fillingContent = document.getElementById('fillingContent');
    const requisitionContent = document.getElementById('requisitionContent');

    fillingTab.addEventListener('click', () => {
        fillingTab.classList.add('active');
        requisitionTab.classList.remove('active');
        fillingContent.classList.remove('hidden');
        requisitionContent.classList.add('hidden');
    });

    requisitionTab.addEventListener('click', () => {
        requisitionTab.classList.add('active');
        fillingTab.classList.remove('active');
        requisitionContent.classList.remove('hidden');
        fillingContent.classList.add('hidden');
    });
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = today;
    });
}

// Form Handlers
function setupFormHandlers() {
    // Filling Form
    const fillingForm = document.getElementById('fillingForm');
    if (fillingForm) {
        fillingForm.addEventListener('submit', handleFillingSubmit);
    }

    // Requisition Form
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', createRequisitionForm);
    }

    const submitAllBtn = document.getElementById('submitAllBtn');
    if (submitAllBtn) {
        submitAllBtn.addEventListener('click', handleRequisitionSubmit);
    }
}

let formCount = 0;
const formData = {};

function createRequisitionForm() {
    formCount++;
    const form = document.createElement('div');
    form.className = 'bg-white rounded-lg shadow p-6 mb-4';
    form.innerHTML = `
        <h3 class="text-sm font-bold mb-4">Vehicle ${formCount}</h3>
        <form class="space-y-4" data-form="${formCount}">
            <div>
                <label class="block text-sm font-medium mb-1">Vehicle Number</label>
                <select class="w-full p-2 border rounded" required>
                    <option value="">Select Vehicle</option>
                    ${vehicles.map(v => `<option value="${v}">${v}</option>`).join('')}
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Project Code</label>
                <select class="w-full p-2 border rounded" required>
                    <option value="">Select Project</option>
                    ${projects.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('')}
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Fuel Amount Required</label>
                <input type="number" class="w-full p-2 border rounded" placeholder="Enter amount" required>
            </div>
        </form>
    `;

    document.getElementById('requisitionForms').appendChild(form);

    // Add form change listener
    form.querySelector('form').addEventListener('change', (e) => {
        const formNumber = e.currentTarget.dataset.form;
        formData[formNumber] = formData[formNumber] || {};
        if (e.target.type === 'number') {
            formData[formNumber].amount = parseFloat(e.target.value) || 0;
        }
    });
}

async function handleFillingSubmit(e) {
    e.preventDefault();
    try {
        const formData = new FormData(e.target);
        console.log('Submitting filling form:', Object.fromEntries(formData));
        alert('Fuel filling submitted successfully!');
        e.target.reset();
        setDefaultDate();
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form');
    }
}

async function handleRequisitionSubmit() {
    try {
        const total = Object.values(formData).reduce((sum, form) => {
            return sum + (form.amount || 0);
        }, 0);
        
        document.getElementById('totalAmount').textContent = total.toLocaleString();
        document.getElementById('totalAlert').classList.remove('hidden');
        
        console.log('Form Data:', formData);
        console.log('Total Amount:', total);
        
        alert('Requisitions submitted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting requisitions');
    }
}
