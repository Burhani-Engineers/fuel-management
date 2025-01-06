// Data
const vehicles = [
    'KBH 952V', 'KBM 190H', 'KBP 540Q', 'KCK 951W', 'KCN 684B', 
    'KCQ 103H', 'KCQ 251B', 'KCQ 257Q', 'KCR 853N', 'KCU 452S',
    'KCU 967G', 'KCV 952J', 'KCW 914H', 'KCW 952C', 'KCW 953C'
];

const projects = [
    { code: '51095', name: 'Project 51095' },
    { code: '51105', name: 'Project 51105' },
    { code: '51166', name: 'Project 51166' },
    { code: '51212', name: 'Project 51212' },
    { code: '51268', name: 'Project 51268' }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    lucide.createIcons();
    
    // Initialize dropdowns
    populateDropdowns();
    
    // Setup event listeners
    setupEventListeners();
    
    // Create initial requisition form
    addRequisitionForm();
    
    // Set default date
    setDefaultDate();
});

// Populate dropdowns
function populateDropdowns() {
    // Vehicle dropdown
    const vehicleSelect = document.getElementById('vehicleSelect');
    if (vehicleSelect) {
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle;
            option.textContent = vehicle;
            vehicleSelect.appendChild(option);
        });
    }
    
    // Project dropdown
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

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('active');
            });
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });

    // Form submissions
    document.getElementById('fillingForm')?.addEventListener('submit', handleFillingSubmit);
    document.getElementById('addVehicleBtn')?.addEventListener('click', addRequisitionForm);
    document.getElementById('submitAllBtn')?.addEventListener('click', handleRequisitionSubmit);
}

// Set default date
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = today;
    });
}

let formCount = 0;
const formData = {};

// Add requisition form
function addRequisitionForm() {
    formCount++;
    const form = document.createElement('div');
    form.className = 'bg-white rounded-lg shadow p-6';
    form.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">Vehicle ${formCount}</h3>
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

    document.getElementById('requisitionForms')?.appendChild(form);

    // Add form change listener
    const newForm = form.querySelector('form');
    if (newForm) {
        newForm.addEventListener('change', handleFormChange);
    }
}

// Handle form change
function handleFormChange(e) {
    const formNumber = e.currentTarget.getAttribute('data-form');
    formData[formNumber] = formData[formNumber] || {};
    
    if (e.target.type === 'number') {
        formData[formNumber].amount = parseFloat(e.target.value) || 0;
    } else if (e.target.tagName === 'SELECT') {
        if (e.target.previousElementSibling.textContent.includes('Vehicle')) {
            formData[formNumber].vehicle = e.target.value;
        } else if (e.target.previousElementSibling.textContent.includes('Project')) {
            formData[formNumber].project = e.target.value;
        }
    }
}

// Handle filling submit
async function handleFillingSubmit(e) {
    e.preventDefault();
    try {
        const formData = new FormData(e.target);
        console.log('Filling Form Data:', Object.fromEntries(formData));
        alert('Fuel filling submitted successfully!');
        e.target.reset();
        setDefaultDate();
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form');
    }
}

// Handle requisition submit
async function handleRequisitionSubmit() {
    try {
        // Validate forms first
        const forms = document.querySelectorAll('#requisitionForms form');
        let isValid = true;

        forms.forEach(form => {
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });
        });

        if (!isValid) {
            throw new Error('Please fill in all required fields');
        }

        const total = Object.values(formData).reduce((sum, form) => {
            return sum + (form.amount || 0);
        }, 0);
        
        const totalElement = document.getElementById('totalAmount');
        const alertElement = document.getElementById('totalAlert');
        
        if (totalElement && alertElement) {
            totalElement.textContent = total.toLocaleString();
            alertElement.classList.remove('hidden');
        }
        
        console.log('Requisition Data:', formData);
        console.log('Total Amount:', total);
        
        alert('Requisitions submitted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error submitting requisitions');
    }
}
