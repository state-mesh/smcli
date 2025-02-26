import {APIClient} from "./api-client";
import {API_BASE} from "./utils/constants";
import {Websocket} from "./websocket";
import {ux} from "@oclif/core";

export class Term {
    private _mesh!: APIClient
    private ws: Websocket | null;

    constructor(mesh: APIClient) {
        this._mesh = mesh;
        this.ws = new Websocket(mesh);
    }

    async connect(applicationId: string, containerId: string) {
        if (!this.ws) {
            throw Error('Connection failed');
        }

        await this._mesh.get<any>(`${API_BASE}/api/terminal/app/${applicationId}?containerId=${containerId}`);
        await this.ws.setup();
        this.ws.stomp.watch(`/topic/terminal/${applicationId}/${containerId}`).subscribe({
            next: (message: any) => {
                if (message && message.body) {
                    const body = JSON.parse(message.body);
                    if (body?.type) {
                        if (body.type === "timeout") {
                            ux.error('Connection timed out');
                        } else if (body.type === "disconnect") {
                            ux.error('Disconnected');
                        }
                        return;
                    }
                }

                this.writeLines(message.binaryBody);
            },
            error: this.handleError.bind(this)
        });

        const self = this;
        await this.sendCommand(applicationId, containerId, 'clear\n');
        process.stdin.on('data', async function(chunk) {
            await self.sendCommand(applicationId, containerId, chunk.toString());
        });
        process.stderr.on('data', async function(chunk) {
            await self.sendCommand(applicationId, containerId, chunk.toString());
        });
    }

    private async sendCommand(applicationId: string, containerId: string, message: string) {
        if (!this.ws) {
            return;
        }

        this.ws.stomp.publish({
            destination: '/app/terminal',
            body: JSON.stringify({ applicationId, containerId, vmId: null, message }),
        });
    }

    private writeLines(binaryBody: Uint8Array): void {
        const messageRaw = new TextDecoder().decode(binaryBody);
        if (messageRaw) {
            const messageJson = JSON.parse(messageRaw);
            if (messageJson) {
                let message = messageJson.payload;
                if (message) {
                    process.stdout.write(message)
                }
            }
        }
    }

    private handleError(error: any): void {
        ux.error(error);
    }
}