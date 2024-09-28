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

    var data = {"OkPercent": 99.66666666666667, "KoPercent": 0.3333333333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8427857142857142, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5075, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.9975, 500, 1500, "add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.99, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.98, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.74875, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.995, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.87, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.5075, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.945, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.9975, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.87, 500, 1500, "Add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "continue"], "isController": true}, {"data": [0.5, 500, 1500, "cat"], "isController": true}, {"data": [0.9975, 500, 1500, "Fish"], "isController": true}, {"data": [1.0, 500, 1500, "EST-14"], "isController": true}, {"data": [0.74875, 500, 1500, "checkout"], "isController": true}, {"data": [0.505, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.9625, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.945, 500, 1500, "Login"], "isController": true}, {"data": [0.9975, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.6975, 500, 1500, "confirm"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.3175, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.3175, 500, 1500, "Sign in"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.9525, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4200, 14, 0.3333333333333333, 332.52285714285745, 160, 5372, 175.0, 549.0, 805.7999999999993, 2914.5999999999913, 13.098393887416185, 59.46672347672696, 10.012011733977857], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 200, 0, 0.0, 532.4349999999996, 500, 634, 524.5, 570.8, 581.8499999999999, 614.8300000000002, 26.22263012980202, 109.88408778025436, 17.259817097154844], "isController": false}, {"data": ["add to cart", 200, 0, 0.0, 179.64499999999995, 163, 1292, 172.0, 182.0, 186.0, 219.92000000000007, 23.454907939486336, 121.06007938020407, 15.460998885891874], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 200, 0, 0.0, 172.775, 164, 203, 171.0, 179.0, 183.95, 197.98000000000002, 23.46591575736243, 111.74427834975948, 15.445339082482695], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 200, 0, 0.0, 189.89000000000004, 162, 637, 173.0, 204.9, 222.64999999999992, 635.8300000000002, 27.847396268448897, 6.010033764967975, 25.726207880813142], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 200, 0, 0.0, 217.11999999999998, 161, 1460, 171.0, 220.9, 439.24999999999983, 1198.4500000000005, 27.78935667639294, 140.92786056690287, 18.752388147839376], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 400, 0, 0.0, 363.39250000000004, 162, 1731, 431.5, 549.0, 563.95, 801.2200000000007, 2.8452942389904896, 15.632446668516108, 1.8172094065427542], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 200, 0, 0.0, 189.65499999999997, 162, 1080, 170.5, 185.8, 309.0499999999998, 998.1300000000053, 23.51834430856068, 101.03241856773283, 15.433913452492945], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 200, 0, 0.0, 447.88500000000005, 163, 1471, 176.0, 1336.9, 1366.85, 1458.95, 23.476933912431036, 111.3090958445827, 15.452591266580585], "isController": false}, {"data": ["F1-SW-01", 200, 0, 0.0, 532.4349999999996, 500, 634, 524.5, 570.8, 581.8499999999999, 614.8300000000002, 26.219192448872572, 109.86968242003147, 17.25755440482433], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 200, 0, 0.0, 173.50000000000006, 163, 206, 172.0, 181.9, 190.95, 201.98000000000002, 23.43841556310793, 98.21703240360952, 15.450127446384625], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 200, 0, 0.0, 408.015, 327, 1630, 348.5, 513.5, 805.1499999999999, 1380.8000000000002, 27.070925825663238, 143.12694572279372, 43.27647028965891], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 200, 0, 0.0, 179.64499999999995, 163, 1292, 172.0, 182.0, 186.0, 219.92000000000007, 23.449407902450464, 121.03169150838316, 15.457373373197328], "isController": false}, {"data": ["Add to cart", 200, 0, 0.0, 447.8850000000001, 163, 1471, 176.0, 1336.9, 1366.85, 1458.95, 23.476933912431036, 111.3090958445827, 15.452591266580585], "isController": true}, {"data": ["continue", 400, 0, 0.0, 173.4474999999999, 162, 277, 171.0, 180.0, 184.0, 210.96000000000004, 2.8527821758169654, 13.319483967364173, 3.557619959490493], "isController": true}, {"data": ["cat", 200, 0, 0.0, 702.5750000000006, 658, 762, 699.0, 731.0, 738.0, 761.99, 22.058012573067167, 175.34396713356125, 29.015764585860815], "isController": true}, {"data": ["Fish", 200, 0, 0.0, 179.36499999999995, 163, 825, 171.0, 180.9, 190.74999999999994, 437.6800000000003, 27.689325764917623, 111.27106984632424, 18.17112003322719], "isController": true}, {"data": ["EST-14", 200, 0, 0.0, 171.50999999999993, 160, 209, 171.0, 178.0, 179.95, 184.99, 23.44116268166901, 91.38390764181904, 15.245912447257384], "isController": true}, {"data": ["checkout", 400, 0, 0.0, 363.3925000000001, 162, 1731, 431.5, 549.0, 563.95, 801.2200000000007, 1.8084081938975265, 9.935648924675277, 1.1549794519618968], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 200, 0, 0.0, 529.075, 495, 589, 526.0, 551.9, 555.9, 581.95, 22.57081593499605, 84.83893606816386, 14.812097957341157], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 200, 0, 0.0, 239.97999999999993, 161, 1412, 170.0, 225.70000000000002, 972.0, 1340.8000000000002, 23.618327822390174, 119.77536756022674, 14.807584435521965], "isController": false}, {"data": ["Login", 200, 0, 0.0, 408.015, 327, 1630, 348.5, 513.5, 805.1499999999999, 1380.8000000000002, 27.067262146433887, 143.10757544999322, 43.27061341182839], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 200, 0, 0.0, 179.36499999999995, 163, 825, 171.0, 180.9, 190.74999999999994, 437.6800000000003, 27.689325764917623, 111.27106984632424, 18.17112003322719], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 200, 0, 0.0, 173.0900000000001, 163, 326, 171.0, 179.0, 185.0, 199.0, 23.49348055914484, 98.58543551039587, 15.46348232115588], "isController": false}, {"data": ["confirm", 400, 14, 3.5, 597.4075000000005, 165, 2257, 827.5, 959.0, 1530.4999999999995, 2157.1800000000026, 2.8615783035133027, 42.844010057106374, 5.577842083801321], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 200, 0, 0.0, 171.5099999999999, 160, 209, 171.0, 178.0, 179.95, 184.99, 23.449407902450464, 91.41605111970922, 15.251275061554695], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 200, 0, 0.0, 1686.049999999999, 672, 5372, 946.5, 3962.2000000000003, 4486.0, 5279.110000000001, 17.35357917570499, 78.71695363340564, 10.185059652928416], "isController": false}, {"data": ["Sign in", 200, 0, 0.0, 1686.0549999999996, 672, 5372, 946.5, 3962.2000000000003, 4486.0, 5279.110000000001, 17.158544955387786, 77.8322658394818, 10.070591326355524], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 400, 0, 0.0, 173.44749999999988, 162, 277, 171.0, 180.0, 184.0, 210.96000000000004, 2.861475949294646, 13.360074720290726, 3.568461706298108], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 400, 14, 3.5, 209.65500000000017, 165, 1253, 174.0, 202.30000000000024, 336.0, 1050.7200000000003, 2.8102320549119346, 16.325849645120385, 1.8250042153480825], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 14, 100.0, 0.3333333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4200, 14, "500", 14, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 400, 14, "500", 14, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
