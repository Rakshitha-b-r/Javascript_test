looker.plugins.visualizations.add({
  create: function(element, config) {
    element.innerHTML = `
      <table id="table">
        <thead>
          <tr>
            ${config.columns.map(col => `<th>${col}</th>`).join("")}
          </tr>
        </thead>
        <tbody id="table-body">
        </tbody>
      </table>
    `;
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach(row => {
      const tableRow = document.createElement("tr");
      config.columns.forEach(col => {
        const tableCell = document.createElement("td");
        tableCell.innerHTML = row[col].rendered || row[col].value;
        tableRow.appendChild(tableCell);
      });
      tableBody.appendChild(tableRow);
    });

    done()
  }
});
