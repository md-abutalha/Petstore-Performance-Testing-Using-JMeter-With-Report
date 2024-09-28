# Petstore-Performance-Testing-Using-JMeter-With-Report

This repository contains the performance testing results for the [Petstore](https://petstore.octoperf.com/) website. The tests were conducted using Apache JMeter, focusing on evaluating API performance under various loads.

## Project Overview

The performance tests aimed to evaluate the following:
- Response Time
- Throughput
- Error Rate
- APDEX (Application Performance Index)
- Server's ability to handle concurrent requests

## JMeter Installation Guide

### Step 1: Download JMeter
You can download Apache JMeter from the official website: [JMeter Download](https://jmeter.apache.org/download_jmeter.cgi).

### Step 2: Installation
1. After downloading, extract the **.zip** file.
2. Navigate to the **bin** folder.
3. Run the **jmeter.bat** file (on Windows) or **jmeter.sh** file (on Unix/Linux) to start the JMeter GUI.

### Step 3: Verifying Installation
Open your terminal and run the following command to verify the JMeter installation:
```bash
jmeter -v
```
## Project Setup in JMeter
### Step 1: Creating a Test Plan
- Open JMeter.
- Create a Thread Group.
- Set the number of threads (users), ramp-up period, and loop count.
- Add HTTP Request Sampler to simulate API calls to the Petstore website.
- Configure the request with the correct API endpoint and parameters.

### Step 2: Running the Test
Once the test plan is configured, execute the performance test by clicking the start button in JMeter. You can also save the test plan for later execution using the command line.

## BlazeMeter for Cloud Testing

BlazeMeter is an extension that integrates with Apache JMeter, allowing you to execute performance tests in the cloud. It provides scalability, advanced reporting, and real-time monitoring of test results. Using BlazeMeter ensures that you can handle large-scale tests and gather comprehensive performance insights.

### Step 1: Setting Up BlazeMeter
1. **Install the BlazeMeter Extension**: 
   - Download the **BlazeMeter** extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/blazemeter-the-continuous/mbopgmdnpcbohhpnfglgohlbhfongabi).
   - Add the extension to your Chrome browser.
   - Once installed, the BlazeMeter icon will appear on your browser toolbar.

2. **Creating a BlazeMeter Account**: 
   - Go to [BlazeMeter](https://www.blazemeter.com/) and sign up for a free account.
   - This will allow you to access the dashboard where you can upload your JMeter scripts, execute tests, and view detailed reports.

3. **Uploading Your JMeter Test Plan**: 
   - After logging into BlazeMeter, upload your JMeter `.jmx` test plan to BlazeMeter.
   - BlazeMeter provides options to configure concurrent users, test duration, and geographical locations for load generation.

### Step 2: Running Tests via BlazeMeter
- **Execution**: Click **Run Test** in BlazeMeter, and it will execute the uploaded JMeter test plan in the cloud.
- **Real-Time Monitoring**: BlazeMeter offers real-time monitoring capabilities during the test execution. You can track response times, error rates, throughput, and concurrent users as the test progresses.
- **Scaling**: BlazeMeter supports running high-scale load tests, making it an ideal solution for handling large amounts of concurrent traffic.

### Step 3: Monitoring and Capturing Results
- **Detailed Reports**: BlazeMeter allows you to view and analyze results in a detailed, interactive report. Key metrics like TPS (Transactions Per Second), error rates, and APDEX score are available.
- **Test Reports**: Once the test is complete, you can download and share performance reports that show in-depth results, including response times, throughput, and error rates.

### Advantages of BlazeMeter:
- **Scalability**: BlazeMeter enables you to test the performance of your application with hundreds or even thousands of users by scaling in the cloud.
- **Seamless Integration**: It integrates seamlessly with JMeter, allowing you to upload and execute your existing JMeter test plans.
- **Real-Time Reporting**: Get instant feedback during the execution of your tests and analyze results in real time.
- **Geographical Testing**: Configure your tests to simulate users from different geographical locations for more accurate performance testing.

With BlazeMeter's extension and cloud capabilities, you can run larger tests that give deeper insights into the performance of your application, offering a professional and scalable approach to load testing.

## _Test Scenarios_
Server: https://petstore.octoperf.com/

1. 30 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~0.50
- Total API Requests: 630

2. 40 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~0.7
- Total API Requests: 840

3. 50 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~0.8
- Total API Requests: 1050

4. 70 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~1.2
- Total API Requests: 1470
- Errors: 6 connection timeouts, Error Rate: 0.41%

## Test Report Regeneration Command
You can regenerate the test reports using the following commands:
```bash
jmeter -n -t petstore_t50.jmx -l report\petstore_t50.jtl
jmeter -g report\petstore_t50.jtl -o report\petstore_t50.html
```

Repeat the same for other .jmx files like petstore_t110.jmx and petstore_t180.jmx to generate their respective reports.

## Results Summary
The performance tests indicate that the Petstore server can handle up to 55 concurrent API requests with almost zero errors. For 70 concurrent requests, a 0.41% error rate was observed due to connection timeouts.

## Key Takeaways
- Performance: The server handles up to 55 concurrent API calls with negligible errors.
- Optimization: Further improvements are needed for higher load scenarios (70+ requests).
- Scalability: The website scales up to moderate loads but requires optimization for peak traffic.
  
## _Screenchots_ 
![image](https://github.com/user-attachments/assets/be6089ad-ce8b-4907-a0d8-e3dd77f5dc69)
![image](https://github.com/user-attachments/assets/6634260c-5ed6-4c96-a791-9943e0eec67f)
![image](https://github.com/user-attachments/assets/7014806e-2f58-4fec-bbec-79b134199c57)
![image](https://github.com/user-attachments/assets/13c758e5-63f9-4232-8916-0316b89e0ad1)


## Authors

- [@abutalha](https://github.com/md-abutalha)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/md-abutalha)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abu-talha1/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/abu_talha0x)







