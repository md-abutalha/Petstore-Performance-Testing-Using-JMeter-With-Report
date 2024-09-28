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

    var data = {"OkPercent": 99.25714285714285, "KoPercent": 0.7428571428571429};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8261142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.536, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.998, 500, 1500, "add to cart"], "isController": true}, {"data": [0.982, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.999, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.993, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.772, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.898, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.994, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.536, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.998, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.969, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.998, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.994, 500, 1500, "Add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "continue"], "isController": true}, {"data": [0.493, 500, 1500, "cat"], "isController": true}, {"data": [0.999, 500, 1500, "Fish"], "isController": true}, {"data": [0.998, 500, 1500, "EST-14"], "isController": true}, {"data": [0.772, 500, 1500, "checkout"], "isController": true}, {"data": [0.512, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.749, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.969, 500, 1500, "Login"], "isController": true}, {"data": [0.999, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.951, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.548, 500, 1500, "confirm"], "isController": true}, {"data": [0.998, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.305, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.305, 500, 1500, "Sign in"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.7785, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10500, 78, 0.7428571428571429, 386.87352380952285, 159, 8699, 180.0, 635.8999999999996, 1162.8999999999978, 3160.7899999999954, 32.49687411020464, 148.8999850427334, 24.839616803824107], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 500, 0, 0.0, 537.736, 488, 1718, 518.0, 557.9000000000001, 590.9, 1520.780000000002, 71.61271841879118, 300.0880612646806, 47.13571505299341], "isController": false}, {"data": ["add to cart", 500, 0, 0.0, 179.82800000000017, 162, 1302, 173.0, 186.0, 192.0, 321.85000000000014, 44.08782294330306, 228.51614165417513, 29.061797350321843], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 500, 0, 0.0, 263.5899999999999, 163, 913, 227.5, 378.80000000000007, 443.9, 666.6500000000003, 43.713936002797695, 209.11824892900856, 28.772649283091447], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 500, 0, 0.0, 172.05400000000006, 159, 621, 168.0, 176.0, 181.0, 332.4500000000005, 75.24454477050415, 16.239301166290446, 69.5130267118134], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 500, 0, 0.0, 193.32800000000003, 159, 1279, 168.0, 183.80000000000007, 333.95, 1041.6800000000048, 75.33524182612626, 382.0467878936267, 50.836574318216066], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1000, 0, 0.0, 351.8319999999997, 161, 635, 408.0, 548.0, 565.0, 592.0, 6.966941860870171, 38.2773583098199, 4.449589821297941], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 500, 0, 0.0, 365.33600000000024, 165, 1304, 353.5, 568.5000000000002, 634.95, 803.6500000000003, 46.29200999907416, 198.86577342375705, 30.379131561892418], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 500, 0, 0.0, 186.51600000000002, 163, 1305, 172.0, 183.0, 197.84999999999997, 998.8400000000001, 75.43753771876887, 357.6652789302957, 49.653223068799036], "isController": false}, {"data": ["F1-SW-01", 500, 0, 0.0, 537.7360000000001, 488, 1718, 518.0, 557.9000000000001, 590.9, 1520.780000000002, 71.6024631247315, 300.04508717599884, 47.12896498639554], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 500, 0, 0.0, 178.97599999999983, 161, 1268, 172.0, 181.0, 187.95, 329.0, 43.65287235900122, 182.92429227780687, 28.775086760083813], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 500, 0, 0.0, 365.60599999999977, 320, 1449, 337.0, 445.7000000000001, 507.95, 1216.710000000004, 73.35680751173709, 387.8454647153756, 117.27059950850939], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 500, 0, 0.0, 179.82800000000017, 162, 1302, 173.0, 186.0, 192.0, 321.85000000000014, 44.08393581378946, 228.49599387233292, 29.05923503350379], "isController": false}, {"data": ["Add to cart", 500, 0, 0.0, 186.516, 163, 1305, 172.0, 183.0, 197.84999999999997, 998.8400000000001, 75.43753771876887, 357.6652789302957, 49.653223068799036], "isController": true}, {"data": ["continue", 1000, 0, 0.0, 172.475, 160, 213, 171.0, 180.0, 186.0, 204.0, 6.982703842581924, 32.601862374398614, 8.707922663063592], "isController": true}, {"data": ["cat", 500, 0, 0.0, 749.2879999999997, 654, 1886, 708.0, 813.2000000000006, 1011.6999999999999, 1824.7900000000002, 41.73971116119876, 331.7980945821855, 54.905655209115956], "isController": true}, {"data": ["Fish", 500, 0, 0.0, 176.08599999999984, 160, 839, 170.0, 178.0, 182.0, 409.6900000000003, 75.25586995785672, 302.4198289810355, 49.38666465984347], "isController": true}, {"data": ["EST-14", 500, 0, 0.0, 177.818, 161, 873, 171.0, 182.0, 206.84999999999997, 262.0, 43.62621062734491, 170.0740554925399, 28.374078396300497], "isController": true}, {"data": ["checkout", 1000, 0, 0.0, 351.8319999999996, 161, 635, 408.0, 548.0, 565.0, 592.0, 4.461636617544047, 24.51285899443634, 2.8495218240955147], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 500, 0, 0.0, 570.3119999999999, 491, 1549, 535.0, 610.0, 831.95, 1494.1100000000017, 42.41601628775025, 159.43285809721752, 27.835510688836102], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 500, 0, 0.0, 665.5360000000007, 159, 8368, 335.5, 1524.4, 1729.5, 2885.3500000000013, 47.50593824228029, 240.91634501187647, 29.78399643705463], "isController": false}, {"data": ["Login", 500, 0, 0.0, 365.6059999999998, 320, 1449, 337.0, 445.7000000000001, 507.95, 1216.710000000004, 73.31378299120234, 387.61798936950146, 117.20181909824046], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 500, 0, 0.0, 176.0859999999999, 160, 839, 170.0, 178.0, 182.0, 409.6900000000003, 75.25586995785672, 302.4198289810355, 49.38666465984347], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 500, 0, 0.0, 271.90000000000026, 164, 1574, 196.5, 497.0, 563.2499999999998, 846.9100000000001, 45.32269760696157, 190.18714025108775, 29.831541198332125], "isController": false}, {"data": ["confirm", 1000, 78, 7.8, 1328.6380000000004, 162, 11005, 740.0, 3451.1, 4273.95, 6196.84, 6.99765578531192, 107.7780925811728, 13.63996186277597], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 500, 0, 0.0, 177.818, 161, 873, 171.0, 182.0, 206.84999999999997, 262.0, 43.62621062734491, 170.0740554925399, 28.374078396300497], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 500, 0, 0.0, 1680.1939999999995, 651, 6214, 764.5, 3995.8, 4599.7, 5642.760000000002, 47.67807761991037, 216.27018123629256, 27.982934228091924], "isController": false}, {"data": ["Sign in", 500, 0, 0.0, 1680.1939999999995, 651, 6214, 764.5, 3995.8, 4599.7, 5642.760000000002, 47.05439488048184, 213.44112465885564, 27.6168860577828], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 1000, 0, 0.0, 172.47499999999997, 160, 213, 171.0, 180.0, 186.0, 204.0, 6.9982924166503375, 32.67464457422389, 8.727362710998516], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1000, 78, 7.8, 545.4569999999995, 162, 8699, 196.0, 1420.6999999999998, 1775.7999999999997, 3159.5300000000016, 6.875120314605506, 42.82096848315939, 4.464799813684239], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 78, 100.0, 0.7428571428571429], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10500, 78, "500", 78, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1000, 78, "500", 78, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
