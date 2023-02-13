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
          height: 50px;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-header {
          font-weight: bold;
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
          position: fixed;
          z-index :1;
          top:0;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-body-wrap {
          overflow-y: scroll;
          height: calc(100% - 50px);
        }
         .freeze-header {
          position: fixed;
          top: 0;
          left: 0;
          width: calc(100% - 17px);
          background-color: white;
          z-index: 1;
          }
        .table-container {
          overflow-x: auto;
          }
      </style>
    `;

    // Create a container element to let us center the text.
    this._container = element.appendChild(document.createElement("div"));

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
          height: 50px;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-header {
          font-weight: bold;
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
          position: fixed;
          z-index :1;
          top:0;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
        }
         .table-row {
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-body-wrap {
          overflow-y: scroll;
          height: calc(100% - 50px);
        }
        .freeze-header {
          position: fixed;
          top: 0;
          left: 0;
          width: calc(100% - 17px);
          background-color: white;
          z-index: 1;
          }
        .table-container {
          overflow-x: auto;
          }
      </style>
    `;
    var tableContainer = document.querySelector(".table-container");
    var header = tableContainer.querySelector("thead");
    header.classList.add("freeze-header");
    header.style.width = tableContainer.offsetWidth + "px";
    tableContainer.onscroll = function () {
      header.style.left = -this.scrollLeft + "px";
    };
    generatedHTML += "<div class='freeze-header'>";
    generatedHTML += "<table class='table'>";
    generatedHTML += "<thead>";
    generatedHTML += "<tr>";
    generatedHTML += `<th colspan='8'>COUNTERPARTY IDENTIFICATION</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th>Code</th>`;
    generatedHTML += `<th>Type of Code</th>`;
    generatedHTML += `<th>Name</th>`;
    generatedHTML += `<th>National Code</th>`;
    generatedHTML += `<th>Residence of the Counterparty</th>`;
    generatedHTML += `<th>Sector of the Counterparty</th>`;
    generatedHTML += `<th>NACE Code</th>`;
    generatedHTML += `<th>Type of Counterparty</th>`;
    generatedHTML += "</tr>";


    // First row is the header
    generatedHTML += "<tr>";
    for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
      generatedHTML += `<th>${field.label_short}</th>`;
    }
    generatedHTML += "</tr>";
    generatedHTML += "</thead>";

    // Next rows are the data
    for (row of data) {
      generatedHTML += "<tr class='table-row'>";
      for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
        generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`;
      }
      generatedHTML += "</tr>";
    }
    generatedHTML += "</table>";
    generatedHTML += "</div>";

    this._container.innerHTML = generatedHTML;

    done();
  }
});
