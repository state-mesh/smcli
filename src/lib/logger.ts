import {APIClient} from "./api-client";
import {API_BASE} from "./utils/constants";
import {Websocket} from "./websocket";
import {ux} from "@oclif/core";
import {map} from "rxjs";

export class Logger {
    private _mesh!: APIClient
    private ws: Websocket | null;

    constructor(mesh: APIClient) {
        this._mesh = mesh;
        this.ws = new Websocket(mesh);
    }

    async start(applicationId: string, containerId: string) {
        if (!this.ws) {
            throw Error('Connection failed');
        }

        ux.action.start('Loading');
        await this.ws.setup();
        this.ws.stomp
            .watch(`/topic/logs/${applicationId}/${containerId}`)
            .pipe(
                map(message => {
                    return JSON.parse(message.body);
                })
            )
            .subscribe({
                next: async (logs: any[]) => {
                    ux.action.stop();
                    const logsArray = Array.isArray(logs) ? logs : [logs];
                    if (logsArray.length === 1 && logsArray[0]?.type) {
                        if (logsArray[0].type === "timeout") {
                            ux.error('Connection timed out');
                        } else if (logsArray[0].type === "disconnect") {
                            ux.error('Disconnected');
                        }
                        return;
                    }

                    this.writeLogs(logsArray);
                },
                error: this.handleError.bind(this)
            });

        setTimeout(() =>
            this._mesh.get<any>(`${API_BASE}/api/metrics/logs/${applicationId}?containerId=${containerId}&limit=100`),
            2000)
    }

    private writeLogs(logs: any[]): void {
        logs.forEach(log =>
            process.stdout.write('[' + log.timestamp + '] ' + log.message + '\n')
        );
    }

    private handleError(error: any): void {
        ux.error(error);
    }
}