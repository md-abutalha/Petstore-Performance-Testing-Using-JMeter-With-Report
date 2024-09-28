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

    var data = {"OkPercent": 99.84013605442176, "KoPercent": 0.1598639455782313};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7361224489795918, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6589285714285714, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.7867857142857143, 500, 1500, "add to cart"], "isController": true}, {"data": [0.9421428571428572, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.9996428571428572, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.9982142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.5742857142857143, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.9682142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.9746428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.6589285714285714, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.9242857142857143, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.8407142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.7867857142857143, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.9746428571428571, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.7016071428571429, 500, 1500, "continue"], "isController": true}, {"data": [0.5660714285714286, 500, 1500, "cat"], "isController": true}, {"data": [1.0, 500, 1500, "Fish"], "isController": true}, {"data": [0.8664285714285714, 500, 1500, "EST-14"], "isController": true}, {"data": [0.5742857142857143, 500, 1500, "checkout"], "isController": true}, {"data": [0.8275, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.6475, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.8407142857142857, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.9732142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.52125, 500, 1500, "confirm"], "isController": true}, {"data": [0.8664285714285714, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.01607142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.01607142857142857, 500, 1500, "Sign in"], "isController": true}, {"data": [0.7016071428571429, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.7421428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29400, 47, 0.1598639455782313, 1151.108809523822, 157, 44641, 333.0, 1842.800000000003, 4253.950000000001, 15924.960000000006, 80.11990734432484, 362.3201469674002, 61.241207078621066], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 1400, 0, 0.0, 589.1507142857148, 475, 3280, 506.0, 643.9000000000001, 1227.95, 2149.86, 70.67851373182553, 296.1733422102181, 46.520818608642976], "isController": false}, {"data": ["add to cart", 1400, 0, 0.0, 803.5200000000002, 160, 14972, 209.0, 1738.9, 2816.55, 8006.79, 25.59414990859232, 131.85511168875684, 16.87114373857404], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 1400, 0, 0.0, 305.2385714285714, 160, 685, 329.0, 502.0, 513.0, 537.99, 25.589471760190094, 121.61021608252605, 16.84307027965637], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 1400, 0, 0.0, 169.76714285714257, 159, 999, 167.0, 177.0, 181.0, 210.0, 73.49467163630636, 15.861642999632528, 67.89644469525959], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 1400, 0, 0.0, 286.24142857142834, 157, 1122, 326.0, 344.0, 353.0, 380.98, 73.53713625380817, 372.9280747715096, 49.62320424939595], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 2800, 0, 0.0, 1749.394999999997, 160, 44641, 511.0, 3383.2000000000007, 6812.849999999999, 23680.809999999976, 14.898609640464624, 81.85505648169332, 9.515322953968617], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 1400, 0, 0.0, 363.53642857142836, 160, 4371, 331.0, 382.9000000000001, 509.8000000000002, 1732.6400000000003, 25.05682530023446, 107.64157665598769, 16.443541603278867], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 1400, 0, 0.0, 225.34857142857152, 160, 1735, 171.0, 224.0, 450.2500000000034, 1257.8200000000002, 71.85751680952625, 340.691644638916, 47.29684211877021], "isController": false}, {"data": ["F1-SW-01", 1400, 0, 0.0, 589.1507142857148, 475, 3280, 506.0, 643.9000000000001, 1227.95, 2149.86, 70.6713780918728, 296.1434408127209, 46.51612190812721], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 1400, 0, 0.0, 389.4599999999999, 160, 13063, 169.0, 499.0, 1566.4000000000005, 5508.410000000007, 25.601170339215507, 107.2799042241931, 16.875771463838348], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 1400, 0, 0.0, 456.1607142857138, 319, 1336, 492.0, 519.9000000000001, 530.95, 552.99, 72.84458088350071, 385.1372665071023, 116.45173721317445], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 1400, 0, 0.0, 803.5200000000002, 160, 14972, 209.0, 1738.9, 2816.55, 8006.79, 25.594617817510375, 131.8575222467504, 16.87145217462842], "isController": false}, {"data": ["Add to cart", 1400, 0, 0.0, 225.3485714285715, 160, 1735, 171.0, 224.0, 450.2500000000034, 1257.8200000000002, 71.86120521507031, 340.70913214762345, 47.29926983882559], "isController": true}, {"data": ["continue", 2800, 0, 0.0, 1801.5957142857196, 160, 32092, 334.0, 3699.6000000000067, 10942.949999999997, 20987.59999999999, 14.924736685002772, 69.68277938574047, 18.61219604174662], "isController": true}, {"data": ["cat", 1400, 0, 0.0, 808.7328571428568, 322, 13234, 666.0, 716.0, 1865.6500000000003, 6371.490000000002, 25.356347237063734, 201.56315088837772, 33.35449192219224], "isController": true}, {"data": ["Fish", 1400, 0, 0.0, 188.6607142857142, 159, 391, 169.0, 324.0, 330.95000000000005, 344.99, 73.4985300293994, 295.35786237400254, 48.233410331793365], "isController": true}, {"data": ["EST-14", 1400, 0, 0.0, 491.93071428571403, 160, 13078, 172.0, 988.8000000000002, 2254.95, 4852.56, 25.597893659036053, 99.79178856139838, 16.648630055583997], "isController": true}, {"data": ["checkout", 2800, 0, 0.0, 1749.3949999999973, 160, 44641, 511.0, 3383.2000000000007, 6812.849999999999, 23680.809999999976, 10.427062696438412, 57.287748759924334, 6.659471683076878], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 1400, 0, 0.0, 419.272857142857, 159, 7287, 494.0, 516.0, 524.0, 545.99, 25.43327398902736, 95.59831209352178, 16.690586055299203], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 1400, 0, 0.0, 1832.1935714285733, 157, 28970, 442.0, 4817.500000000004, 8224.550000000001, 15857.92, 25.0483074500823, 127.02720760573963, 15.70411463178988], "isController": false}, {"data": ["Login", 1400, 0, 0.0, 456.1607142857138, 319, 1336, 492.0, 519.9000000000001, 530.95, 552.99, 72.84079084287201, 385.1172281477628, 116.44567832986473], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 1400, 0, 0.0, 188.66071428571433, 159, 391, 169.0, 324.0, 330.95000000000005, 344.99, 73.4985300293994, 295.35786237400254, 48.233410331793365], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 1400, 0, 0.0, 318.48571428571415, 159, 555, 331.0, 485.9000000000001, 501.0, 523.99, 25.59368201678214, 107.39848791612584, 16.84584148370231], "isController": false}, {"data": ["confirm", 2800, 47, 1.6785714285714286, 2945.1996428571474, 161, 33463, 847.5, 9700.9, 15890.24999999997, 18756.379999999986, 14.956545892558584, 221.211742499359, 29.153579689010677], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 1400, 0, 0.0, 491.93071428571403, 160, 13078, 172.0, 988.8000000000002, 2254.95, 4852.56, 25.597893659036053, 99.79178856139838, 16.648630055583997], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 1400, 0, 0.0, 7161.391428571424, 855, 22381, 5567.5, 14621.800000000016, 18875.550000000003, 20177.56, 62.2139270319513, 282.2083791605564, 36.5142286584011], "isController": false}, {"data": ["Sign in", 1400, 0, 0.0, 7161.3914285714245, 855, 22381, 5567.5, 14621.800000000016, 18875.550000000003, 20177.56, 61.883923440746145, 280.71145101224414, 36.320544910047296], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 2800, 0, 0.0, 1801.5957142857192, 160, 32092, 334.0, 3699.6000000000067, 10942.949999999997, 20987.59999999999, 14.958703294120161, 69.84136762616063, 18.65455479159321], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 2800, 47, 1.6785714285714286, 1535.472500000002, 161, 30472, 336.0, 4162.300000000001, 8363.599999999999, 16164.909999999998, 14.755325091430318, 83.10761370657718, 9.582315611133946], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 47, 100.0, 0.1598639455782313], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29400, 47, "500", 47, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 2800, 47, "500", 47, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
