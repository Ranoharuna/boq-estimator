// ==== Add Row ====
function addRow() {
    let item = document.getElementById("item").value.trim();
    let qty = parseFloat(document.getElementById("quantity").value);
    let rate = parseFloat(document.getElementById("rate").value);

    if (item === "" || isNaN(qty) || isNaN(rate)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    let table = document.getElementById("boqTable").getElementsByTagName('tbody')[0];
    let row = table.insertRow();

    row.innerHTML = `
        <td>${item}</td>
        <td>${qty}</td>
        <td>${rate.toFixed(2)}</td>
        <td>${(qty * rate).toFixed(2)}</td>
        <td><button onclick="deleteRow(this)">❌</button></td>
    `;

    saveData();
    updateTotal();
    clearInputs();
}

// ==== Delete Row ====
function deleteRow(button) {
    button.closest("tr").remove();
    saveData();
    updateTotal();
}

// ==== Clear All Rows ====
function clearAll() {
    if (confirm("Are you sure you want to clear all items?")) {
        document.getElementById("boqTable").getElementsByTagName('tbody')[0].innerHTML = "";
        saveData();
        updateTotal();
    }
}

// ==== Clear Inputs ====
function clearInputs() {
    document.getElementById("item").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("rate").value = "";
}

// ==== Update Total ====
function updateTotal() {
    let total = 0;
    document.querySelectorAll("#boqTable tbody tr").forEach(row => {
        total += parseFloat(row.cells[3].textContent);
    });
    document.getElementById("totalAmount").textContent = total.toFixed(2);
}

// ==== Save to Local Storage ====
function saveData() {
    let rows = [];
    document.querySelectorAll("#boqTable tbody tr").forEach(row => {
        rows.push({
            item: row.cells[0].textContent,
            qty: row.cells[1].textContent,
            rate: row.cells[2].textContent
        });
    });
    localStorage.setItem("boqData", JSON.stringify(rows));
}

// ==== Load from Local Storage ====
function loadData() {
    let data = JSON.parse(localStorage.getItem("boqData")) || [];
    let table = document.getElementById("boqTable").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    data.forEach(row => {
        let newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${row.item}</td>
            <td>${row.qty}</td>
            <td>${parseFloat(row.rate).toFixed(2)}</td>
            <td>${(row.qty * row.rate).toFixed(2)}</td>
            <td><button onclick="deleteRow(this)">❌</button></td>
        `;
    });
    updateTotal();
}

// ==== Export to Excel ====
function exportExcel() {
    let table = document.getElementById("boqTable");
    let wb = XLSX.utils.table_to_book(table, { sheet: "BOQ" });
    XLSX.writeFile(wb, "BOQ_Estimate.xlsx");
}

// ==== Export to PDF ====
function exportPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    doc.autoTable({ html: "#boqTable" });
    doc.save("BOQ_Estimate.pdf");
}

// ==== Print Table ====
function printBOQ() {
    window.print();
}

// ==== On Load ====
window.onload = loadData;
window.addEventListener('DOMContentLoaded', () => {
  const data = localStorage.getItem('takeoffData');
  if (data) {
    const takeoffItems = JSON.parse(data);

    // Example: add each item to your BOQ table
    const boqTableBody = document.querySelector('#boq-table tbody'); // change selector accordingly
    takeoffItems.forEach(item => {
      const tr = document.createElement('tr');

      // Create cells for description, quantity, rate (empty), total (calculated later)
      const descTd = document.createElement('td');
      descTd.textContent = item.description;
      const qtyTd = document.createElement('td');
      qtyTd.textContent = item.quantity;
      const rateTd = document.createElement('td');
      rateTd.innerHTML = '<input type="number" class="rate-input" value="0" />';
      const totalTd = document.createElement('td');
      totalTd.textContent = '0';

      tr.appendChild(descTd);
      tr.appendChild(qtyTd);
      tr.appendChild(rateTd);
      tr.appendChild(totalTd);

      boqTableBody.appendChild(tr);
    });

    // Clear the localStorage after loading to avoid duplication on reload
    localStorage.removeItem('takeoffData');

    // Optionally trigger any recalculation logic you have
    recalculateBOQTotals();
  }
});
