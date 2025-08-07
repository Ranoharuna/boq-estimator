// Load data on startup
window.onload = function () {
  loadDataFromLocalStorage();
  calculateTotal(); // show total if data exists
};

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
  const table = document.getElementById("boq-body");

  const row = table.insertRow();
  row.innerHTML = `
    <td>${itemName}</td>
    <td>${unit}</td>
    <td>${quantity}</td>
    <td>${rate}</td>
    <td>${amount.toFixed(2)}</td>
  `;

  // Clear inputs
  document.getElementById("itemName").value = "";
  document.getElementById("unit").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("rate").value = "";

  calculateTotal();
  saveDataToLocalStorage();
}

function calculateTotal() {
  const rows = document.querySelectorAll("#boq-body tr");
  let total = 0;

  rows.forEach((row) => {
    const amount = parseFloat(row.cells[4].textContent);
    total += amount;
  });

  document.getElementById("totalAmount").textContent = total.toFixed(2);
}

// ---------- Export to Excel ----------
function downloadExcel() {
  let table = document.getElementById("boq-table");
  let html = table.outerHTML;

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "BOQ_Estimate.xls";
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Export to PDF ----------
function downloadPDF() {
  const table = document.getElementById("boq-table").outerHTML;
  const total = document.getElementById("totalAmount").textContent;

  const win = window.open("", "", "height=700,width=900");
  win.document.write("<html><head><title>BOQ Estimate PDF</title></head><body>");
  win.document.write("<h2>BOQ Estimate</h2>");
  win.document.write(table);
  win.document.write(`<h3>Total: ₦${total}</h3>`);
  win.document.write("</body></html>");
  win.document.close();
  win.print();
}

// ---------- Save to Local Storage ----------
function saveDataToLocalStorage() {
  const rows = document.querySelectorAll("#boq-body tr");
  let data = [];

  rows.forEach((row) => {
    let rowData = {
      itemName: row.cells[0].textContent,
      unit: row.cells[1].textContent,
      quantity: row.cells[2].textContent,
      rate: row.cells[3].textContent,
      amount: row.cells[4].textContent,
    };
    data.push(rowData);
  });

  localStorage.setItem("boqData", JSON.stringify(data));
}

// ---------- Load from Local Storage ----------
function loadDataFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("boqData")) || [];
  const table = document.getElementById("boq-body");

  data.forEach((rowData) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${rowData.itemName}</td>
      <td>${rowData.unit}</td>
      <td>${rowData.quantity}</td>
      <td>${rowData.rate}</td>
      <td>${rowData.amount}</td>
    `;
  });
}
