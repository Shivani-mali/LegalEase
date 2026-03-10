// Dashboard JavaScript

// Page initialization
document.addEventListener('DOMContentLoaded', function () {
    // Set up menu item click handlers
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function () {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = '/auth/logout';
        }
    });

    // Mobile / tablet sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }

    // Set default section to home
    switchSection('home');
});

// Switch between sections
function switchSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });

    // Show selected section
    const sectionId = section + '-section';
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }

    if (section === 'laws') {
        const lawCategories = document.getElementById('lawCategories');
        const lawViewer = document.getElementById('lawViewer');
        if (lawCategories && lawViewer) {
            lawCategories.style.display = 'grid';
            lawViewer.style.display = 'none';
        }
    }

    if (section === 'documents') {
        const docTypes = document.getElementById('documentTypes');
        const docViewer = document.getElementById('documentViewer');
        if (docTypes && docViewer) {
            docTypes.style.display = 'grid';
            docViewer.style.display = 'none';
        }
    }

    // Update page title
    updatePageTitle(section);

    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });

    // Close mobile menu
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

// Update page title
function updatePageTitle(section) {
    const titles = {
        'home': 'Dashboard',
        'ask-legal': 'Ask Legal Question',
        'laws': 'Explore Laws',
        'documents': 'Generate Documents',
        'settings': 'Settings'
    };

    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
}

// Legal Question Handler
async function askLegalQuestion() {
    const question = document.getElementById('legalQuestion').value.trim();
    const language = document.getElementById('language').value;

    if (!question) {
        alert('Please enter a question');
        return;
    }

    // Show loading state
    const btn = document.getElementById('askBtn');
    btn.disabled = true;
    btn.textContent = 'Getting answer...';

    try {
        const response = await fetch('/api/legal/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, language })
        });

        const data = await response.json();

        if (data.success) {
            displayAnswer(data.answer);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while getting the answer');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Get Answer';
    }
}

