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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing application...');
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize dropdowns
    initializeDropdowns();
    
    // Setup tab switching
    setupTabs();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Set default date
    setDefaultDates();

    // Add initial requisition form
    addRequisitionForm();
});

function initializeDropdowns() {
    console.log('Initializing dropdowns...');
    
    // Initialize vehicle dropdowns
    const vehicleSelect = document.getElementById('vehicleSelect');
    if (vehicleSelect) {
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle;
            option.textContent = vehicle;
            vehicleSelect.appendChild(option);
        });
    }

    // Initialize project dropdowns
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

function setupFormHandlers() {
    // Fuel Filling Form Handler
    const fillingForm = document.getElementById('fillingForm');
    if (fillingForm) {
        fillingForm.addEventListener('submit', handleFillingSubmit);
    }

    // Requisition Form Handlers
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', addRequisitionForm);
    }

    const submitAllBtn = document.getElementById('submitAllBtn');
    if (submitAllBtn) {
        submitAllBtn.addEventListener('click', handleRequisitionSubmit);
    }
}

function setDefaultDates() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.value = today;
    });
}

let requisitionFormCount = 0;
const requisitionData = {};

function addRequisitionForm() {
    requisitionFormCount++;
    
    const requisitionForms = document.getElementById('requisitionForms');
    const newForm = document.createElement('div');
    newForm.className = 'bg-white rounded-lg shadow-lg p-6 mb-6';
    newForm.id = `requisitionForm${requisitionFormCount}`;
    
    newForm.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">Vehicle ${requisitionFormCount}</h3>
        <form class="space-y-4" data-form-id="${requisitionFormCount}">
            <div>
                <label class="block text-sm font-medium mb-2">Vehicle Number</label>
                <select name="vehicle" class="w-full p-3 border rounded-md" required>
                    <option value="">Select Vehicle</option>
                    ${vehicles.map(v => `<option value="${v}">${v}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Project Code</label>
                <select name="project" class="w-full p-3 border rounded-md" required>
                    <option value="">Select Project</option>
                    ${projects.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Amount Required (KES)</label>
                <input type="number" name="amount" class="w-full p-3 border rounded-md" required>
            </div>
        </form>
    `;

    requisitionForms.appendChild(newForm);

    // Add form change listener
    const form = newForm.querySelector('form');
    form.addEventListener('change', (e) => {
        const formId = e.currentTarget.getAttribute('data-form-id');
        requisitionData[formId] = requisitionData[formId] || {};
        
        const field = e.target;
        requisitionData[formId][field.name] = field.value;
    });
}

async function handleFillingSubmit(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        console.log('Filling Form Data:', Object.fromEntries(formData));
        
        // Here you would typically send the data to your backend
        alert('Fuel filling submitted successfully!');
        event.target.reset();
        setDefaultDates();
        
    } catch (error) {
        console.error('Error submitting filling form:', error);
        alert('Error submitting form. Please try again.');
    }
}

async function handleRequisitionSubmit() {
    try {
        // Validate forms
        const forms = document.querySelectorAll('#requisitionForms form');
        let isValid = true;
        let totalAmount = 0;

        forms.forEach(form => {
            const formId = form.getAttribute('data-form-id');
            const formData = requisitionData[formId] || {};

            // Check required fields
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            // Add to total
            if (formData.amount) {
                totalAmount += parseFloat(formData.amount);
            }
        });

        if (!isValid) {
            throw new Error('Please fill in all required fields');
        }

        // Update total display
        const totalAmountElement = document.getElementById('totalAmount');
        const totalAlert = document.getElementById('totalAlert');
        
        if (totalAmountElement && totalAlert) {
            totalAmountElement.textContent = totalAmount.toLocaleString();
            totalAlert.classList.remove('hidden');
        }

        console.log('Requisition Data:', requisitionData);
        console.log('Total Amount:', totalAmount);

        // Here you would typically send the data to your backend
        alert('Requisitions submitted successfully!');
        
    } catch (error) {
        console.error('Error submitting requisitions:', error);
        alert(error.message || 'Error submitting requisitions. Please try again.');
    }
}
