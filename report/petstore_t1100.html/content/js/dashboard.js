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

    var data = {"OkPercent": 99.79220779220779, "KoPercent": 0.2077922077922078};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6733246753246753, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6781818181818182, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.7109090909090909, 500, 1500, "add to cart"], "isController": true}, {"data": [0.685, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.9990909090909091, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.9995454545454545, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.7629545454545454, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.9290909090909091, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.9736363636363636, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.6781818181818182, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.5122727272727273, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.8895454545454545, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.7109090909090909, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.9736363636363636, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.8663636363636363, 500, 1500, "continue"], "isController": true}, {"data": [0.04909090909090909, 500, 1500, "cat"], "isController": true}, {"data": [0.9981818181818182, 500, 1500, "Fish"], "isController": true}, {"data": [0.36818181818181817, 500, 1500, "EST-14"], "isController": true}, {"data": [0.7629545454545454, 500, 1500, "checkout"], "isController": true}, {"data": [0.20227272727272727, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.6140909090909091, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.8895454545454545, 500, 1500, "Login"], "isController": true}, {"data": [0.9981818181818182, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.9386363636363636, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.3527272727272727, 500, 1500, "confirm"], "isController": true}, {"data": [0.36818181818181817, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.03363636363636364, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.03363636363636364, 500, 1500, "Sign in"], "isController": true}, {"data": [0.8663636363636363, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.555, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23100, 48, 0.2077922077922078, 1249.805974025978, 157, 26765, 362.0, 2739.9000000000015, 5326.500000000007, 11016.94000000017, 64.61375797532371, 292.48039909484794, 49.388780684542205], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 1100, 0, 0.0, 599.6281818181818, 476, 3288, 504.0, 610.0, 1512.95, 2146.090000000001, 61.76305446378439, 258.81373701572153, 40.652635457608085], "isController": false}, {"data": ["add to cart", 1100, 0, 0.0, 957.1372727272721, 160, 13406, 433.0, 2446.6999999999994, 3952.400000000005, 5647.79, 26.96078431372549, 138.86862362132354, 17.77200137867647], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 1100, 0, 0.0, 1059.5772727272733, 160, 26765, 347.0, 2516.5999999999995, 3723.8500000000004, 7567.34, 27.73085940454282, 131.7590030756044, 18.252538319005723], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 1100, 0, 0.0, 168.0881818181819, 157, 695, 166.0, 173.0, 177.0, 187.0, 63.51039260969978, 13.706832780023094, 58.67268692263279], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 1100, 0, 0.0, 270.8627272727272, 157, 1068, 323.0, 338.0, 346.0, 361.99, 62.954272305843304, 319.2593125822698, 42.4818380501345], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 2200, 0, 0.0, 582.8568181818167, 161, 3831, 493.0, 1067.8000000000002, 1737.9499999999998, 3269.6599999999926, 12.323894350614795, 67.70920860992074, 7.870924712209058], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 1100, 0, 0.0, 436.8336363636366, 161, 7336, 331.0, 635.3999999999992, 1322.95, 2490.700000000001, 31.892377721724507, 137.00641562291614, 20.929372879881708], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 1100, 0, 0.0, 219.20272727272715, 160, 1654, 170.0, 215.0, 469.05000000000086, 1253.8700000000001, 62.92186248712962, 298.3258226318499, 41.41536651984899], "isController": false}, {"data": ["F1-SW-01", 1100, 0, 0.0, 599.6281818181817, 476, 3288, 504.0, 610.0, 1512.95, 2146.090000000001, 61.766522544780734, 258.8282697652872, 40.65491815935763], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 1100, 0, 0.0, 2460.0072727272695, 161, 14471, 1014.5, 9799.2, 10534.95, 10544.0, 25.94890424854332, 108.73705872119082, 17.10499059352221], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 1100, 0, 0.0, 439.0209090909089, 316, 1237, 487.0, 511.0, 520.95, 536.99, 62.340606404080475, 329.60160456219893, 99.65973894871068], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 1100, 0, 0.0, 957.1372727272726, 160, 13406, 433.0, 2446.6999999999994, 3952.400000000005, 5647.79, 34.02517863218782, 175.25564798632806, 22.428706617897245], "isController": false}, {"data": ["Add to cart", 1100, 0, 0.0, 219.20272727272717, 160, 1654, 170.0, 215.0, 469.05000000000086, 1253.8700000000001, 62.91826345592862, 298.3087588657553, 41.412997626265515], "isController": true}, {"data": ["continue", 2200, 0, 0.0, 778.4349999999995, 160, 21142, 316.0, 1249.7000000000003, 1787.6499999999987, 15621.439999999944, 12.33446586156244, 57.58894656653323, 15.381946196499255], "isController": true}, {"data": ["cat", 1100, 0, 0.0, 6798.642727272726, 371, 22550, 6054.0, 12515.6, 13061.25, 18383.620000000006, 25.144006583158088, 199.87520858096372, 33.075172722181584], "isController": true}, {"data": ["Fish", 1100, 0, 0.0, 191.1818181818183, 159, 5446, 168.0, 320.0, 330.0, 353.94000000000005, 62.95787545787546, 252.9996655362866, 41.31610576923077], "isController": true}, {"data": ["EST-14", 1100, 0, 0.0, 2250.332727272727, 159, 8866, 1646.5, 4639.8, 5405.950000000002, 8830.94, 26.317048662615438, 102.59536939566486, 17.116361727833866], "isController": true}, {"data": ["checkout", 2200, 0, 0.0, 582.8568181818167, 161, 3831, 493.0, 1067.8000000000002, 1737.9499999999998, 3269.6599999999926, 8.49060244683725, 46.648563833892936, 5.422708984601134], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 1100, 0, 0.0, 4338.63545454545, 160, 16206, 2915.0, 9422.0, 10538.75, 12704.11, 24.852579019904656, 93.41560219493459, 16.30950498181243], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 1100, 0, 0.0, 1604.7554545454527, 159, 16248, 695.5, 3888.4999999999986, 7634.400000000001, 15287.84, 32.05595220748943, 162.5649998178639, 20.097579411336152], "isController": false}, {"data": ["Login", 1100, 0, 0.0, 439.02090909090884, 316, 1237, 487.0, 511.0, 520.95, 536.99, 62.33000906618314, 329.5455752776519, 99.64279769662285], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 1100, 0, 0.0, 191.18181818181833, 159, 5446, 168.0, 320.0, 330.0, 353.94000000000005, 62.95066956621266, 252.97070826656747, 41.31137690282706], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 1100, 0, 0.0, 462.33909090909145, 161, 14501, 328.0, 360.0, 1291.8500000000001, 4485.710000000002, 30.75288657776287, 129.04800158656937, 20.241646048254076], "isController": false}, {"data": ["confirm", 2200, 48, 2.1818181818181817, 3545.9931818181826, 162, 35517, 1783.0, 9962.8, 16704.449999999997, 20724.029999999977, 12.330456226880395, 182.94386139446252, 24.03475647348952], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 1100, 0, 0.0, 2250.332727272727, 159, 8866, 1646.5, 4639.8, 5405.950000000002, 8830.94, 27.074923697942307, 105.54989785369696, 17.60927654573201], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 1100, 0, 0.0, 4537.259090909089, 831, 19887, 3708.5, 8834.9, 11080.75, 13845.540000000003, 54.59057071960298, 247.6240694789082, 32.03997363523573], "isController": false}, {"data": ["Sign in", 1100, 0, 0.0, 4537.259999999999, 831, 19887, 3708.5, 8834.9, 11080.75, 13845.540000000003, 54.334403556433685, 246.4620894047913, 31.889625524820943], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 2200, 0, 0.0, 778.4349999999994, 160, 21142, 316.0, 1249.7000000000003, 1787.6499999999987, 15621.439999999944, 12.364135016354378, 57.727470227724886, 15.418945718637248], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 2200, 48, 2.1818181818181817, 1764.239999999999, 162, 17515, 573.5, 4459.200000000001, 8032.699999999999, 15504.749999999995, 12.156509534571455, 69.04087988954153, 7.894608242666033], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 48, 100.0, 0.2077922077922078], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23100, 48, "500", 48, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 2200, 48, "500", 48, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
