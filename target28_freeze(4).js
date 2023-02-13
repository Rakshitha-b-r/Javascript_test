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
      }
      .table-header {
        background-color: #eee;
        border: 1px solid black;
        border-collapse: collapse;
      }
      .table-body {
        display: block;
        overflow-y: auto;
      }
      .table-content {
        margin-top: 40px;
      }
      .table-cell {
        padding: 5px;
        border-bottom: 1px solid #ccc;
        border: 1px solid black;
        border-collapse: collapse;
      }
      .header-group {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
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
        border: 1px solid black;
        border-collapse: collapse;
      }
      .table-header {
        background-color: #eee;
        border: 1px solid black;
        border-collapse: collapse;
      }
      .table-body {
        display: block;
        overflow-y: auto;
      }
      .table-content {
        margin-top: 40px;
      }
      .table-cell {
        padding: 5px;
        border-bottom: 1px solid #ccc;
        border: 1px solid black;
        border-collapse: collapse;
      }
      .header-group {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
      </style>
    `;

    generatedHTML += "<table class='table'>";
    generatedHTML += "<header class='header-group'>";
    generatedHTML += "<div>";
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' colspan='3'><b>COUNTERPARTY</b></th>`;
    generatedHTML += `<th class='table-header' colspan='15'><b>ORIGINAL EXPOSURES</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='5'>(-) Value adjustments and provisions</th>`;
    generatedHTML += `<th class='table-header' rowspan='5'>(-) Exposures deducted from CET 1 or Additional Tier 1 items</th>`;
    generatedHTML += `<th class='table-header' rowspan='3' colspan='3'><b>Exposure value before application of exemptions and CRM </b></th>`;
    generatedHTML += `<th class='table-header' colspan='8'><b>ELIGIBLE CREDIT RISK MITIGATION (CRM) TECHNIQUES</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='5'>(-) Amounts exempted</th>`;
    generatedHTML += `<th class='table-header' rowspan='3' colspan='3'><b>Exposure value after application of exemptions and CRM</b></th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' rowspan='4'>Code</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>Group or individual</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>Transactions where there is an exposure to underlying assets</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'><b>Total original exposure</b></th>`;
    generatedHTML += `<th class='table-header' colspan='14'></th>`;
    generatedHTML += `<th class='table-header' colspan='6' rowspan='2'>(-) Substitution effect of eligible credit risk mitigation techniques</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>(-) Funded credit protection other than substitution effect</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>(-) Real estate</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' colspan='1'></th>`;
    generatedHTML += `<th class='table-header' colspan='6'>Direct exposures</th>`;
    generatedHTML += `<th class='table-header' colspan='6'>Indirect exposures</th>`;
    generatedHTML += `<th class='table-header' rowspan='3'>Additional exposures arising from transactions where there is an exposure to underlying assets</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' rowspan='2'>Of which: defaulted</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>Off balance sheet items</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>Off balance sheet items</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><b>Total</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Of which: Non-trading book </th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>% of Tier 1 capital </th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>(-) Off balance sheet items</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><b>Total</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Of which: Non-trading book</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>% of Tier 1 capital</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' rowspan='1'>Loan commit-ments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Financial guarantees</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Other commit-ments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Loan commit-ments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Financial guarantees</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Other commit-ments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>(-) Loan commit-ments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>(-) Financial guarantees</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>(-) Other commit-ments</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "</header>";
    generatedHTML += "</div>";


    // First row is the header
    //generatedHTML += "<tbody class='table-content'>";
    generatedHTML += "<tbody class='table-body'>";
    generatedHTML += "<tr class='table-header'>";
    for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
      generatedHTML += `<th class='table-header'>${field.label_short}</th>`;
    }
    generatedHTML += "</tr>";

    // Next rows are the data
    for (row of data) {
      generatedHTML += "<tr class='table-row'>";
      for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
        generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`;
      }
      generatedHTML += "</tr>";
    }
    generatedHTML += "</tbody>";
    generatedHTML += "</table>";

    this._container.innerHTML = generatedHTML;

    done();
  }
});
