# Automated Scripting Tool

A powerful tool to automate any website with minimal effort! This script enables you to interact with websites manually and automatically generates a request-based automation script based on your actions.

## Features

### Core Functionalities
- **Ease of Use:** Open a Puppeteer page, interact with the website as you normally would, and let the script do the rest.
- **Request-Based Automation:** The script intercepts and analyzes all network requests to identify the sequence needed for automation.
- **JSON Mapping:** Automatically generates a JSON file containing:
  - The mapped requests.
  - Indexes indicating the start and end points of the sequence.
- **Happy Path Generation:** Send the JSON file along with a prompt to ChatGPT, and it will generate a complete automation script for you.

### Who Benefits?
- **Beginner Automators:** Those with limited knowledge of automation but want to streamline repetitive tasks.
- **Automation Experts:** Professionals looking to reduce the time spent on creating automation workflows.
- **Lazy Developers:** Developers who hate repetitive, mundane tasks.

### Planned Improvements
- **Direct ChatGPT Integration:** Automate the step of sending JSON to ChatGPT for script generation.
- **Enhanced Request Mapping:** Improve the accuracy of request identification and testing across diverse websites.
- **Connected Requests by Cookies:** Integrate flow detection using cookies.
- **Header-Based Mapping:** Add logic to map requests based on headers.
- **Configuration File Support:** Add a config file for custom settings.

---

## How to Use

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Taha-daboussi/AutomatedScripting.git
   cd AutomatedScripting
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage

1. Open the `Main.ts` file and configure the following:
   - **`valuesToScrape`:** Define an array of strings representing the data you want to scrape.
   - **`starting URL`:** Set the initial URL of the target website.

2. Run the script:
   ```bash
   npm start
   ```

3. Interact with the website:
   - The Puppeteer browser will open.
   - Perform the flow of actions you want to automate.

4. Finalize:
   - When you reach the final page that responds with the `valuesToScrape`, close the browser.

5. JSON Generation:
   - The script will analyze intercepted requests and generate a JSON file containing:
     - Mapped requests.
     - Start and end indexes of the request sequence.

6. Generate the Happy Path:
   - Use the JSON file with the following prompt (or a similar one) in ChatGPT:
     > "Using the following JSON file, create a request-based automation script to replicate the flow."

---

## How It Works

You can visualize the process with the following examples:

1. **Mapped Related Requests:**
   ![Mapped Related Requests](https://ibb.co/18kF1Ln)

2. **Request Response Data:**
   ![Request Response Data](https://ibb.co/6NsHQ29)

1. **Intercept Requests:** The script tracks all network requests made during your interaction.
2. **Map Values:** Matches the requests that respond with `valuesToScrape`.
3. **Request Linking:** Maps the flow of requests, considering cookies, headers, and other identifiers.
4. **JSON Output:** Generates a comprehensive JSON file to facilitate script generation.

---

## Example Prompt for ChatGPT

```plaintext
Using this JSON file, generate a request-based automation script. The automation should replicate the flow of requests while ensuring it starts from the index specified and ends at the appropriate endpoint.
```

---

## Contributing

Contributions are welcome! Here’s how you can help:
- Test the tool on different websites.
- Suggest improvements or report issues.
- Implement features such as cookie-based mapping, header-based mapping, or a configuration file.

---

## License

This project is licensed under the [MIT License](LICENSE).
