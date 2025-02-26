import {APIClient} from "./api-client";
import {RxStomp} from "@stomp/rx-stomp";
import {API_BASE} from "./utils/constants";
import * as SockJS from "sockjs-client";

export class Websocket {
    private _mesh!: APIClient
    private rxStomp?: RxStomp;

    constructor(mesh: APIClient) {
        this._mesh = mesh;
    }

    async setup() {
        this.rxStomp = new RxStomp();
        this.rxStomp.configure({
            reconnectDelay: 200
        });

        this.connect();
    }

    private connect(): void {
        this.updateCredentials();
        return this.stomp.activate();
    }

    get stomp(): RxStomp {
        if (!this.rxStomp) {
            throw new Error('Stomp connection not initialized');
        }
        return this.rxStomp;
    }

    private updateCredentials(): void {
        const self = this;

        this.stomp.configure({
            webSocketFactory: () => SockJS(self.buildUrl()),
        });
    }

    buildUrl(): string {
        const authToken = this.mesh.auth;
        if (authToken) {
            return `${API_BASE}/websocket/tracker?access_token=${authToken}`;
        }
        return `${API_BASE}/websocket/tracker`;
    }

    get mesh(): APIClient {
        return this._mesh
    }
}