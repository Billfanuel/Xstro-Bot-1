const config = require('../config');
const { Index } = require('../lib');
const fetch = require('node-fetch');

// Define the command using the Index function
Index(
  {
    pattern: 'repo',
    alias: ['script'],
    desc: 'Sends info about repo',
    category: 'main',
  },
  async context => {
    try {
      // Fetch the repository data from GitHub API
      const response = await fetch('https://api.github.com/repos/AstroFx0011/Xstro-Bot');
      
      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }
      
      // Parse the response data as JSON
      const repoData = await response.json();
      
      // Construct the repository information message
      const repoInfo = `
\t 𝗫𝘀𝘁𝗿𝗼 𝗕𝗼𝘁 𝟮𝟬𝟮𝟰

𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 AstroFX0011
𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻 ${repoData?.created_at}
𝗦𝘁𝗮𝗿𝘀 ${repoData?.stargazers_count || '120+'} stars
𝗨𝘀𝗲𝗱 𝗕𝘆 ${repoData?.forks_count} Users
𝗦𝗰𝗿𝗶𝗽𝘁 https://github.com/AstroFx0011/Xstro-Bot

\t ${config.botname}
      `.trim();

      // Send the repository information message
      await context.sendUi(context.jid, {
        caption: repoInfo,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      await context.error(`${error.message}\n\ncommand: repo`, error);
    }
  }
);