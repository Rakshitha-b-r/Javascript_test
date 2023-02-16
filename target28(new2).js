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

    //generatedHTML += `<p style="font-family: 'Verdana';font-weight:bold;font-size:14px;align-items: center;text-align: left;border: 1px solid black;padding: 5px;background-color: #eee;position:sticky;top:0">C 28.00+ - Identification of the counterparty (LE 1)</p>`;
    generatedHTML += "<table class='table'>";
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' colspan='3'><b>COUNTERPARTY</b></th>`;
    generatedHTML += `<th class='table-header' colspan='15' style='height:25px;'><b>ORIGINAL EXPOSURES</b></th>`;
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
    generatedHTML += `<th class='table-header' colspan='14' style="height:25px;"></th>`;
    generatedHTML += `<th class='table-header' colspan='6' rowspan='2'>(-) Substitution effect of eligible credit risk mitigation techniques</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>(-) Funded credit protection other than substitution effect</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>(-) Real estate</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' colspan='1'></th>`;
    generatedHTML += `<th class='table-header' colspan='6' style="height:25px;">Direct exposures</th>`;
    generatedHTML += `<th class='table-header' colspan='6' style="height:25px;">Indirect exposures</th>`;
    generatedHTML += `<th class='table-header' rowspan='3'>Additional exposures arising from transactions where there is an exposure to underlying assets</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' rowspan='2'><i>Of which: defaulted</i></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>Off balance sheet items</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>Off balance sheet items</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><b>Total</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><i>Of which: Non-trading book</i></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>% of Tier 1 capital </th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>(-) Off balance sheet items</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><b>Total</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><i>Of which: Non-trading book</i></th>`;
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



    const header=['010','020','030','040','050','060','070','080','090','100','110','120','130','140','150','160','170','180','190','200','210','220','230','240','250','260','270','280','290','300','310','320','330','340','350',];
    // First row is the header
    generatedHTML += "<tr class='table-header'>";
    for (let i=0;i<header.length;i++) {
      generatedHTML += `<th class='table-header'>${header[i]}</th>`;
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
    generatedHTML += "</table>";

    this._container.innerHTML = generatedHTML;

    done();
  }
});
