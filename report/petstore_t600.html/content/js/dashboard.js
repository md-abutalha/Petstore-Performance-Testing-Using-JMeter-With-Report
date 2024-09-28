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

    var data = {"OkPercent": 99.47619047619048, "KoPercent": 0.5238095238095238};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8148333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5083333333333333, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.995, 500, 1500, "add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.7679166666666667, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.5083333333333333, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.9966666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.9316666666666666, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.995, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [1.0, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.9979166666666667, 500, 1500, "continue"], "isController": true}, {"data": [0.49833333333333335, 500, 1500, "cat"], "isController": true}, {"data": [0.9966666666666667, 500, 1500, "Fish"], "isController": true}, {"data": [0.995, 500, 1500, "EST-14"], "isController": true}, {"data": [0.7679166666666667, 500, 1500, "checkout"], "isController": true}, {"data": [0.5358333333333334, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.6608333333333334, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.9316666666666666, 500, 1500, "Login"], "isController": true}, {"data": [0.9966666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.5241666666666667, 500, 1500, "confirm"], "isController": true}, {"data": [0.995, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "Sign in"], "isController": true}, {"data": [0.9979166666666667, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.6979166666666666, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12600, 66, 0.5238095238095238, 451.5798412698428, 158, 8278, 176.0, 683.0, 1598.949999999999, 4455.98, 38.73097648169039, 176.5500219398686, 29.60477401551083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 600, 0, 0.0, 537.4033333333334, 494, 1550, 531.0, 570.0, 598.8999999999999, 646.99, 82.66740148801323, 346.41193338385233, 54.41194199503995], "isController": false}, {"data": ["add to cart", 600, 0, 0.0, 183.5716666666665, 161, 1288, 172.0, 183.89999999999998, 192.0, 995.3400000000061, 44.957290573954744, 232.1612339371347, 29.634932751386184], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 600, 0, 0.0, 223.0466666666665, 161, 445, 172.0, 338.0, 344.0, 359.98, 44.957290573954744, 214.2046598699985, 29.591029147310056], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 600, 0, 0.0, 171.84666666666672, 159, 251, 170.0, 180.89999999999998, 184.0, 195.0, 94.86166007905138, 20.473073122529645, 87.63586956521739], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 600, 0, 0.0, 200.57333333333335, 159, 372, 170.0, 336.0, 343.0, 353.0, 95.10223490252021, 482.2909236804565, 64.17543390394674], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1200, 0, 0.0, 349.6408333333336, 161, 1049, 488.0, 538.0, 553.0, 599.99, 8.25826342483948, 45.37206057436222, 5.274320585786152], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 600, 0, 0.0, 259.78833333333347, 159, 392, 325.0, 342.0, 346.0, 356.99, 46.53327128897161, 199.90220742205676, 30.537459283387623], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 600, 0, 0.0, 172.05666666666656, 162, 211, 171.0, 179.0, 183.0, 192.98000000000002, 86.68015024559377, 410.96887640855243, 57.05314576711933], "isController": false}, {"data": ["F1-SW-01", 600, 0, 0.0, 537.4049999999991, 494, 1550, 531.0, 570.0, 598.8999999999999, 646.99, 82.66740148801323, 346.41193338385233, 54.41194199503995], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 600, 0, 0.0, 178.34499999999997, 161, 1350, 170.0, 178.0, 183.0, 272.3500000000006, 44.96065942300487, 188.40448201573622, 29.63715342825028], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 600, 0, 0.0, 372.83666666666693, 321, 552, 344.0, 507.9, 515.9499999999999, 535.95, 92.32189567625788, 488.11596014771504, 147.58881174026774], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 600, 0, 0.0, 183.57166666666646, 161, 1288, 172.0, 183.89999999999998, 192.0, 995.3400000000061, 44.95392222971454, 232.14383967370946, 29.632712407282536], "isController": false}, {"data": ["Add to cart", 600, 0, 0.0, 172.0583333333333, 162, 211, 171.0, 179.0, 183.0, 192.98000000000002, 86.68015024559377, 410.96887640855243, 57.05314576711933], "isController": true}, {"data": ["continue", 1200, 0, 0.0, 175.34333333333313, 160, 1357, 170.0, 179.0, 183.95000000000005, 197.0, 8.28065914046758, 38.66194467829639, 10.326564182008887], "isController": true}, {"data": ["cat", 600, 0, 0.0, 700.5549999999993, 645, 1879, 690.0, 723.9, 738.9499999999999, 783.0, 43.28379743182801, 344.07237411628915, 56.93679212956283], "isController": true}, {"data": ["Fish", 600, 0, 0.0, 180.72833333333327, 160, 917, 170.0, 185.0, 209.79999999999973, 424.2100000000007, 87.13331397037467, 350.14998729305836, 57.18123729305838], "isController": true}, {"data": ["EST-14", 600, 0, 0.0, 186.84166666666664, 160, 1130, 170.0, 185.89999999999998, 273.6499999999995, 628.9100000000019, 44.9707690001499, 175.31573227402188, 29.24856655673812], "isController": true}, {"data": ["checkout", 1200, 0, 0.0, 349.64083333333355, 161, 1049, 488.0, 538.0, 553.0, 599.99, 5.311849851710859, 29.184050064184852, 3.392529104510646], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 600, 0, 0.0, 522.2099999999999, 484, 611, 519.0, 545.9, 554.0, 599.0, 43.805212820325615, 164.65455482952473, 28.74717091333869], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 600, 0, 0.0, 1000.2799999999999, 158, 7874, 454.5, 2429.9, 3911.9499999999944, 4792.97, 47.19578384331, 239.34346240069223, 29.589544167387714], "isController": false}, {"data": ["Login", 600, 0, 0.0, 372.836666666667, 321, 552, 344.0, 507.9, 515.9499999999999, 535.95, 92.23674096848578, 487.66573789392777, 147.4526806302844], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 600, 0, 0.0, 180.72833333333327, 160, 917, 170.0, 185.0, 209.79999999999973, 424.2100000000007, 87.14596949891067, 350.20084422657953, 57.189542483660134], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 600, 0, 0.0, 237.12333333333322, 159, 362, 177.0, 337.9, 342.94999999999993, 353.0, 45.875066901139235, 192.50504147870632, 30.195112393913906], "isController": false}, {"data": ["confirm", 1200, 66, 5.5, 1755.9066666666702, 162, 11232, 825.5, 5095.8, 6065.85, 9246.45, 8.302142644647539, 125.89092638507414, 16.18269210812157], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 600, 0, 0.0, 186.84166666666667, 160, 1130, 170.0, 185.89999999999998, 273.6499999999995, 628.9100000000019, 44.96739863598891, 175.30259311998802, 29.246374503484972], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 600, 0, 0.0, 2214.983333333333, 661, 6807, 1801.5, 4665.9, 5376.349999999997, 6404.010000000001, 56.19556055071649, 254.90869684836565, 32.98196473728576], "isController": false}, {"data": ["Sign in", 600, 0, 0.0, 2214.983333333334, 661, 6807, 1801.5, 4665.9, 5376.349999999997, 6404.010000000001, 55.233360950013804, 250.5440629890454, 32.417236260701465], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 1200, 0, 0.0, 175.34333333333305, 160, 1357, 170.0, 179.0, 183.95000000000005, 197.0, 8.305073015433594, 38.77593172537892, 10.357010000692089], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1200, 66, 5.5, 895.786666666666, 162, 8278, 188.0, 2465.9, 4225.400000000001, 7808.95, 8.158048594776128, 48.94515794321998, 5.297951480005983], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 66, 100.0, 0.5238095238095238], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12600, 66, "500", 66, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1200, 66, "500", 66, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
