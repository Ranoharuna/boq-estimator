// === Add New Row ===
function addRow() {
  const itemName = document.getElementById("itemName").value;
  const unit = document.getElementById("unit").value;
  const quantity = parseFloat(document.getElementById("quantity").value);
  const rate = parseFloat(document.getElementById("rate").value);

  if (!itemName || !unit || isNaN(quantity) || isNaN(rate)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const amount = quantity * rate;
  const tableBody = document.getElementById("boq-body");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${itemName}</td>
    <td>${unit}</td>
    <td>${quantity}</td>
    <td>${rate}</td>
    <td>${amount.toFixed(2)}</td>
  `;
  tableBody.appendChild(row);

  saveRowToStorage({ itemName, unit, quantity, rate, amount });
  calculateTotal();

  document.getElementById("itemName").value = "";
  document.getElementById("unit").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("rate").value = "";
}

// === Calculate Total ===
function calculateTotal() {
  const table = document.getElementById("boq-body");
  let total = 0;

  for (let i = 0; i < table.rows.length; i++) {
    const amount = parseFloat(table.rows[i].cells[4].innerText);
    total += amount;
  }

  document.getElementById("totalAmount").innerText = total.toFixed(2);
}

// === Export to PDF ===
function exportToPDF() {
  const element = document.getElementById("boq-table");
  const opt = {
    margin:       0.5,
    filename:     'boq_estimate.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save();
}

// === Save to Browser Storage ===
function saveRowToStorage(rowData) {
  let rows = JSON.parse(localStorage.getItem("boqRows")) || [];
  rows.push(rowData);
  localStorage.setItem("boqRows", JSON.stringify(rows));
}

// === Load on Page Load ===
function loadRowsFromStorage() {
  const rows = JSON.parse(localStorage.getItem("boqRows")) || [];
  const tableBody = document.getElementById("boq-body");
  tableBody.innerHTML = "";

  rows.forEach((data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.itemName}</td>
      <td>${data.unit}</td>
      <td>${data.quantity}</td>
      <td>${data.rate}</td>
      <td>${data.amount.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });

  calculateTotal();
}

// === Load saved rows when page loads ===
window.onload = loadRowsFromStorage;
