/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9496428571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "POST To Create/Register User Account"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Verify Login without email parameter"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Search Product without search_product parameter"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE To Verify Login"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Verify Login with invalid details"], "isController": false}, {"data": [0.99, 500, 1500, "POST To Verify Login with valid details"], "isController": false}, {"data": [0.495, 500, 1500, "Get All Products List"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Search Product"], "isController": false}, {"data": [0.88, 500, 1500, "PUT METHOD To Update User Account"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Brands List"], "isController": false}, {"data": [1.0, 500, 1500, "GET user account detail by email"], "isController": false}, {"data": [0.935, 500, 1500, "POST To All Products List"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE METHOD To Delete User Account"], "isController": false}, {"data": [1.0, 500, 1500, "POST To All Brands List"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1400, 0, 0.0, 238.78499999999954, 62, 5225, 85.0, 286.0, 827.7500000000002, 3528.5400000000004, 20.160999985599286, 29.776908184645958, 15.93454504093403], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST To Create/Register User Account", 100, 0, 0.0, 116.30000000000001, 82, 834, 92.0, 183.90000000000006, 236.4999999999999, 828.259999999997, 2.5031915692507947, 2.0185893263911487, 8.064823665798894], "isController": false}, {"data": ["POST To Verify Login without email parameter", 100, 0, 0.0, 93.93999999999998, 67, 286, 77.0, 159.80000000000013, 246.64999999999947, 285.99, 2.5978074505117683, 2.278155361874578, 1.2194727181508807], "isController": false}, {"data": ["POST To Search Product without search_product parameter", 100, 0, 0.0, 77.66999999999997, 67, 114, 76.0, 87.9, 95.69999999999993, 113.88999999999994, 2.5356255388204274, 2.2198609209391957, 0.4803821821593387], "isController": false}, {"data": ["DELETE To Verify Login", 100, 0, 0.0, 75.31999999999996, 62, 145, 72.5, 87.0, 95.0, 144.65999999999983, 2.5166729583490626, 2.1308158739146847, 0.7401574493519567], "isController": false}, {"data": ["POST To Verify Login with invalid details", 100, 0, 0.0, 89.63000000000002, 69, 263, 81.0, 103.50000000000003, 159.0999999999998, 262.86999999999995, 2.4649970420035494, 2.0357409164859, 1.7042662165992901], "isController": false}, {"data": ["POST To Verify Login with valid details", 100, 0, 0.0, 144.18000000000004, 70, 541, 84.0, 331.40000000000003, 404.44999999999965, 540.7099999999998, 2.5028783100565652, 2.057199764103719, 1.735540793787856], "isController": false}, {"data": ["Get All Products List", 100, 0, 0.0, 1632.57, 110, 5225, 1253.5, 4065.3000000000015, 4647.3, 5222.379999999998, 2.49744012387303, 15.477299830174072, 0.4219308021777678], "isController": false}, {"data": ["POST To Search Product", 100, 0, 0.0, 114.24999999999999, 87, 293, 108.0, 133.9, 166.34999999999985, 292.53999999999974, 2.5710906566565535, 7.823497438550934, 1.19538139719494], "isController": false}, {"data": ["PUT METHOD To Update User Account", 100, 0, 0.0, 407.84000000000003, 143, 1660, 246.5, 1016.1000000000004, 1202.9999999999995, 1658.9299999999994, 2.4885526577742385, 2.002264194082222, 8.186584873643739], "isController": false}, {"data": ["Get All Brands List", 100, 0, 0.0, 83.75, 69, 299, 77.0, 93.9, 130.49999999999966, 298.10999999999956, 2.6856452262656103, 5.026300439774406, 0.44848177118302673], "isController": false}, {"data": ["GET user account detail by email", 100, 0, 0.0, 122.93000000000005, 66, 465, 79.0, 269.8000000000001, 324.09999999999957, 464.2299999999996, 2.5206059536712626, 3.0352624896025002, 0.6264591945403675], "isController": false}, {"data": ["POST To All Products List", 100, 0, 0.0, 206.95000000000005, 64, 1686, 77.0, 773.6000000000008, 929.6999999999995, 1682.8899999999985, 2.6456426265939994, 2.24027023585904, 0.49864162786390814], "isController": false}, {"data": ["DELETE METHOD To Delete User Account", 100, 0, 0.0, 101.59, 77, 354, 90.0, 125.60000000000002, 151.5999999999999, 353.1799999999996, 2.3703984639817954, 1.9206709116552494, 1.875948159385593], "isController": false}, {"data": ["POST To All Brands List", 100, 0, 0.0, 76.07000000000001, 67, 92, 75.0, 86.9, 88.0, 92.0, 2.6203390718759008, 2.21833197403244, 0.4887546511018526], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
