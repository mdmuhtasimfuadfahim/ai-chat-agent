# AI Chat Agent

AI Chat Agent is a powerful chatbot built with Node.js and Fastify. It's designed to provide automated responses to user queries.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

Before you start the installation, make sure you have Node.js installed on your machine. If not, you can download it from the official [Node.js website](https://nodejs.org/).

1. Clone the repository to your local machine:

```sh
git clone <repository-url>
```

2. Navigate to the project directory:

```sh
cd <project-directory>
```

3. Install the project dependencies:

```sh
npm install
```

4. Create a `.env` file in the root directory of the project and copy the contents of the .env.example file into it. Update the variables in the `.env` file with your actual values.

5. Start the server:
```sh
npm start
```

The server will start and listen on the port specified in your `.env` file (default is 4000). You can now interact with the AI Chat Agent by sending requests to `http://localhost:<your-port>`.

## Usage

The chatbot's behavior can be tested and customized using the provided Postman collection `(AI Chat Agent.postman_collection.json)`. This collection includes pre-configured requests for updating options and initiating conversations.

Please note that the actual behavior and responses of the chatbot will depend on the configuration and data provided in the requests.

## Contributing

Contributions are welcome. Please feel free to submit issues and pull requests.