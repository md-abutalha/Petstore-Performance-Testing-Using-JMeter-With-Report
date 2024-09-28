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

    var data = {"OkPercent": 99.59183673469387, "KoPercent": 0.40816326530612246};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6487755102040816, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09285714285714286, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [1.0, 500, 1500, "add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.3142857142857143, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.9071428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.09285714285714286, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.11428571428571428, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.9071428571428571, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.9071428571428571, 500, 1500, "continue"], "isController": true}, {"data": [0.5, 500, 1500, "cat"], "isController": true}, {"data": [0.10714285714285714, 500, 1500, "Fish"], "isController": true}, {"data": [1.0, 500, 1500, "EST-14"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "checkout"], "isController": true}, {"data": [0.6, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.95, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.11428571428571428, 500, 1500, "Login"], "isController": true}, {"data": [0.10714285714285714, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.5285714285714286, 500, 1500, "confirm"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.25, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.25, 500, 1500, "Sign in"], "isController": true}, {"data": [0.9071428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.7321428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1470, 6, 0.40816326530612246, 957.1421768707495, 163, 7367, 264.5, 3222.6000000000004, 3715.3000000000006, 5873.859999999999, 4.4376822619500444, 20.172052993133665, 3.392028615126157], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 70, 0, 0.0, 3822.6, 1056, 7367, 3820.5, 6732.999999999999, 7132.700000000001, 7367.0, 8.46740050804403, 35.48204646486029, 5.573269475021169], "isController": false}, {"data": ["add to cart", 70, 0, 0.0, 174.08571428571437, 165, 203, 174.0, 180.0, 182.45, 203.0, 7.685551163812033, 39.5897022192029, 5.066159214426877], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 70, 0, 0.0, 173.42857142857142, 166, 188, 171.5, 181.9, 184.9, 188.0, 7.75709219858156, 36.8523563899047, 5.105742326019504], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 70, 0, 0.0, 1704.4000000000005, 200, 3883, 1891.5, 3485.3, 3575.35, 3883.0, 7.737371504366088, 1.669881936000884, 7.148001409306952], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 70, 0, 0.0, 1440.557142857143, 176, 3421, 1900.0, 2570.7999999999997, 2787.750000000001, 3421.0, 11.473528929683658, 58.18558176938207, 7.742391103917391], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 140, 0, 0.0, 564.4428571428575, 164, 1895, 513.0, 1283.2000000000003, 1379.0, 1773.230000000001, 0.98015192354815, 5.385092501837785, 0.6259954667973535], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 70, 0, 0.0, 173.81428571428575, 164, 222, 171.0, 180.9, 196.80000000000007, 222.0, 7.776913676258194, 33.40883131040996, 5.10359960004444], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 70, 0, 0.0, 377.6857142857144, 167, 2263, 328.5, 574.0, 1092.3500000000026, 2263.0, 7.777777777777778, 36.88368055555556, 5.119357638888889], "isController": false}, {"data": ["F1-SW-01", 70, 0, 0.0, 3822.6, 1056, 7367, 3820.5, 6732.999999999999, 7132.700000000001, 7367.0, 8.46740050804403, 35.48204646486029, 5.573269475021169], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 70, 0, 0.0, 172.84285714285716, 165, 188, 172.5, 180.0, 180.45, 188.0, 7.7075534023342875, 32.297960595133226, 5.080662643140277], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 70, 0, 0.0, 3146.0000000000005, 426, 6377, 3165.0, 5857.1, 5899.8, 6377.0, 7.007007007007007, 37.04681243743744, 11.20163131881882], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 70, 0, 0.0, 174.08571428571437, 165, 203, 174.0, 180.0, 182.45, 203.0, 7.685551163812033, 39.5897022192029, 5.066159214426877], "isController": false}, {"data": ["Add to cart", 70, 0, 0.0, 377.6857142857144, 167, 2263, 328.5, 574.0, 1092.3500000000026, 2263.0, 7.77864207134126, 36.88777919768863, 5.11992651961329], "isController": true}, {"data": ["continue", 140, 0, 0.0, 356.2857142857141, 167, 987, 219.0, 884.0, 972.1499999999999, 986.59, 0.9862697165883522, 4.60483937012589, 1.2299476836751226], "isController": true}, {"data": ["cat", 70, 0, 0.0, 686.4000000000001, 656, 746, 687.5, 708.9, 720.25, 746.0, 7.301554187962867, 58.04165145509544, 9.60468114373631], "isController": true}, {"data": ["Fish", 70, 0, 0.0, 3041.8428571428567, 430, 3726, 3531.0, 3681.9, 3706.35, 3726.0, 12.437810945273633, 49.982023476368155, 8.162313432835822], "isController": true}, {"data": ["EST-14", 70, 0, 0.0, 174.1428571428571, 165, 204, 173.0, 182.8, 190.25, 204.0, 7.693153093746566, 30.01381504835696, 5.003554648862512], "isController": true}, {"data": ["checkout", 140, 0, 0.0, 564.4428571428573, 164, 1895, 513.0, 1283.2000000000003, 1379.0, 1773.230000000001, 0.6265916546942905, 3.4425826653418725, 0.400186466962955], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 70, 0, 0.0, 513.5571428571426, 491, 558, 514.0, 532.0, 539.8, 558.0, 7.44126714149038, 27.97015354257468, 4.883331561603062], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 70, 0, 0.0, 257.04285714285714, 165, 678, 179.5, 578.2999999999998, 645.6500000000002, 678.0, 7.75451423507256, 39.32538322532403, 4.861716932535726], "isController": false}, {"data": ["Login", 70, 0, 0.0, 3146.0, 426, 6377, 3165.0, 5857.1, 5899.8, 6377.0, 7.00560448358687, 37.039397142714165, 11.199389198859086], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 70, 0, 0.0, 3041.8428571428567, 430, 3726, 3531.0, 3681.9, 3706.35, 3726.0, 12.433392539964476, 49.96426787300178, 8.159413854351687], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 70, 0, 0.0, 172.9999999999999, 163, 190, 171.0, 181.0, 183.9, 190.0, 7.752796544467826, 32.53297534333813, 5.1029149130579246], "isController": false}, {"data": ["confirm", 140, 6, 4.285714285714286, 996.3857142857139, 178, 2437, 913.0, 1881.6000000000001, 2157.1499999999996, 2436.18, 0.993852313546207, 14.941948376471254, 1.9372355642951455], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 70, 0, 0.0, 174.1428571428571, 165, 204, 173.0, 182.8, 190.25, 204.0, 7.693153093746566, 30.01381504835696, 5.003554648862512], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 70, 0, 0.0, 1698.0428571428572, 674, 4616, 1412.0, 3206.7, 3606.9500000000007, 4616.0, 6.692800458934888, 30.359245028205375, 3.92809870685534], "isController": false}, {"data": ["Sign in", 70, 0, 0.0, 1698.0428571428572, 674, 4616, 1412.0, 3206.7, 3606.9500000000007, 4616.0, 6.613131790269249, 29.997859589041095, 3.8813400448748228], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 140, 0, 0.0, 356.2857142857141, 167, 987, 219.0, 884.0, 972.1499999999999, 986.59, 0.9892454883339693, 4.6187330856686595, 1.2336586802758582], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 140, 6, 4.285714285714286, 607.7428571428571, 169, 2437, 246.0, 1881.6000000000001, 2157.1499999999996, 2436.18, 0.9761471472099622, 5.737050198802826, 0.6339236844674072], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 6, 100.0, 0.40816326530612246], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1470, 6, "500", 6, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 140, 6, "500", 6, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
