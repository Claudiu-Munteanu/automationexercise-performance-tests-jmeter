<h1 align="center">AutomationExercise API - Performance Tests (JMeter)</h1>

<p align="center">

This project contains automated performance tests for the [Automation Exercise API](https://automationexercise.com/api_list), built using **Apache JMeter**.

The primary goal is to simulate various user loads and measure the performance, scalability, and reliability of the API endpoints under stress.

## 🛠️ Technologies Used

| Tool           | Purpose                                                                    |
|----------------|----------------------------------------------------------------------------|
| Apache JMeter  | The core tool used for creating and running the performance test scenarios |
| GitHub         | For version control and repository management                              |

## 📂 Project Structure
The project follows a standardized structure to keep test assets, configuration, and results clearly separated.
```
/automationexercise-performance-tests-jmeter
├── .gitignore
├── README.md
├── src/
│   ├── test/
│   │   ├── jmeter/
│   │   │   └── Automation Exercise - Performance Tests - JMeter.jmx
│   │   └── resources/
│   │       └── config/
│   │           └── user.properties
└── target/
    ├── jmeter.log
    ├── reports/
    └── results/
        └── test-results.jtl
```

## 📋 Prerequisites
Before running the tests, please ensure you have the following installed:

- Java JDK: JMeter requires Java 8 or higher.

- Apache JMeter: The latest version is recommended.

- JMETER_HOME Environment Variable: The included test script relies on an environment variable that points to your JMeter installation directory.
    **macOS/Linux:**
    ```sh
    export JMETER_HOME="/path/to/your/apache-jmeter-x.y.z"
    ```
    **Windows:**
    ```sh
    export JMETER_HOME="/c/path/to/your/apache-jmeter-x.y.z"
    ```

## ▶️ How to Run the Tests
tbd

## 📊 Test Results and Reporting
tbd