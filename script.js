// =============================
// Variables & DOM Elements
// =============================
const boqTable = document.getElementById("boqTable").getElementsByTagName("tbody")[0];
const totalCostEl = document.getElementById("totalCost");

const itemInput = document.getElementById("item");
const qtyInput = document.getElementById("quantity");
const unitInput = document.getElementById("unit");
const priceInput = document.getElementById("unitPrice");

// =============================
// Add Item to Table
// =============================
function addItem() {
    const item = itemInput.value.trim();
    const quantity = parseFloat(qtyInput.value);
    const unit = unitInput.value.trim();
    const unitPrice = parseFloat(priceInput.value);

    if (!item || isNaN(quantity) || !unit || isNaN(unitPrice)) {
        alert("Please fill all fields correctly.");
        return;
    }

    const total = quantity * unitPrice;

    const row = boqTable.insertRow();
    row.insertCell(0).textContent = item;
    row.insertCell(1).textContent = quantity;
    row.insertCell(2).textContent = unit;
    row.insertCell(3).textContent = unitPrice.toFixed(2);
    row.insertCell(4).textContent = total.toFixed(2);

    // Delete Button
    const actionCell = row.insertCell(5);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
        row.remove();
        updateTotal();
        saveToLocalStorage();
    };
    actionCell.appendChild(deleteBtn);

    updateTotal();
    saveToLocalStorage();
    clearForm();
}

// =============================
// Update Total Cost
// =============================
function updateTotal() {
    let totalCost = 0;
    for (let i = 0; i < boqTable.rows.length; i++) {
        totalCost += parseFloat(boqTable.rows[i].cells[4].textContent);
    }
    totalCostEl.textContent = totalCost.toFixed(2);
}

// =============================
// Clear Form Inputs
// =============================
function clearForm() {
    itemInput.value = "";
    qtyInput.value = "";
    unitInput.value = "";
    priceInput.value = "";
}

// =============================
// Clear All Rows
// =============================
function clearAll() {
    if (confirm("Are you sure you want to clear all items?")) {
        boqTable.innerHTML = "";
        updateTotal();
        saveToLocalStorage();
    }
}

// =============================
// Export to Excel
// =============================
function exportToExcel() {
    const table = document.getElementById("boqTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "BOQ" });
    XLSX.writeFile(wb, "BOQ_Estimate.xlsx");
}

// =============================
// Export to PDF
// =============================
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html: "#boqTable" });
    doc.save("BOQ_Estimate.pdf");
}

// =============================
// Save to Local Storage
// =============================
function saveToLocalStorage() {
    const rows = [];
    for (let i = 0; i < boqTable.rows.length; i++) {
        const cells = boqTable.rows[i].cells;
        rows.push({
            item: cells[0].textContent,
            qty: cells[1].textContent,
            unit: cells[2].textContent,
            price: cells[3].textContent,
            total: cells[4].textContent
        });
    }
    localStorage.setItem("boqData", JSON.stringify(rows));
}

// =============================
// Load from Local Storage
// =============================
function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("boqData"));
    if (data) {
        data.forEach(rowData => {
            const row = boqTable.insertRow();
            row.insertCell(0).textContent = rowData.item;
            row.insertCell(1).textContent = rowData.qty;
            row.insertCell(2).textContent = rowData.unit;
            row.insertCell(3).textContent = parseFloat(rowData.price).toFixed(2);
            row.insertCell(4).textContent = parseFloat(rowData.total).toFixed(2);

            const actionCell = row.insertCell(5);
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = function () {
                row.remove();
                updateTotal();
                saveToLocalStorage();
            };
            actionCell.appendChild(deleteBtn);
        });
        updateTotal();
    }
}

// =============================
// Initialize on Page Load
// =============================
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

