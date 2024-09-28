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

    var data = {"OkPercent": 99.9047619047619, "KoPercent": 0.09523809523809523};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8634285714285714, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [1.0, 500, 1500, "add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.74, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.5, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.99, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [1.0, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.995, 500, 1500, "continue"], "isController": true}, {"data": [0.49, 500, 1500, "cat"], "isController": true}, {"data": [1.0, 500, 1500, "Fish"], "isController": true}, {"data": [1.0, 500, 1500, "EST-14"], "isController": true}, {"data": [0.74, 500, 1500, "checkout"], "isController": true}, {"data": [0.49, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.99, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.74, 500, 1500, "confirm"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.43, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.43, 500, 1500, "Sign in"], "isController": true}, {"data": [0.995, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.99, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1050, 1, 0.09523809523809523, 286.83523809523814, 159, 2467, 181.0, 542.0, 693.8999999999999, 1483.7200000000012, 3.288206612113753, 14.845460772673752, 2.513404579767195], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 50, 0, 0.0, 546.04, 516, 594, 541.0, 573.9, 587.35, 594.0, 5.919962112242482, 24.807184984016104, 3.8965375621596023], "isController": false}, {"data": ["add to cart", 50, 0, 0.0, 180.18, 167, 229, 174.0, 206.39999999999998, 211.24999999999997, 229.0, 5.364806866952789, 27.59417750804721, 3.536371714055794], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 50, 0, 0.0, 179.00000000000003, 165, 214, 174.0, 196.9, 203.7, 214.0, 5.3984020729863955, 25.610778584538973, 3.5532451144461237], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 50, 0, 0.0, 179.86000000000004, 165, 216, 174.0, 206.9, 212.35, 216.0, 6.208095356344674, 1.3398330798361062, 5.735213092873106], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 50, 0, 0.0, 177.97999999999996, 165, 335, 173.0, 193.2, 206.29999999999995, 335.0, 6.239860227130912, 31.644134921377763, 4.210686930612754], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 100, 0, 0.0, 382.1200000000001, 165, 1972, 363.5, 553.8, 571.4499999999998, 1968.3199999999981, 0.7076589932843161, 3.8879780236499633, 0.4519618961015066], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 50, 0, 0.0, 184.49999999999997, 166, 241, 176.5, 211.6, 215.35, 241.0, 5.396654074473826, 23.183477806260118, 3.5415542363734485], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 50, 0, 0.0, 186.07999999999998, 167, 214, 179.0, 211.0, 211.45, 214.0, 6.159152500615916, 29.20184120165065, 4.053973423256959], "isController": false}, {"data": ["F1-SW-01", 50, 0, 0.0, 546.04, 516, 594, 541.0, 573.9, 587.35, 594.0, 5.919962112242482, 24.807184984016104, 3.8965375621596023], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 50, 0, 0.0, 184.50000000000003, 167, 343, 177.0, 197.9, 208.59999999999997, 343.0, 5.362505362505362, 22.47120167042042, 3.534854609073359], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 50, 0, 0.0, 359.20000000000005, 333, 515, 351.5, 387.9, 389.45, 515.0, 6.079027355623101, 32.140482522796354, 9.718132598784194], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 50, 0, 0.0, 180.18, 167, 229, 174.0, 206.39999999999998, 211.24999999999997, 229.0, 5.362505362505362, 27.582339594058343, 3.534854609073359], "isController": false}, {"data": ["Add to cart", 50, 0, 0.0, 186.07999999999998, 167, 214, 179.0, 211.0, 211.45, 214.0, 6.1568772318679965, 29.19105367257727, 4.052475834256865], "isController": true}, {"data": ["continue", 100, 0, 0.0, 185.66000000000005, 167, 509, 173.5, 202.0, 224.95, 507.69999999999936, 0.7093909169586993, 3.3121073964643957, 0.8846603524963466], "isController": true}, {"data": ["cat", 50, 0, 0.0, 766.1800000000001, 680, 1892, 716.0, 954.1999999999998, 1174.1499999999985, 1892.0, 5.084918132818062, 40.421126563612326, 6.688852270415946], "isController": true}, {"data": ["Fish", 50, 0, 0.0, 184.07999999999996, 169, 217, 178.5, 209.0, 210.89999999999998, 217.0, 6.214267959234402, 24.972375636962468, 4.078113348247577], "isController": true}, {"data": ["EST-14", 50, 0, 0.0, 179.42000000000002, 165, 225, 173.0, 199.0, 210.29999999999995, 225.0, 5.364806866952789, 20.914364270386265, 3.489220091201717], "isController": true}, {"data": ["checkout", 100, 0, 0.0, 382.13, 165, 1972, 363.5, 553.8, 571.4499999999998, 1968.3199999999981, 0.4506290781931577, 2.475819525307329, 0.2878041182991456], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 50, 0, 0.0, 581.68, 507, 1549, 528.0, 772.2999999999997, 996.4999999999985, 1549.0, 5.185646131507986, 19.491749961107654, 3.4030802738021158], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 50, 0, 0.0, 175.26000000000002, 159, 208, 171.0, 200.9, 204.0, 208.0, 5.4282922592552385, 27.528439162414504, 3.4032847953533816], "isController": false}, {"data": ["Login", 50, 0, 0.0, 359.2000000000001, 333, 515, 351.5, 387.9, 389.45, 515.0, 6.076072426783328, 32.12485949082513, 9.713408752582332], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 50, 0, 0.0, 184.05999999999995, 169, 217, 178.5, 209.0, 210.89999999999998, 217.0, 6.213495712687958, 24.969272321983347, 4.077606561451472], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 50, 0, 0.0, 184.75999999999996, 168, 207, 183.5, 204.9, 207.0, 207.0, 5.4024851431658565, 22.670389316585627, 3.5559326039978387], "isController": false}, {"data": ["confirm", 100, 1, 1.0, 549.5099999999999, 168, 983, 661.0, 928.8, 942.6999999999999, 982.8199999999999, 0.7114602009163608, 10.469921963932524, 1.3867915635049375], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 50, 0, 0.0, 179.40000000000003, 165, 225, 173.0, 199.0, 210.29999999999995, 225.0, 5.365382551775942, 20.91660854168902, 3.489594511213649], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 50, 0, 0.0, 1029.9799999999998, 675, 2467, 770.5, 1996.3999999999996, 2381.1, 2467.0, 4.825323296660876, 21.887364890947694, 2.8320500989191277], "isController": false}, {"data": ["Sign in", 50, 0, 0.0, 1029.9799999999998, 675, 2467, 770.5, 1996.3999999999996, 2381.1, 2467.0, 4.75827940616673, 21.583257993909402, 2.792701096783403], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 100, 0, 0.0, 185.66000000000005, 167, 509, 173.5, 202.0, 224.95, 507.69999999999936, 0.7115361353626344, 3.3221233038757374, 0.8873355906817227], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 100, 1, 1.0, 187.74999999999991, 165, 478, 179.0, 207.0, 213.0, 476.6799999999993, 0.6987631891551953, 3.8867269386311225, 0.4537866413947313], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 0.09523809523809523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1050, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 100, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
