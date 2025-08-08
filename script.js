// === Select DOM elements ===
const boqTable = document.getElementById('boqTable').getElementsByTagName('tbody')[0];
const totalCostEl = document.getElementById('totalCost');

const descInput = document.getElementById('description');
const qtyInput = document.getElementById('quantity');
const unitInput = document.getElementById('unit');
const priceInput = document.getElementById('price');

// === Add row ===
function addRow() {
    const description = descInput.value.trim();
    const quantity = parseFloat(qtyInput.value);
    const unit = unitInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!description || isNaN(quantity) || !unit || isNaN(price)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const total = quantity * price;

    const row = boqTable.insertRow();
    row.innerHTML = `
        <td>${description}</td>
        <td>${quantity}</td>
        <td>${unit}</td>
        <td>${price.toFixed(2)}</td>
        <td>${total.toFixed(2)}</td>
        <td><button onclick="deleteRow(this)">Delete</button></td>
    `;

    saveData();
    updateTotalCost();
    clearForm();
}

// === Delete single row ===
function deleteRow(button) {
    const row = button.parentNode.parentNode;
    boqTable.deleteRow(row.rowIndex - 1); // Adjust index
    saveData();
    updateTotalCost();
}

// === Clear form inputs ===
function clearForm() {
    descInput.value = "";
    qtyInput.value = "";
    unitInput.value = "";
    priceInput.value = "";
}

// === Clear all rows ===
function clearAll() {
    if (confirm("Are you sure you want to clear all rows?")) {
        boqTable.innerHTML = "";
        saveData();
        updateTotalCost();
    }
}

// === Update total cost ===
function updateTotalCost() {
    let total = 0;
    for (let i = 0; i < boqTable.rows.length; i++) {
        total += parseFloat(boqTable.rows[i].cells[4].textContent);
    }
    totalCostEl.textContent = total.toFixed(2);
}

// === Save to localStorage ===
function saveData() {
    const rows = [];
    for (let i = 0; i < boqTable.rows.length; i++) {
        const cells = boqTable.rows[i].cells;
        rows.push({
            description: cells[0].textContent,
            quantity: cells[1].textContent,
            unit: cells[2].textContent,
            price: cells[3].textContent,
            total: cells[4].textContent
        });
    }
    localStorage.setItem("boqData", JSON.stringify(rows));
}

// === Load from localStorage ===
function loadData() {
    const rows = JSON.parse(localStorage.getItem("boqData")) || [];
    rows.forEach(item => {
        const row = boqTable.insertRow();
        row.innerHTML = `
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${parseFloat(item.price).toFixed(2)}</td>
            <td>${parseFloat(item.total).toFixed(2)}</td>
            <td><button onclick="deleteRow(this)">Delete</button></td>
        `;
    });
    updateTotalCost();
}

// === Export to Excel ===
function exportToExcel() {
    const tableClone = document.getElementById('boqTable').cloneNode(true);
    tableClone.deleteTHead(); // Remove table headers if needed

    let wb = XLSX.utils.table_to_book(document.getElementById('boqTable'), { sheet: "BOQ" });
    XLSX.writeFile(wb, 'BOQ_Estimator.xlsx');
}

// === Export to PDF ===
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("BOQ Estimator", 14, 10);
    doc.autoTable({ html: '#boqTable', startY: 20 });
    doc.save("BOQ_Estimator.pdf");
}

// === Initialize ===
window.onload = loadData;
