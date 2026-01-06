const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const SCENARIOS = ['greenfield', 'brownfield', 'redfield'];
const PROMPT_TYPES = ['specific', 'vague'];
const AGENT_TYPES = ['guided', 'unguided'];

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
}

function updateMcpConfig(agentType) {
  const configPath = '/Users/rviscomi/.gemini/jetski/mcp_config.json';
  let config = { mcpServers: {} };

  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      if (content.trim()) {
        config = JSON.parse(content);
      }
    }
  } catch (e) {
    console.error('Failed to read MCP config:', e);
  }

  if (!config.mcpServers) config.mcpServers = {};

  const serverName = 'modern-web';
  // Only configure modern-web for guided agents
  if (agentType === 'guided') {
    config.mcpServers[serverName] = {
      "command": "node",
      "args": [
        "/Users/rviscomi/git/modern-web-mcp/build/index.js"
      ]
    };
    console.log('Enabled modern-web MCP server');
  } else {
    if (config.mcpServers[serverName]) {
      delete config.mcpServers[serverName];
      console.log('Disabled modern-web MCP server');
    }
  }

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (e) {
    console.error('Failed to write MCP config:', e);
  }
}


async function main() {
  const baseDir = __dirname;
  const knowledgePath = '/Users/rviscomi/.gemini/jetski/knowledge';
  if (!knowledgePath.endsWith('.gemini/jetski/knowledge')) {
    console.error('Knowledge path is not valid:', knowledgePath);
    process.exit(1);
  }
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jetski-knowledge-backup-'));

  console.log(`\n=== Backing up Knowledge Base ===`);
  console.log(`Source: ${knowledgePath}`);
  console.log(`Backup: ${backupDir}`);

  try {
    await runCommand(`cp -R "${knowledgePath}" "${backupDir}"`);
    console.log('✅ Backup successful');

    for (const scenario of SCENARIOS) {
      for (const promptType of PROMPT_TYPES) {
        const promptPath = path.join(baseDir, scenario, promptType, 'PROMPT.txt');

        if (!fs.existsSync(promptPath)) {
          console.warn(`WARNING: Prompt file not found at ${promptPath}. Skipping this prompt type.`);
          continue;
        }

        const promptContent = fs.readFileSync(promptPath, 'utf8').trim();
        console.log(`\n=== Loaded Prompt for verify [${scenario} / ${promptType}] ===`);

        promptContent += `\n\nDon't bother validating it in a browser.`;

        for (const agentType of AGENT_TYPES) {
          updateMcpConfig(agentType);

          console.log('🧹 Clearing Knowledge Base for new run...');
          await runCommand(`rm -rf "${knowledgePath}/"*`);

          const targetDir = path.join(baseDir, scenario, promptType, agentType);

          if (!fs.existsSync(targetDir)) {
            console.warn(`WARNING: Target directory not found at ${targetDir}. Skipping.`);
            continue;
          }

          console.log(`\n>>> Running Scenario: ${scenario} | Prompt: ${promptType} | Agent: ${agentType}`);
          console.log(`Target Dir: ${targetDir}`);

          try {
            await runCommand('node', ['autorun.js', targetDir, JSON.stringify(promptContent)]);
            console.log(`✅ Completed: ${scenario}/${promptType}/${agentType}`);
          } catch (error) {
            console.error(`❌ Failed: ${scenario}/${promptType}/${agentType}`, error);
          }
        }
      }
    }
  } catch (e) {
    console.error('❌ Error during suite execution:', e);
  } finally {
    console.log(`\n=== Restoring Knowledge Base ===`);

    try {
      await runCommand(`rm -rf "${knowledgePath}"`);

      const backedUpKnowledge = path.join(backupDir, 'knowledge');
      if (fs.existsSync(backedUpKnowledge)) {
        await runCommand(`cp -R "${backedUpKnowledge}" "${knowledgePath}"`);
      } else {
        await runCommand(`cp -R "${backupDir}/"* "${knowledgePath}"`);
      }
      console.log('✅ Restore successful');

      fs.rmSync(backupDir, { recursive: true, force: true });
    } catch (restoreErr) {
      console.error('CRITICAL: Failed to restore knowledge base!', restoreErr);
      console.error(`Backup should still be available at: ${backupDir}`);
    }
  }
}

main().catch(console.error);
