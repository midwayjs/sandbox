import { exec } from 'child_process';
import { provide } from 'midway';
import { HostSelector } from 'sandbox-core';
import { IRemoteExecuteAdapter } from 'sandbox-core';

@provide('remoteExecuteAdapter')
export class RemoteExecuteAdapter implements IRemoteExecuteAdapter {
  exec(host: HostSelector, cmd): Promise<string> {
    const cmdEscaped = cmd.replace('"', '\\"');
    const shell = `ssh ${host.ip} "${cmdEscaped}"`;
    return new Promise((resolve, reject) => {
      exec(shell, {
        timeout: 5000
      }, (error, stdout) => {
        if(error) {
          return reject(error);
        }
        resolve(stdout.toString());
      });
    });
  }
}
