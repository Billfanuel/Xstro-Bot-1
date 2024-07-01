const axios = require("axios");

const koyebApi = process.env.KOYEB_API;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${koyebApi}`
  }
};

async function getDeployments() {
  let status = false;
  await axios.get("https://app.koyeb.com/v1/deployments", axiosConfig).then(response => {
    const invalidStatuses = ["STOPPED", "STOPPING", "ERROR", "ERRPRING"];
    const validStatuses = response.data.deployments
      .filter(deployment => !invalidStatuses.includes(deployment.status))
      .map(deployment => deployment.status);

    if (validStatuses.length > 1) {
      status = "true";
    }
  });
  return status;
}

function checkArray(arr, key) {
  return arr.some(item => item.key === key);
}

async function deleteEnvVar(envVarKey) {
  let resultMessage = false;
  const { data: servicesData } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  const serviceId = servicesData.services[0].id;
  const { data: deploymentData } = await axios.get(`https://app.koyeb.com/v1/deployments/${servicesData.services[0].latest_deployment_id}`, axiosConfig);

  if (!checkArray(deploymentData.deployment.definition.env, envVarKey)) {
    return "_No such env in koyeb._";
  }

  const newEnv = deploymentData.deployment.definition.env.filter(envVar => envVar.key !== envVarKey);

  const updatedDefinition = {
    definition: {
      ...deploymentData.deployment.definition,
      env: newEnv
    }
  };

  await axios.patch(`https://app.koyeb.com/v1/services/${serviceId}`, updatedDefinition, axiosConfig).then(response => {
    if (response.status === 200) {
      resultMessage = `_Successfully deleted ${envVarKey} var from koyeb._`;
    } else {
      resultMessage = "_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key";
    }
  });
  return resultMessage;
}

async function changeEnvVar(envVar) {
  let resultMessage = "_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key";
  const [key, value] = envVar.split(":");

  const { data: servicesData } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  const serviceId = servicesData.services[0].id;
  const { data: deploymentData } = await axios.get(`https://app.koyeb.com/v1/deployments/${servicesData.services[0].latest_deployment_id}`, axiosConfig);

  const newEnv = deploymentData.deployment.definition.env.map(envVar => 
    envVar.key === key ? { ...envVar, value } : envVar
  );

  if (!checkArray(newEnv, key)) {
    newEnv.push({ scopes: ["region:fra"], key, value });
  }

  const updatedDefinition = {
    definition: {
      ...deploymentData.deployment.definition,
      env: newEnv
    }
  };

  await axios.patch(`https://app.koyeb.com/v1/services/${serviceId}`, updatedDefinition, axiosConfig).then(response => {
    if (response.status === 200) {
      resultMessage = `Successfully changed var ${key}:${value} ._`;
    } else {
      resultMessage = "_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key";
    }
  });
  return resultMessage;
}

async function getAllEnvVars() {
  const { data: servicesData } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  const { data: deploymentData } = await axios.get(`https://app.koyeb.com/v1/deployments/${servicesData.services[0].latest_deployment_id}`, axiosConfig);

  const envVars = deploymentData.deployment.definition.env
    .filter(envVar => envVar.key)
    .map(envVar => `*${envVar.key}* : _${envVar.value}_`);

  return envVars.join("\n");
}

async function getEnvVar(envVarKey) {
  const { data: servicesData } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  const { data: deploymentData } = await axios.get(`https://app.koyeb.com/v1/deployments/${servicesData.services[0].latest_deployment_id}`, axiosConfig);

  const envVar = deploymentData.deployment.definition.env.find(envVar => envVar.key === envVarKey);
  return envVar ? `${envVar.key}:${envVar.value}` : null;
}

async function redeployService() {
  let resultMessage = false;
  const redeployData = {
    deployment_group: "prod",
    sha: ""
  };

  const { data: servicesData } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  const serviceId = servicesData.services[0].id;

  try {
    await axios.post(`https://app.koyeb.com/v1/services/${serviceId}/redeploy`, redeployData, axiosConfig);
    resultMessage = "_update started._";
  } catch (error) {
    resultMessage = "*Got an error in redeploying.*\n*Please put koyeb api key in var KOYEB_API.*\n_Eg: KOYEB_API:api key from https://app.koyeb.com/account/api ._";
  }
  return resultMessage;
}

module.exports = {
  redeployService,
  getEnvVar,
  deleteEnvVar,
  getAllEnvVars,
  changeEnvVar,
  getDeployments
};