// Display answer
function displayAnswer(answer) {
    const container = document.getElementById('answerContainer');
    const content = document.getElementById('answerContent');

    content.textContent = answer;
    container.style.display = 'block';

    // Scroll to answer
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Clear answer
function clearAnswer() {
    document.getElementById('answerContainer').style.display = 'none';
    document.getElementById('answerContent').textContent = '';
}

// Download answer
function downloadAnswer() {
    const content = document.getElementById('answerContent').textContent;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'legal_answer.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Share answer
function shareAnswer() {
    const content = document.getElementById('answerContent').textContent;
    if (navigator.share) {
        navigator.share({
            title: 'Legal Answer',
            text: content
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(content).then(() => {
            alert('Answer copied to clipboard!');
        });
    }
}

// Get law category
async function getCategory(category) {
    try {
        const response = await fetch(`/api/legal/laws/${category}`);
        const data = await response.json();

        if (data.success) {
            displayLaws(data.laws, category);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display laws
function displayLaws(laws, category) {
    const content = document.getElementById('lawsContent');
    content.innerHTML = `<h3>${category.toUpperCase()} LAWS</h3>`;

    if (laws.length === 0) {
        content.innerHTML += '<p>No laws found for this category.</p>';
    } else {
        laws.forEach(law => {
            const lawElement = document.createElement('div');
            lawElement.className = 'law-detail';

            // Format description by splitting new lines into paragraphs for better readability
            const formattedDescription = law.description.split('\n').map(p => `<p>${p}</p>`).join('');

            lawElement.innerHTML = `
                <h4>${law.title}</h4>
                <div class="law-meta">
                    <span class="law-tag"><strong>Act:</strong> ${law.act || 'N/A'}</span>
                    <span class="law-tag"><strong>Sections:</strong> ${law.sections || 'N/A'}</span>
                </div>
                <div class="law-desc">${formattedDescription}</div>
            `;
            content.appendChild(lawElement);
        });
    }

    document.getElementById('lawCategories').style.display = 'none';
    document.getElementById('lawViewer').style.display = 'block';
}

// Show law categories
function showCategories() {
    document.getElementById('lawViewer').style.display = 'none';
    document.getElementById('lawCategories').style.display = 'grid';
}

// Select document type
function selectDocumentType(docType) {
    const formContainer = document.getElementById('documentForm');
    let formHTML = `<h3>Generate ${docType.replace('_', ' ').toUpperCase()}</h3>`;
    formHTML += '<div class="form-container">';

    if (docType === 'legal_notice') {
        formHTML += `
            <div class="form-group">
                <label>Defendant Name</label>
                <input type="text" id="defendant" placeholder="Name of defendant/respondent">
            </div>
            <div class="form-group">
                <label>Details of Dispute</label>
                <textarea id="details" rows="4" placeholder="Describe the dispute"></textarea>
            </div>
            <div class="form-group">
                <label>Demands</label>
                <textarea id="demands" rows="3" placeholder="What relief/compensation do you seek?"></textarea>
            </div>
            <div class="form-group">
                <label>Your Name</label>
                <input type="text" id="senderName" placeholder="Your full name">
            </div>
            <div class="form-group">
                <label>Your Address</label>
                <textarea id="senderAddress" rows="3" placeholder="Your address"></textarea>
            </div>
        `;
    } else if (docType === 'fir_draft') {
        formHTML += `
            <div class="form-group">
                <label>Your Name</label>
                <input type="text" id="complainantName" placeholder="Full name">
            </div>
            <div class="form-group">
                <label>Date of Incident</label>
                <input type="date" id="incidentDate">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="location" placeholder="Where did the incident occur?">
            </div>
            <div class="form-group">
                <label>Description of Incident</label>
                <textarea id="incidentDescription" rows="4" placeholder="Describe what happened"></textarea>
            </div>
            <div class="form-group">
                <label>Persons Involved</label>
                <textarea id="personsInvolved" rows="3" placeholder="Names and details of persons involved"></textarea>
            </div>
            <div class="form-group">
                <label>Suspected Offense(s)</label>
                <input type="text" id="offenses" placeholder="e.g., IPC Section 420, 504">
            </div>
            <div class="form-group">
                <label>Evidence/Witnesses</label>
                <textarea id="evidence" rows="3" placeholder="Details of evidence and witnesses"></textarea>
            </div>
            <div class="form-group">
                <label>Relief Sought</label>
                <textarea id="relief" rows="3" placeholder="What action do you seek?"></textarea>
            </div>
        `;
    } else if (docType === 'rent_agreement') {
        formHTML += `
            <div class="form-group">
                <label>Landlord Name</label>
                <input type="text" id="landlordName" placeholder="Full name">
            </div>
            <div class="form-group">
                <label>Landlord Address</label>
                <textarea id="landlordAddress" rows="2" placeholder="Address"></textarea>
            </div>
            <div class="form-group">
                <label>Tenant Name</label>
                <input type="text" id="tenantName" placeholder="Full name">
            </div>
            <div class="form-group">
                <label>Tenant Address</label>
                <textarea id="tenantAddress" rows="2" placeholder="Address"></textarea>
            </div>
            <div class="form-group">
                <label>Property Address</label>
                <textarea id="propertyAddress" rows="2" placeholder="Full address of property"></textarea>
            </div>
            <div class="form-group">
                <label>Property Type</label>
                <input type="text" id="propertyType" placeholder="e.g., Flat, House, Office">
            </div>
            <div class="form-group">
                <label>Property Area (Sq. Ft.)</label>
                <input type="text" id="propertyArea" placeholder="Area in square feet">
            </div>
            <div class="form-group">
                <label>Monthly Rent (Rs.)</label>
                <input type="number" id="monthlyRent" placeholder="Amount">
            </div>
            <div class="form-group">
                <label>Security Deposit (Rs.)</label>
                <input type="number" id="securityDeposit" placeholder="Amount">
            </div>
            <div class="form-group">
                <label>Lease Duration (Months)</label>
                <input type="number" id="leaseDuration" placeholder="Duration">
            </div>
            <div class="form-group">
                <label>Commencement Date</label>
                <input type="date" id="commencementDate">
            </div>
            <div class="form-group">
                <label>Utility Payer</label>
                <select id="utilityPayer">
                    <option value="Tenant">Tenant</option>
                    <option value="Landlord">Landlord</option>
                    <option value="Shared">Shared</option>
                </select>
            </div>
        `;
    } else if (docType === 'affidavit') {
        formHTML += `
            <div class="form-group">
                <label>Your Name</label>
                <input type="text" id="deponentName" placeholder="Full name">
            </div>
            <div class="form-group">
                <label>Father's Name</label>
                <input type="text" id="fatherName" placeholder="Father's full name">
            </div>
            <div class="form-group">
                <label>Your Address</label>
                <textarea id="address" rows="2" placeholder="Full address"></textarea>
            </div>
            <div class="form-group">
                <label>Statement 1</label>
                <textarea id="statement1" rows="2" placeholder="First statement to affirm"></textarea>
            </div>
            <div class="form-group">
                <label>Statement 2</label>
                <textarea id="statement2" rows="2" placeholder="Second statement to affirm"></textarea>
            </div>
            <div class="form-group">
                <label>Statement 3</label>
                <textarea id="statement3" rows="2" placeholder="Third statement to affirm"></textarea>
            </div>
            <div class="form-group">
                <label>Place</label>
                <input type="text" id="place" placeholder="City/Place">
            </div>
        `;
    }

    formHTML += `
        <div class="form-buttons">
            <button class="btn btn-primary" onclick="generateDocument('${docType}')">Generate Document</button>
            <button class="btn btn-secondary" onclick="resetForm()">Clear</button>
        </div>
    </div>
    `;

    formContainer.innerHTML = formHTML;

    // Toggle views
    document.getElementById('documentTypes').style.display = 'none';
    document.getElementById('documentViewer').style.display = 'block';
}

// Show document types grid
function showDocumentTypes() {
    document.getElementById('documentViewer').style.display = 'none';
    document.getElementById('documentTypes').style.display = 'grid';
}

// Generate document
async function generateDocument(docType) {
    const content = collectFormData(docType);

    try {
        const response = await fetch('/api/documents/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                document_type: docType,
                content: content
            })
        });

        const data = await response.json();

        if (data.success) {
            displayGeneratedDocument(data.content);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

// Collect form data
function collectFormData(docType) {
    const content = {};

    if (docType === 'legal_notice') {
        content.defendant = document.getElementById('defendant')?.value || '';
        content.details = document.getElementById('details')?.value || '';
        content.demands = document.getElementById('demands')?.value || '';
        content.sender_name = document.getElementById('senderName')?.value || '';
        content.sender_address = document.getElementById('senderAddress')?.value || '';
    } else if (docType === 'fir_draft') {
        content.complainant_name = document.getElementById('complainantName')?.value || '';
        content.incident_date = document.getElementById('incidentDate')?.value || '';
        content.location = document.getElementById('location')?.value || '';
        content.incident_description = document.getElementById('incidentDescription')?.value || '';
        content.persons_involved = document.getElementById('personsInvolved')?.value || '';
        content.offenses = document.getElementById('offenses')?.value || '';
        content.evidence = document.getElementById('evidence')?.value || '';
        content.relief = document.getElementById('relief')?.value || '';
    } else if (docType === 'rent_agreement') {
        content.landlord_name = document.getElementById('landlordName')?.value || '';
        content.landlord_address = document.getElementById('landlordAddress')?.value || '';
        content.tenant_name = document.getElementById('tenantName')?.value || '';
        content.tenant_address = document.getElementById('tenantAddress')?.value || '';
        content.property_address = document.getElementById('propertyAddress')?.value || '';
        content.property_type = document.getElementById('propertyType')?.value || '';
        content.property_area = document.getElementById('propertyArea')?.value || '';
        content.monthly_rent = document.getElementById('monthlyRent')?.value || '';
        content.security_deposit = document.getElementById('securityDeposit')?.value || '';
        content.lease_duration = document.getElementById('leaseDuration')?.value || '';
        content.commencement_date = document.getElementById('commencementDate')?.value || '';
        content.utility_payer = document.getElementById('utilityPayer')?.value || '';
    } else if (docType === 'affidavit') {
        content.deponent_name = document.getElementById('deponentName')?.value || '';
        content.father_name = document.getElementById('fatherName')?.value || '';
        content.address = document.getElementById('address')?.value || '';
        content.statement_1 = document.getElementById('statement1')?.value || '';
        content.statement_2 = document.getElementById('statement2')?.value || '';
        content.statement_3 = document.getElementById('statement3')?.value || '';
        content.place = document.getElementById('place')?.value || '';
    }

    return content;
}

// Display generated document
function displayGeneratedDocument(content) {
    const container = document.getElementById('documentForm');
    const documentDiv = document.createElement('div');
    documentDiv.className = 'generated-document';
    documentDiv.innerHTML = `
        <h3>Generated Document Preview</h3>
        <div class="document-content">
            ${content.replace(/\n/g, '<br>')}
        </div>
        <div class="document-actions">
            <button class="btn btn-primary" onclick="downloadDocument()">📥 Download</button>
            <button class="btn btn-secondary" onclick="printDocument()">🖨️ Print</button>
            <button class="btn btn-secondary" onclick="shareDocument()">📤 Share</button>
        </div>
    `;
    container.appendChild(documentDiv);
}

// Download document
function downloadDocument() {
    const content = document.querySelector('.document-content').textContent;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'legal_document.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Print document
function printDocument() {
    const content = document.querySelector('.document-content').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Legal Document</title></head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Share document
function shareDocument() {
    const content = document.querySelector('.document-content').textContent;
    if (navigator.share) {
        navigator.share({
            title: 'Legal Document',
            text: content
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(content);
        alert('Document copied to clipboard!');
    }
}

// Reset form
function resetForm() {
    document.getElementById('documentForm').innerHTML = '';
}


// Responsive adjustments
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
});

// Search bar functions
function performSearch() {
    const searchQuery = document.getElementById('legalSearchBar').value.trim();
    if (searchQuery) {
        document.getElementById('legalQuestion').value = searchQuery;
        switchSection('ask-legal');
    }
}

function handleSearchKeypress(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}
