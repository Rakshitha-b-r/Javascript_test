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
        .table-header{
          font-weight: normal;
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .thead{
          width :100px;
          height : 50px;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
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
        .table-header{
          font-weight: normal;
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .thead{
          width :100%;
        }
        .table-cell {
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
        }
         .table-row {
          border: 1px solid black;
          border-collapse: collapse;
          width :100%;
        }
        table thead tr {
          position: fixed;
          top: 0;
        }
      </style>
    `;
    generatedHTML += "<table class='table'>";
    generatedHTML += "<thead>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' colspan='8'>COUNTERPARTY IDENTIFICATION</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header'>Code</th>`;
    generatedHTML += `<th class='table-header'>Type of Code</th>`;
    generatedHTML += `<th class='table-header'>Name</th>`;
    generatedHTML += `<th class='table-header'>National Code</th>`;
    generatedHTML += `<th class='table-header'>Residence of the Counterparty</th>`;
    generatedHTML += `<th class='table-header'>Sector of the Counterparty</th>`;
    generatedHTML += `<th class='table-header'>NACE Code</th>`;
    generatedHTML += `<th class='table-header'>Type of Counterparty</th>`;
    generatedHTML += "</tr>";


    // First row is the header
    generatedHTML += "<tr>";
    for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
      generatedHTML += `<th class='table-header'>${field.label_short}</th>`;
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

    this._container.innerHTML = generatedHTML;

    // let table = document.querySelector('table');
    // let header = table.querySelector('thead');
    // let headerClone = header.cloneNode(true);
    // headerClone.style.position = 'fixed';
    // headerClone.style.top = '0';
    // headerClone.style.width = '100%';
    // table.parentNode.insertBefore(headerClone, table);
    // table.addEventListener('scroll', function () {
    //   header.scrollCenter = table.scrollCenter;
    // });

    let table = document.querySelector('table');
    let header = table.querySelector('thead');
    let clonedHeader = header.cloneNode(true);
    clonedHeader.id = "clonedHeaderId";
    clonedHeader.style.position = "fixed";
    clonedHeader.style.top = "0";
    // clonedHeader.style.backgroundColor = "white";
    clonedHeader.style.zIndex = "100";
    clonedHeader.style.borderCollapse = "collapse";

    // let clonedHeaderTable = table.getElementsByTagName("table")[0];
    // clonedHeaderTable.style.width = table.offsetWidth + "px";
    // clonedHeaderTable.style.margin = "0";

    // let originalHeaderCells = header.getElementsByTagName("th");
    // let clonedHeaderCells = clonedHeaderTable.getElementsByTagName("th");
    // for (let i = 0; i < originalHeaderCells.length; i++) {
    //   clonedHeaderCells[i].style.width = originalHeaderCells[i].offsetWidth + "px";
    // }

    table.parentNode.insertBefore(clonedHeader, table);
    table.addEventListener('scroll', function () {
      clonedHeader.scrollLeft = table.scrollLeft;
    });

//     const header = document.querySelector("table thead tr");
//     const cells = document.querySelectorAll("table tbody tr:first-child td");

//     window.addEventListener("scroll", function () {
//       for (let i = 0; i < cells.length; i++) {
//         header.children[i].style.width = cells[i].offsetWidth + "px";
//         header.children[i].style.left = cells[i].offsetLeft + "px";
//       }
//     });



    done();
  }
});
