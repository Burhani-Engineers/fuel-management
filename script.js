// Initial Data
const vehicles = [
    'KBH 952V', 'KBM 190H', 'KBP 540Q', 'KCK 951W', 'KCN 684B'
];

const projects = [
    { code: '51095', name: 'Project 51095' },
    { code: '51105', name: 'Project 51105' },
    { code: '51166', name: 'Project 51166' }
];

// Create Requisition Form HTML
function createRequisitionForm() {
    return `
        <div class="form-container">
            <h2 class="text-xl mb-4">Fuel Requisition Form</h2>
            <div class="space-y-4">
                <div>
                    <label>Vehicle Number</label>
                    <select class="w-full p-2 border rounded">
                        <option value="">Select Vehicle</option>
                        ${vehicles.map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label>Project Code</label>
                    <select class="w-full p-2 border rounded">
                        <option value="">Select Project</option>
                        ${projects.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label>Amount Required (KES)</label>
                    <input type="number" class="w-full p-2 border rounded" placeholder="Enter amount">
                </div>
                <button class="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800">
                    Submit Requisition
                </button>
            </div>
        </div>
    `;
}
// Handle tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const formsContainer = document.getElementById('forms');
    
    // Show requisition form by default
    formsContainer.innerHTML = createRequisitionForm();
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show appropriate form
            if (tab.dataset.tab === 'requisition') {
                formsContainer.innerHTML = createRequisitionForm();
            } else {
                formsContainer.innerHTML = createFillingForm();
            }
        });
    });
});
