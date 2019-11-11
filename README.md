# work-orders-api

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [env Setup](#env-setup)
  * [Installation](#installation)
* [Usage](#usage)
  * [API](#api)
  * [API Documentation](#api-documentation)
  * [Tests](#tests)
* [Contact](#contact)

<!-- ABOUT THE PROJECT -->
## About the Project

This backend application allows for the creation of workers and work-orders (tasks). Workers can be assigned to and multi-task many work-orders concurrently. A work-order has a max limit of five workers at a time.

## Getting Started

### Prerequisites

- npm

```sh
npm install npm@latest -g
```

- MongoDB

Install the [local server](https://docs.mongodb.com/manual/administration/install-on-linux/) or sign up for [cloud service](https://www.mongodb.com/download-center/cloud)

- [Postman](https://www.getpostman.com/downloads/)

<!-- ENV SETUP -->
### env Setup

Create a `config.env` file in the `config` folder with the following

```
DEV_MONGODB_URI=mongodb://localhost:27017/work-orders-api

TEST_MONGODB_URI=mongodb://localhost:27017/work-orders-api-test

PORT=5000
```

### Installation

1. Start up Mongo daemon (for Linux)
```bash
$ sudo service mongod start
```
2. Clone the project, `cd` to it, and run
```bash
$ npm install
```
3. Start the backend with
```bash
$ npm run dev
```
4. Use Postman to interface with the API at (http://localhost:5000)




<!-- USAGE -->
## Usage

### API

Deployed to [Heroku](https://work-orders-api.herokuapp.com/)

### API Documentation

Deployed to [Postman](https://documenter.getpostman.com/view/2952922/SW7T7BMs?version=latest#2f523243-8917-497c-b05a-cd0ade3feb73)

### Tests

Run the following command for API tests

```bash
$ npm run test
```

Run the following command for test coverage

```bash
$ npm run test -- --coverage
```

From the `project root` directory, navigate to `/coverage/lcov-report/index.html` for the HTML report

<!-- CONTACT -->
## Contact

Simon Mai - maismin@gmail.com

Project Link:
[https://github.com/maismin/work-orders-api](https://github.com/maismin/work-orders-apio)