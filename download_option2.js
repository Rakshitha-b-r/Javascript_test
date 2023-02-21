looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "looker_table",
  label: "Table",
  options: {
    font_size: {
      type: "number",
      label: "Font Size (px)",
      default: 11
    }
  },
  // Set up the initial state of the visualization
  create: function (element, config) {
    console.log(config);
    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .table {
          font-size: ${config.font_size}px;
          border: 1px solid black;
          border-collapse: collapse;
          margin:auto;
        }
        .table-header {
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
          font-weight: normal;
          font-family: 'Verdana';
          font-size: 11px;
          align-items: center;
          text-align: center;
          margin: auto;
          width: 90px;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
          font-family: 'Verdana';
          font-size: 11px;
          align-items: center;
          text-align: center;
          margin: auto;
          width: 90px;
        }
      </style>
    `;
    // Create a container element to let us center the text.
    this._container = element.appendChild(document.createElement("div"));
    var XLSX = document.createElement("script");
    XLSX.type = "text/javascript";
    XLSX.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js";

    XLSX.onload = () => {
      this.addDownloadButtonListener();
    };
    document.head.appendChild(XLSX);
  },
  // addDownloadButtonListener: function () {
  //   const downloadButton = this._container.querySelector('button');
  //   downloadButton.addEventListener('click', (event) => {
  //       var csv = [];
  //       var rows = document.querySelectorAll("table tr");
      
  //       for (var i = 0; i < rows.length; i++) {
  //         var row = [];
  //         var cols = rows[i].querySelectorAll("td, th");
      
  //         for (var j = 0; j < cols.length; j++) {
  //           row.push(cols[j].innerText);
  //         }
      
  //         csv.push(row.join(" "));
  //         //csv.push(row);
  //       }
      
  //       // Download CSV file
  //       var filename = "data.xls";
  //       var csvFile = new Blob([csv.join("\n")], { type: "application/vnd.ms-excel" });
  //       var downloadLink = document.createElement("a");
      
  //       downloadLink.download = filename;
  //       downloadLink.href = window.URL.createObjectURL(csvFile);
  //       console.log(downloadLink.href);
  //       downloadLink.style.display = "none";
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();      
  //   });
  // },

  // addDownloadButtonListener: function () {
  //   const downloadButton = this._container.querySelector('button');
  //   var XLSX = document.createElement("script");
  //   XLSX.type = "text/javascript";
  //   XLSX.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js";
  //   XLSX.onload = () => {
  //     downloadButton.addEventListener('click', (event) => {
  //       // Create an empty workbook
  //       const wb = XLSX.utils.book_new();
  //       // Create a worksheet
  //       const ws = XLSX.utils.table_to_sheet(document.querySelector('table'));
  //       // Add the worksheet to the workbook
  //       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //       // Save the workbook
  //       XLSX.writeFile(wb, 'data.xlsx');      
  //     });
  //   }
  //   document.head.appendChild(XLSX);
  // },

  addDownloadButtonListener: function () {
  const downloadButton = this._container.querySelector('button');
  downloadButton.addEventListener('click', (event) => {
    var wb = XLSX.utils.table_to_book(document.querySelector("table"), {sheet:"Sheet1"});
    var filename = "data.xlsx";
    XLSX.writeFile(wb, filename);
    console.log(window.URL.createObjectURL(new Blob([wb], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })));
  });
},

  
  
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    console.log(config);
    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
      return;
    }

    /* Code to generate table
     * In keeping with the spirit of this little visualization plugin,
     * it's done in a quick and dirty way: piece together HTML strings.
     */
    var generatedHTML = `
    <style>
      .table {
        font-size: ${config.font_size}px;
        border: 1px solid black;
        border-collapse: collapse;
        margin:auto;
      }
      .table-header {
        background-color: #eee;
        border: 1px solid black;
        border-collapse: collapse;
        font-weight: normal;
        font-family: 'Verdana';
        font-size: 11px;
        align-items: center;
        text-align: center;
        margin: auto;
        width: 90px;
      }
      .table-cell {
        padding: 5px;
        border-bottom: 1px solid #ccc;
        border: 1px solid black;
        border-collapse: collapse;
        font-family: 'Verdana';
        font-size: 11px;
        align-items: center;
        text-align: center;
        margin: auto;
        width: 90px;
      }
      .table-row {
        border: 1px solid black;
        border-collapse: collapse;
      }
</style>
`;
    generatedHTML += "<table class='table'>";
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' rowspan='2' colspan='2' > </th>`;
    generatedHTML += `<th class='table-header' rowspan='1' colspan='9' style='height: 40px;'><b>Applicable<br>limit</br></b></th>`;
    generatedHTML += "</tr>";

    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' colspan='9' style='font-size: 10px;'> 010 </th>`;
    generatedHTML += "</tr>";

    const header = ['Non institutions', 'Institutions', 'Institutions in %', 'Globally Systemic Important Institutions (G-SIIs)'];

    // Loop through the different types of column types looker exposes
    let i = 0;
    const header1 = ['010', '020', '030', '040'];
    for (column_type of ["dimension_like", "measure_like", "table_calculations"]) {

      // Look through each field (i.e. row of data)
      for (field of queryResponse.fields[column_type]) {
        // First column is the label
        generatedHTML += `<tr><th class='table-header'>${header1[i]}</th>`;
        generatedHTML += `<th class='table-header' style='text-align: left; padding: 5px;width:280px'>${header[i]}</th>`;
        // Next columns are the data
        for (row of data) {
          generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`
        }
        generatedHTML += '</tr>';
        i++;
      }
    }
    generatedHTML += "</table>";
    generatedHTML += `<button type="button" class="button">download CSV</button>`;
    this._container.innerHTML = generatedHTML;
    this.addDownloadButtonListener();


    done();
  }

});
