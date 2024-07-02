const axios = require("axios");

const renderApi = process.env.RENDER_API;
const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${renderApi}`
  }
};

async function getDeployments(serviceId) {
  const url = `https://api.render.com/v1/services/${serviceId}/deploys`;
  const response = await axios.get(url, axiosConfig);
  return response.data;
}

function checkArray(arr, key) {
  return arr.some(item => item.key === key);
}

async function deleteEnvVar(serviceId, envVarKey) {
  const url = `https://api.render.com/v1/services/${serviceId}/envVars`;
  const { data: envVars } = await axios.get(url, axiosConfig);

  const envVar = envVars.find(var => var.key === envVarKey);
  if (!envVar) {
    return `_No such env var in Render._`;
  }

  const deleteUrl = `https://api.render.com/v1/services/${serviceId}/envVars/${envVar.id}`;
  await axios.delete(deleteUrl, axiosConfig);

  return `_Successfully deleted ${envVarKey} var from Render._`;
}

async function changeEnvVar(serviceId, envVar) {
  const [key, value] = envVar.split(":");

  const url = `https://api.render.com/v1/services/${serviceId}/envVars`;
  const { data: envVars } = await axios.get(url, axiosConfig);

  const existingVar = envVars.find(var => var.key === key);

  if (existingVar) {
    const updateUrl = `https://api.render.com/v1/services/${serviceId}/envVars/${existingVar.id}`;
    await axios.patch(updateUrl, { value }, axiosConfig);
  } else {
    await axios.post(url, { key, value }, axiosConfig);
  }

  return `_Successfully changed var ${key}:${value}._`;
}

async function getAllEnvVars(serviceId) {
  const url = `https://api.render.com/v1/services/${serviceId}/envVars`;
  const { data: envVars } = await axios.get(url, axiosConfig);

  return envVars.map(envVar => `*${envVar.key}* : _${envVar.value}_`).join("\n");
}

async function getEnvVar(serviceId, envVarKey) {
  const url = `https://api.render.com/v1/services/${serviceId}/envVars`;
  const { data: envVars } = await axios.get(url, axiosConfig);

  const envVar = envVars.find(var => var.key === envVarKey);
  return envVar ? `${envVar.key}:${envVar.value}` : null;
}

async function redeployService(serviceId) {
  const url = `https://api.render.com/v1/services/${serviceId}/deploys`;
  const redeployData = {
    clearCache: false
  };

  try {
    await axios.post(url, redeployData, axiosConfig);
    return `_Update started._`;
  } catch (error) {
    return `*Got an error in redeploying.*\n*Please put Render API key in var RENDER_API.*\n_Eg: RENDER_API:api key from https://dashboard.render.com/account/api_`;
  }
}

module.exports = {
  getDeployments,
  checkArray,
  deleteEnvVar,
  changeEnvVar,
  getAllEnvVars,
  getEnvVar,
  redeployService
};