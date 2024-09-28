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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8796428571428572, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [1.0, 500, 1500, "add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.7875, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.5, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [1.0, 500, 1500, "Add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "continue"], "isController": true}, {"data": [0.5, 500, 1500, "cat"], "isController": true}, {"data": [1.0, 500, 1500, "Fish"], "isController": true}, {"data": [1.0, 500, 1500, "EST-14"], "isController": true}, {"data": [0.7875, 500, 1500, "checkout"], "isController": true}, {"data": [0.6375, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.75, 500, 1500, "confirm"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.5, 500, 1500, "Sign in"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 840, 0, 0.0, 272.1297619047616, 163, 1336, 177.0, 549.9, 703.0, 821.0, 2.6367500172644345, 11.881652447704457, 2.015451080439709], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 40, 0, 0.0, 726.975, 563, 954, 721.0, 865.0999999999999, 928.65, 954.0, 3.9710116152089747, 16.64024496177901, 2.613732254541844], "isController": false}, {"data": ["add to cart", 40, 0, 0.0, 174.60000000000002, 167, 192, 172.5, 185.7, 189.0, 192.0, 4.164931278633903, 21.430686432736362, 2.7454380987088713], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 40, 0, 0.0, 173.84999999999997, 166, 190, 172.5, 182.9, 186.89999999999998, 190.0, 4.154980783213877, 19.715870728160382, 2.7348213358263216], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 40, 0, 0.0, 173.525, 167, 183, 173.5, 180.0, 182.89999999999998, 183.0, 4.355400696864112, 0.9399839394599304, 4.023641659407666], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 40, 0, 0.0, 173.59999999999997, 163, 193, 172.5, 181.9, 185.95, 193.0, 4.355400696864112, 22.08749591681185, 2.9390448061846692], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 80, 0, 0.0, 344.3750000000002, 164, 556, 344.0, 529.9, 534.0, 556.0, 0.5651034492501784, 3.1047578178530304, 0.3609156795015787], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 40, 0, 0.0, 177.09999999999994, 165, 274, 173.5, 187.6, 204.89999999999998, 274.0, 4.152392816360428, 17.838257811688987, 2.725007785736531], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 40, 0, 0.0, 210.82499999999996, 169, 372, 196.0, 262.0, 311.79999999999984, 372.0, 4.165364990107258, 19.752941789024263, 2.7416562532541913], "isController": false}, {"data": ["F1-SW-01", 40, 0, 0.0, 726.975, 563, 954, 721.0, 865.0999999999999, 928.65, 954.0, 3.9710116152089747, 16.64024496177901, 2.613732254541844], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 40, 0, 0.0, 173.07499999999996, 164, 188, 171.0, 186.0, 187.89999999999998, 188.0, 4.16276407534603, 17.44377016338849, 2.7440095223228225], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 40, 0, 0.0, 347.82500000000005, 332, 371, 347.0, 363.7, 369.0, 371.0, 4.273047751308621, 22.592070825766477, 6.831034344621301], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 40, 0, 0.0, 174.60000000000002, 167, 192, 172.5, 185.7, 189.0, 192.0, 4.165364990107258, 21.432918098510882, 2.745723992502343], "isController": false}, {"data": ["Add to cart", 40, 0, 0.0, 210.82499999999996, 169, 372, 196.0, 262.0, 311.79999999999984, 372.0, 4.16579879191835, 19.754998958550303, 2.741941782961883], "isController": true}, {"data": ["continue", 80, 0, 0.0, 174.15, 165, 208, 172.0, 180.9, 187.0, 208.0, 0.5665040328005836, 2.6449763484566304, 0.7064703612171338], "isController": true}, {"data": ["cat", 40, 0, 0.0, 684.95, 651, 757, 678.5, 720.3, 745.5999999999999, 757.0, 3.952178638474459, 31.41673253631064, 5.198813111352633], "isController": true}, {"data": ["Fish", 40, 0, 0.0, 206.49999999999997, 167, 313, 181.5, 261.4, 303.9, 313.0, 4.292306041420753, 17.248866562935937, 2.816825839682369], "isController": true}, {"data": ["EST-14", 40, 0, 0.0, 172.79999999999998, 164, 190, 171.0, 185.5, 188.89999999999998, 190.0, 4.164497657470068, 16.247234513274336, 2.7085502342529932], "isController": true}, {"data": ["checkout", 80, 0, 0.0, 344.3750000000002, 164, 556, 344.0, 529.9, 534.0, 556.0, 0.3600765162597052, 1.9783110160909192, 0.22997074378305388], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 40, 0, 0.0, 511.875, 487, 571, 506.0, 536.8, 557.5999999999999, 571.0, 4.018485031143259, 15.104637582881253, 2.6371308016877637], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 40, 0, 0.0, 180.65000000000003, 164, 358, 172.5, 198.1, 231.9499999999999, 358.0, 4.198152812762385, 21.29004644206549, 2.632045025188917], "isController": false}, {"data": ["Login", 40, 0, 0.0, 347.82500000000005, 332, 371, 347.0, 363.7, 369.0, 371.0, 4.272134999465983, 22.587245006942222, 6.829575189575991], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 40, 0, 0.0, 206.475, 167, 313, 181.5, 260.5, 303.9, 313.0, 4.2927666881305, 17.25071769693067, 2.8171281390856406], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 40, 0, 0.0, 174.425, 166, 193, 173.5, 184.8, 187.95, 193.0, 4.152392816360428, 17.424640558496836, 2.733117927955985], "isController": false}, {"data": ["confirm", 80, 0, 0.0, 534.7125, 169, 1050, 515.5, 929.3000000000001, 954.75, 1050.0, 0.5681495369581274, 8.308077310948242, 1.1074477302426], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 40, 0, 0.0, 172.79999999999998, 164, 190, 171.0, 185.5, 188.89999999999998, 190.0, 4.16406412658755, 16.24554315011451, 2.7082682698313554], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 40, 0, 0.0, 736.675, 666, 1336, 702.5, 749.7, 1151.799999999999, 1336.0, 3.8677238445175015, 17.54356477228776, 2.270021514213885], "isController": false}, {"data": ["Sign in", 40, 0, 0.0, 736.675, 666, 1336, 702.5, 749.7, 1151.799999999999, 1336.0, 3.834723420573291, 17.393878523152143, 2.2506531013325666], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 80, 0, 0.0, 174.15, 165, 208, 172.0, 180.9, 187.0, 208.0, 0.5682100672618667, 2.652941730057602, 0.7085979061459021], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 80, 0, 0.0, 181.6999999999999, 169, 282, 175.0, 191.8, 250.9500000000001, 282.0, 0.5580357142857143, 3.0517578124999996, 0.36239624023437494], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 840, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
