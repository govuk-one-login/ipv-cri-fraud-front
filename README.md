# Digital Identity Credential Issuer

# di-ipv-cri-fraud-front

Frontend for Fraud Credential Issuer

This is the home for the front end user interface for a credential issuer as a part of the Identity Proofing and Verification (IPV) system within the GDS digital identity platform. Other repositories are used for core services or other credential issuers.

# Installation

Clone this repository and then run

```bash
yarn install

### Code Owners

# Installation

Clone this repository and then run

```bash
yarn install
```

## Environment Variables

- `BASE_URL`: Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5040`)

# Testing

## Mock Data

[Wiremock](https://wiremock.org) has been used to create a [stateful mock](https://wiremock.org/docs/stateful-behaviour/) of the API, through the use of scenarios.
These configuration files are stored as JSON files in the [./test/mocks/mappings](./test/mocks/mappings) directory.

This can be run by using:

`yarn run mock`

The frontend can be configured to use this server through changing two environment variables:

- `NODE_ENV = development` - this enables a middleware that passes the `x-scenario-id` header from web requests through to the API.
- `API_BASE_URL = http://localhost:8090` - this points the frontend to the wiremock instance.

A browser extension that can modify headers can be used to set the value of the header in a web browser. Example - [Mod Header](https://modheader.com)

## Request properties

In order to support consistent use of headers for API requests. [middleware](./src/lib/axios.js) is applied to add an instance of [axios](https://axios-http.com/) on each reqest onto `req.axios`. This is then reused in any code that uses the API.
