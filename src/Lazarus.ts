import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import {exec} from '@actions/exec/lib/exec';
import * as os from 'os';
import * as path from 'path';
import {ok} from 'assert';

const StableVersion = '2.0.8';

const pkgs: object = {
    "win32": {
        "v2_0_6" : "lazarus-2.0.6-fpc-3.0.4-win32.exe",
        "v2_0_4" : "lazarus-2.0.4-fpc-3.0.4-win32.exe",
        "v2_0_2" : "lazarus-2.0.2-fpc-3.0.4-win32.exe",
        "v2_0_0" : "lazarus-2.0.0-fpc-3.0.4-win32.exe",
        "v1_8_4" : "lazarus-1.8.4-fpc-3.0.4-win32.exe",
        "v1_8_2" : "lazarus-1.8.2-fpc-3.0.4-win32.exe",
        "v1_8_0" : "lazarus-1.8.0-fpc-3.0.4-win32.exe",
        "v1_6_4" : "lazarus-1.6.4-fpc-3.0.2-win32.exe",
        "v1_6_2" : "lazarus-1.6.2-fpc-3.0.0-win32.exe",
        "v1_6"   : "lazarus-1.6.0-fpc-3.0.0-win32.exe",
        "v1_4_4" : "lazarus-1.4.4-fpc-2.6.4-win32.exe",
        "v1_4_2" : "lazarus-1.4.2-fpc-2.6.4-win32.exe",
        "v1_4"   : "lazarus-1.4.0-fpc-2.6.4-win32.exe",
        "v1_2_6" : "lazarus-1.2.6-fpc-2.6.4-win32.exe",
        "v1_2_4" : "lazarus-1.2.4-fpc-2.6.4-win32.exe",
        "v1_2_2" : "lazarus-1.2.2-fpc-2.6.4-win32.exe",
        "v1_2"   : "lazarus-1.2.0-fpc-2.6.2-win32.exe",
        "v1_0_14": "lazarus-1.0.14-fpc-2.6.2-win32.exe",
        "v1_0_12": "lazarus-1.0.12-fpc-2.6.2-win32.exe"
    },
    "linux": {
        "v2_0_6": {
            "laz": "lazarus-project_2.0.6-0_amd64.deb",
            "fpc": "fpc-laz_3.0.4-1_amd64.deb",
            "fpcsrc": "fpc-src_3.0.4-2_amd64.deb"
        },
        "v2_0_4": {
            "laz": "lazarus-project_2.0.4-0_amd64.deb",
            "fpc": "fpc-laz_3.0.4-1_amd64.deb",
            "fpcsrc": "fpc-src_3.0.4-2_amd64.deb"
        },
        "v2_0_2": {
            "laz": "lazarus-project_2.0.2-0_amd64.deb",
            "fpc": "fpc-laz_3.0.4-1_amd64.deb",
            "fpcsrc": "fpc-src_3.0.4-2_amd64.deb"
        },
        "v2_0_0": {
            "laz": "lazarus-project_2.0.0-0_amd64.deb",
            "fpc": "fpc-laz_3.0.4-1_amd64.deb",
            "fpcsrc": "fpc-src_3.0.4-2_amd64.deb"
        },
        "v1_8_4": {
            "laz": "lazarus-project_1.8.4-0_amd64.deb",
            "fpc": "fpc_3.0.4-3_amd64.deb",
            "fpcsrc": "fpc-src_3.0.4-2_amd64.deb"
        },
        "v1_8_2": {
            "laz": "lazarus-project_1.8.2-0_amd64.deb",
            "fpc": "fpc_3.0.4-2_amd64.deb",
            "fpcsrc": "fpc-src_3.0.4-2_amd64.deb"
        },
        "v1_8_0": {
            "laz": "lazarus-project_1.8.0-1_amd64.deb",
            "fpc": "fpc_3.0.4-2_amd64.deb",
            "fpcsrc": "fpc-src_3.0.4-2_amd64.deb"
        },
        "v1_6_4": {
            "laz": "lazarus-project_1.6.4-0_amd64.deb",
            "fpc": "fpc_3.0.2-170225_amd64.deb",
            "fpcsrc": "fpc-src_3.0.2-170225_amd64.deb"
        },
        "v1_6_2": {
            "laz": "lazarus-project_1.6.2-1_amd64.deb",
            "fpc": "fpc_3.0.0-151205_amd64.deb",
            "fpcsrc": "fpc-src_3.0.0-151205_amd64.deb"
        },
        "v1_6": {
            "laz": "lazarus_1.6-0_amd64.deb",
            "fpc": "fpc_3.0.0-151205_amd64.deb",
            "fpcsrc": "fpc-src_3.0.0-151205_amd64.deb"
        },
        "v1_4_4": {
            "laz": "lazarus_1.4.4-0_amd64.deb",
            "fpc": "fpc_2.6.4-150228_amd64.deb",
            "fpcsrc": "fpc-src_2.6.4-150228_amd64.deb"
        },
        "v1_4_2": {
            "laz": "lazarus_1.4.2-0_amd64.deb",
            "fpc": "fpc_2.6.4-150228_amd64.deb",
            "fpcsrc": "fpc-src_2.6.4-150228_amd64.deb"
        },
        "v1_4": {
            "laz": "lazarus_1.4.0-0_amd64.deb",
            "fpc": "fpc_2.6.4-150228_amd64.deb",
            "fpcsrc": "fpc-src_2.6.4-150228_amd64.deb"
        },
        "v1_2_6": {
            "laz": "lazarus_1.2.6-0_amd64.deb",
            "fpc": "fpc_2.6.4-140420_amd64.deb",
            "fpcsrc": "fpc-src_2.6.4-140420_amd64.deb"
        },
        "v1_2_4": {
            "laz": "lazarus_1.2.4-0_amd64.deb",
            "fpc": "fpc_2.6.4-140420_amd64.deb",
            "fpcsrc": "fpc-src_2.6.4-140420_amd64.deb"
        },
        "v1_2_2": {
            "laz": "lazarus_1.2.2-0_amd64.deb",
            "fpc": "fpc_2.6.4-140420_amd64.deb",
            "fpcsrc": "fpc-src_2.6.4-140420_amd64.deb"
        },
        "v1_2": {
            "laz": "lazarus_1.2.0-0_amd64.deb",
            "fpc": "fpc_2.6.2-0_amd64.deb",
            "fpcsrc": "fpc-src_2.6.2-0_amd64.deb"
        },
        "v1_0_14": {
            "laz": "lazarus_1.0.14-0_amd64.deb",
            "fpc": "fpc_2.6.2-0_amd64.deb",
            "fpcsrc": "fpc-src_2.6.2-0_amd64.deb"
        },
        "v1_0_12": {
            "laz": "lazarus_1.0.12-0_amd64.deb",
            "fpc": "fpc_2.6.2-0_amd64.deb",
            "fpcsrc": "fpc-src_2.6.2-0_amd64.deb"
        }
    }
};

