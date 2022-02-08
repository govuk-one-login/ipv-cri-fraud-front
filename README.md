# Digital Identity Credential Issuer

# di-ipv-cri-fraud-front

Frontend for fraud Credential Issuer

This is the home for the front end user interface for a credential issuer as a part of the Identity Proofing and Verification (IPV) system within the GDS digital identity platform. Other repositories are used for core services or other credential issuers.

# Installation

Clone this repository and then run

```bash
yarn install
```

## Environment Variables

- `BASE_URL`: Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5010`)
- `ORDNANCE_SURVEY_SECRET`- The api key for the ordnance postcode look up api.

## Testing

### How to run Browser tests

Start the server:
`NODE_ENV=development API_BASE_URL=http://localhost:8090 ORDNANCE_SURVEY_URL=http://localhost:8090 yarn dev`

Start the wiremock server:
`yarn run mocks`

Run all the tests:
`yarn run test:application --tags`
**or**
Run the specific tests with the @run tag:
`yarn run test:application --tags "@run"`


### Code Owners

# Installation

Clone this repository and then run

```bash
yarn install
```

## Environment Variables

- `BASE_URL`: Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5010`)

# Testing

## Mock Data

[Wiremock](https://wiremock.org) has been used to create a [stateful mock](https://wiremock.org/docs/stateful-behaviour/) of the API, through the use of scenarios.
These configuration files are stored as JSON files in the [./test/mocks/mappings](./test/mocks/mappings) directory.

This can be run by using:

`yarn run mock`

The frontend can be configure to use this server through changing two environment variables:

- `NODE_ENV = development` - this enables a midldeware that passes the `x-scenario-id` header from web requests through to the API.
- `API_BASE_URL = http://localhost:8090` - this points the frontend to the wiremock instance.

A browser extension that can modify headers can be used to set the value of the header in a web browser. Example - [Mod Header](https://modheader.com)

## Request properties

In order to support consisten use of headers for API requests. [middleware](./src/lib/axios.js) is applied to add an instance of [axios](https://axios-http.com/) on each reqest onto `req.axios`. This is then reused in any code that uses the API.
