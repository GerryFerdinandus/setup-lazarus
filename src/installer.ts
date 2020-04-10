import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import {exec} from '@actions/exec/lib/exec';
import * as os from 'os';
import * as path from 'path';
import {ok} from 'assert';
import * as pkg from  './packages';

/**
 * function getLazarus
 *
 * This function checks for the available known versions.
 * Then calls the function that deals with platform specific handling.
 */
export async function getLazarus(
  version: string
): Promise<void> {
  console.log(`getLazarus - Installing Lazarus version:  ${version}`);

  // Latest known stable version
  const stableVersion: string = '2.0.6';

  switch (version) {
    // Special case named version that installs the repository pakages on Ubuntu
    // but installs stable version under Windows
    case "dist":
      let platform = os.platform();
      switch (platform) {
        case 'linux':
          await exec('sudo apt update');
          await exec('sudo apt install -y lazarus');
          break;
        case 'win32':
          await _downloadLazarus(stableVersion);
          break;
        default:
          throw new Error(`getLazarus - Platform not supported: ${platform}`);
          break;
      }
      break;
    // Special case named version that installs the latest stable version
    case 'stable':
      await _downloadLazarus(stableVersion);
      break;
    case '2.0.6':
      await _downloadLazarus(version);
      break;
    case '2.0.4':
      await _downloadLazarus(version);
      break;
    case '2.0.2':
      await _downloadLazarus(version);
      break;
    case '2.0.0':
      await _downloadLazarus(version);
      break;
    case '1.8.4':
      await _downloadLazarus(version);
      break;
    case '1.8.2':
      await _downloadLazarus(version);
      break;
    case '1.8.0':
      await _downloadLazarus(version);
      break;
    case '1.6.4':
      await _downloadLazarus(version);
      break;
    case '1.6.2':
      await _downloadLazarus(version);
      break;
    case '1.6':
      await _downloadLazarus(version);
      break;
    case '1.4.4':
      await _downloadLazarus(version);
      break;
    case '1.4.2':
      await _downloadLazarus(version);
      break;
    case '1.4':
      await _downloadLazarus(version);
      break;
    case '1.2.6':
      await _downloadLazarus(version);
      break;
    case '1.2.4':
      await _downloadLazarus(version);
      break;
    case '1.2.2':
      await _downloadLazarus(version);
      break;
    case '1.2':
      await _downloadLazarus(version);
      break;
    case '1.0.14':
      await _downloadLazarus(version);
      break;
    case '1.0.12':
      await _downloadLazarus(version);
      break;
    default:
      throw new Error(`getLazarus - Version not available: ${version}`);
      break;
  }
}
/**
 * function _downloadLazarus
 *
 * Internal function that deals with the platform's specific steps to
 * install the packages
 */
async function _downloadLazarus(
  versionLaz: string
): Promise<void> {
  let platform = os.platform();
  console.log(`_downloadLazarus - Installing on platform: ${platform}`);


  switch (platform) {
    case 'win32':
      // Get the URL of the file to download
      let downloadURL: string = pkg.getPackageName(platform, versionLaz, 'laz');
      console.log(`_downloadLazarus - Downloading ${downloadURL}`);

      let downloadPath_WIN: string;
      try {
        // Perform the download
        downloadPath_WIN = await tc.downloadTool(downloadURL);
        console.log(`_downloadLazarus - Downloaded into ${downloadPath_WIN}`);

        // tc.downloadTool returns a GUID string for a filename,
        // so it needs to be appended wit the extension .exe to execute
        await exec(`mv ${downloadPath_WIN} ${downloadPath_WIN}.exe'`);
        downloadPath_WIN += '.exe';

        // Run the installer
        let lazarusDir: string = path.join(_getTempDirectory(), 'lazarus');
        await exec(`${downloadPath_WIN} /VERYSILENT /DIR=${lazarusDir}`);

        // Add this path to the runner's global path
        core.addPath(`${lazarusDir}`);
      } catch(err) {
        throw err;
      }

      break;
    case 'linux':
      console.log('_downloadLazarus - sudo section');
      // Perform an repository update
      await exec('sudo apt update');
      // Install the pre-requesite needed for Lazarus
      // TODO : investigate when this should be GTK 5
      await exec('sudo apt install -y libgtk2.0-dev');

      let downloadPath_LIN: string;

      // Get the URL of the file to download
      let downloadFPCSRCURL: string = pkg.getPackageName(platform, versionLaz, 'fpcsrc');
      console.log(`_downloadLazarus - Downloading ${downloadFPCSRCURL}`);
      try {
        console.log(`_downloadLazarus - Downloading ${downloadFPCSRCURL}`);
        // Perform the download
        downloadPath_LIN = await tc.downloadTool(downloadFPCSRCURL);
        console.log(`_downloadLazarus - Downloaded into ${downloadPath_LIN}`);
        // Install the package
        await exec(`sudo dpkg -i ${downloadPath_LIN}`);
      } catch(err) {
        throw err;
      }

      // Get the URL of the file to download
      let downloadFPCURL: string = pkg.getPackageName(platform, versionLaz, 'fpc');
      console.log(`_downloadLazarus - Downloading ${downloadFPCURL}`);
      try {
        console.log(`_downloadLazarus - Downloading ${downloadFPCURL}`);
        // Perform the download
        downloadPath_LIN = await tc.downloadTool(downloadFPCURL);
        console.log(`_downloadLazarus - Downloaded into ${downloadPath_LIN}`);
        // Install the package
        await exec(`sudo dpkg -i ${downloadPath_LIN}`);
      } catch(err) {
        throw err;
      }

      // Get the URL of the file to download
      let downloadLazURL: string = pkg.getPackageName(platform, versionLaz, 'laz');
      console.log(`_downloadLazarus - Downloading ${downloadLazURL}`);
      try {
        console.log(`_downloadLazarus - Downloading ${downloadLazURL}`);
        // Perform the download
        downloadPath_LIN = await tc.downloadTool(downloadLazURL);
        console.log(`_downloadLazarus - Downloaded into ${downloadPath_LIN}`);
        // Install the package
        await exec(`sudo dpkg -i ${downloadPath_LIN}`);
      } catch(err) {
        throw err;
      }

      break;
    default:
      throw new Error(`_downloadLazarus - Platform not implemented: ${platform}`);
      break;
  }
}

/**
 * function _getTempDirectory
 *
 * Internal tool to get the platform's temporary folder
 */
function _getTempDirectory(): string {
  const tempDirectory = process.env['RUNNER_TEMP'] || ''
  ok(tempDirectory, 'Expected RUNNER_TEMP to be defined')
  return tempDirectory
}