export class Lazarus{
    private _Platform: string = os.platform();
    private _LazarusVersion: string = '';

    constructor(LazarusVersion: string) {
        this._LazarusVersion = LazarusVersion;
    }
    
    async installLazarus(): Promise<void> {
        console.log(`installLazarus -- Installing Lazarus v${this._LazarusVersion} on "${this._Platform}"`);
        switch (this._LazarusVersion) {
            // Special case named version that installs the repository pakages on Ubuntu
            // but installs stable version under Windows
            case "dist":
                switch (this._Platform) {
                    case 'linux':
                        // Perform a repository update
                        await exec('sudo apt update');
                        // Install Lazarus from the Ubuntu repository
                        await exec('sudo apt install -y lazarus');
                    break;
                    case 'win32':
                        await this._downloadLazarus(StableVersion);
                        break;
                    default:
                        throw new Error(`getLazarus - Platform not supported: ${this._Platform}`);
                }
                break;
            // Special case named version that installs the latest stable version
            case 'stable':
                await this._downloadLazarus(StableVersion);
                break;
            case '2.0.6':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '2.0.4':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '2.0.2':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '2.0.0':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.8.4':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.8.2':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.8.0':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.6.4':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.6.2':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.6':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.4.4':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.4.2':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.4':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.2.6':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.2.4':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.2.2':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.2':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.0.14':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            case '1.0.12':
                await this._downloadLazarus(this._LazarusVersion);
                break;
            default:
                throw new Error(`getLazarus - Version not available: ${this._LazarusVersion}`);
        }
    }

    private async _downloadLazarus(
        lazVersion: string
    ): Promise<void> {
        switch (this._Platform) {
            case 'win32':
                // Get the URL of the file to download
                let downloadURL: string = this._getPackageName('laz');
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
                    let lazarusDir: string = path.join(this._getTempDirectory(), 'lazarus');
                    await exec(`${downloadPath_WIN} /VERYSILENT /DIR=${lazarusDir}`);
        
                    // Add this path to the runner's global path
                    core.addPath(`${lazarusDir}`);
                } catch(err) {
                    throw err;
                }
                break;
            case 'linux':
                console.log('_downloadLazarus - sudo section');
                // Perform a repository update
                await exec('sudo apt update');
                // Install the pre-requesite needed for Lazarus
                // TODO : investigate when this should be GTK 5
                await exec('sudo apt install -y libgtk2.0-dev');
        
                let downloadPath_LIN: string;
        
                // Get the URL of the file to download
                let downloadFPCSRCURL: string = this._getPackageName('fpcsrc');
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
                let downloadFPCURL: string = this._getPackageName('fpc');
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
                let downloadLazURL: string = this._getPackageName('laz');
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
                throw new Error(`_downloadLazarus - Platform not implemented: ${this._Platform}`);
        }
    }

    private _getPackageName(
        pkg: string
    ): string {
        let result: string = '';
        // Replace periods with undescores due to JSON borking with periods or dashes
        let lazVer = 'v' + this._LazarusVersion.replace(/\./gi, '_');
        switch (this._Platform) {
            case "win32":
                result = `https://sourceforge.net/projects/lazarus/files/Lazarus%20Windows%2032%20bits/Lazarus%20${this._LazarusVersion}/`;
                result += pkgs[this._Platform][lazVer];
                break;
            case "linux":
                result = `https://sourceforge.net/projects/lazarus/files/Lazarus%20Linux%20amd64%20DEB/Lazarus%20${this._LazarusVersion}/`;
                result += pkgs[this._Platform][lazVer][pkg];
                break;
            default:
                throw new Error(`getPackageName - Platform not implemented yet ${this._Platform}`);
        }
        
        return result;
    }

    private _getTempDirectory(): string {
        const tempDirectory = process.env['RUNNER_TEMP'] || ''
        ok(tempDirectory, 'Expected RUNNER_TEMP to be defined')
        return tempDirectory
    }
}