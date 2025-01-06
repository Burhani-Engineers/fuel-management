// Data
const vehicles = [
    'KBH 952V', 'KBM 190H', 'KBP 540Q', 'KCK 951W', 'KCN 684B', 
    'KCQ 103H', 'KCQ 251B', 'KCQ 257Q', 'KCR 853N', 'KCU 452S',
    'KCU 967G', 'KCV 952J', 'KCW 914H', 'KCW 952C', 'KCW 953C',
    'KCZ 652S', 'KDC 153R', 'KDD 553V', 'KDH 113Y', 'KDJ 027M',
    'KDJ 028M', 'KDJ 184S', 'KDL 153W', 'KDM 452W', 'KDM 752Y',
    'KDP 314F', 'KHMA 353L', 'KHMA 355L', 'KMEA 911T', 'KTCB 472V',
    'KTCB 473V', 'KTCB 474V', 'KTCB 595W', 'ZF 8551', 'ZF 9776',
    'UBF 245N', 'UBG 001T (62UN427K)', 'UBF 323N', 'UBF 568P',
    'UBF 324N', 'UBE 247Z'
];

const projects = [
    { code: '51095', name: 'Project 51095' },
    { code: '51105', name: 'Project 51105' },
    { code: '51166', name: 'Project 51166' },
    { code: '51212', name: 'Project 51212' },
    { code: '51268', name: 'Project 51268' },
    { code: '51302', name: 'Project 51302' },
    { code: '51307', name: 'Project 51307' },
    { code: '51336', name: 'Project 51336' },
    { code: '51355', name: 'Project 51355' },
    { code: '51358', name: 'Project 51358' },
    { code: '51365', name: 'Project 51365' },
    { code: '51380', name: 'Project 51380' },
    { code: '51302TAS', name: 'Project 51302TAS' },
    { code: 'HQ', name: 'Headquarters' },
    { code: 'POINT_MALL', name: 'The Point Mall' }
];

// Initialize Lucide icons
lucide.createIcons();

// Populate vehicle dropdowns
document.querySelectorAll('select').forEach(select => {
    if (select.previousElementSibling?.textContent.includes('Vehicle')) {
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle;
            option.textContent = vehicle;
            select.appendChild(option);
        });
    }
});

// Populate project dropdowns
document.querySelectorAll('select').forEach(select => {
    if (select.previousElementSibling?.textContent.includes('Project')) {
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.code;
            option.textContent = `${project.code} - ${project.name}`;
            select.appendChild(option);
        });
    }
});

// Tab functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        const targetId = tab.dataset.tab;
        document.getElementById(targetId)?.classList.remove('hidden');
    });
});

// Requisition form functionality
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
                <label class="block text-sm font-medium mb-1">Requisition Date</label>
                <input type="date" class="w-full p-2 border rounded" required>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Fuel Amount Required</label>
                <input type="number" class="w-full p-2 border rounded" placeholder="Enter amount" required>
            </div>
        </form>
    `;

    document.getElementById('requisition-forms').appendChild(form);

    // Add form change listener
    form.querySelector('form').addEventListener('change', (e) => {
        const formNumber = e.currentTarget.dataset.form;
        formData[formNumber] = formData[formNumber] || {};
        const target = e.target;
        
        if (target instanceof HTMLSelectElement) {
            if (target.previousElementSibling?.textContent.includes('Vehicle')) {
                formData[formNumber].vehicle = target.value;
            } else if (target.previousElementSibling?.textContent.includes('Project')) {
                formData[formNumber].project = target.value;
            }
        } else if (target instanceof HTMLInputElement) {
            if (target.type === 'number') {
                formData[formNumber].amount = parseFloat(target.value) || 0;
            } else if (target.type === 'date') {
                formData[formNumber].date = target.value;
            }
        }
    });

    // Set default date
    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

// Add initial form
createRequisitionForm();

// Add vehicle button
document.getElementById('add-vehicle')?.addEventListener('click', createRequisitionForm);

// Submit all button
document.getElementById('submit-all')?.addEventListener('click', async () => {
    try {
        // Validate forms
        const forms = document.querySelectorAll('[data-form]');
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

        // Calculate total
        const total = Object.values(formData).reduce((sum, form) => {
            return sum + (form.amount || 0);
        }, 0);
        
        document.getElementById('total-amount').textContent = total.toLocaleString();
        document.getElementById('total-alert').classList.remove('hidden');
        
        // Here you would typically send the data to your backend
        console.log('Form Data:', formData);
        console.log('Total Amount Requisited:', total);

        // Show success message
        alert('Requisition submitted successfully!');
        
    } catch (error) {
        alert(error.message || 'An error occurred while submitting the form');
    }
});

// Fuel Filling Form Submission
document.querySelector('#filling form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const form = e.currentTarget;
        const formElements = form.elements;
        const formData = new FormData();

        // Validate and collect form data
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
                if (element.required && !element.value) {
                    element.classList.add('border-red-500');
                    throw new Error('Please fill in all required fields');
                }
                element.classList.remove('border-red-500');
                
                if (element.type === 'file') {
                    const files = element.files;
                    if (files && files.length > 0) {
                        formData.append('receipt', files[0]);
                    }
                } else {
                    formData.append(element.name || element.id || `field_${i}`, element.value);
                }
            }
        }

        // Here you would typically send the data to your backend
        console.log('Filling Form Data:', Object.fromEntries(formData));
        
        // Show success message
        alert('Fuel filling form submitted successfully!');
        form.reset();
        
    } catch (error) {
        alert(error.message || 'An error occurred while submitting the form');
    }
});
