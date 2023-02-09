looker.plugins.visualizations.add({
  create: function(element, config) {
    element.innerHTML = `
      <table id="table">
        <thead>
          <tr id="table-header"></tr>
        </thead>
        <tbody id="table-body"></tbody>
      </table>
    `;
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    const tableHeader = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    const columns = queryResponse.fields.dimension_like.map(field => field.label);
    columns.forEach(col => {
      const headerCell = document.createElement("th");
      headerCell.innerHTML = col;
      tableHeader.appendChild(headerCell);
    });

    data.forEach(row => {
      const tableRow = document.createElement("tr");
      columns.forEach(col => {
        const tableCell = document.createElement("td");
        tableCell.innerHTML = row[col].value;
        tableRow.appendChild(tableCell);
      });
      tableBody.appendChild(tableRow);
    });

    done();
  }
});
