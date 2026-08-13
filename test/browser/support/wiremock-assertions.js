const ConfigurationReader = require("./configuration-reader");

async function fetchWiremockRequests() {
  const baseUrl = ConfigurationReader.get("API_BASE_URL");
  const res = await fetch(`${baseUrl}/__admin/requests`);
  return (await res.json()).requests || [];
}

async function findWiremockRequest({ method, url }) {
  const requests = await fetchWiremockRequests();
  return requests.find(
    (entry) => entry.request.method === method && entry.request.url === url
  );
}

function getHeaderCaseInsensitive(headers, name) {
  const matchKey = Object.keys(headers || {}).find(
    (key) => key.toLowerCase() === name.toLowerCase()
  );
  return matchKey ? headers[matchKey] : undefined;
}

module.exports = {
  findWiremockRequest,
  getHeaderCaseInsensitive
};
