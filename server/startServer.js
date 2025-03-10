import localtunnel from 'localtunnel';
import chalk from 'chalk';

// Create localtunnel
async function startTunnel() {
  try {
    const tunnel = await localtunnel({ 
      port: process.env.PORT || 3000,
      subdomain: 'researchrx' // This will try to get researchrx.loca.lt
    });

    console.log(chalk.green('\n=== Server URLs ==='));
    console.log(chalk.cyan('Local:', `http://localhost:${process.env.PORT || 3000}`));
    console.log(chalk.cyan('Public:', tunnel.url));
    console.log(chalk.green('==================\n'));

    tunnel.on('close', () => {
      console.log(chalk.yellow('Tunnel closed'));
    });

    tunnel.on('error', (err) => {
      console.error(chalk.red('Tunnel error:'), err);
    });

  } catch (err) {
    console.error(chalk.red('Error creating tunnel:'), err);
  }
}

// Start tunnel
startTunnel();

// Handle process termination
process.on('SIGINT', () => {
  process.exit();
});
