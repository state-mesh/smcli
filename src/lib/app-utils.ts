import {APIClient} from "./api-client";
import {createWriteStream, ReadStream} from "node:fs";
import {API_BASE, X_END} from "./utils/constants";
import * as os from 'os'
import {promisify} from "util";
import * as stream from "node:stream";

const FormData = require('form-data');
const axios = require("axios");

export class AppUtils {
    private _mesh!: APIClient

    constructor(mesh: APIClient) {
        this._mesh = mesh;
    }

    async appInfo(id: string) {
        const {body: appList} = await this._mesh.get<any>('/api/applications', {retryAuth: true});
        return appList ? appList.filter((app: any) => app.id === id) : [];
    }

    async controlApp(id: string, command: string, replicas?: number) {
        await this._mesh.post<any>(`/api/control/${command}/${id}${command === 'scale' ? '/' + replicas : ''}`, {retryAuth: true});
    }

    async uploadFile(file: ReadStream, applicationId: string, path: string, containerId?: string) {
        const formData = new FormData();
        formData.append('applicationId', applicationId);
        if (containerId) {
            formData.append('containerId', containerId);
        }
        formData.append('path', path);
        formData.append('file', file);

        await axios({
            method: "post",
            url: API_BASE + `/api/files/upload`,
            data: formData,
            headers: {
                authorization: `Bearer ${this._mesh.auth}`,
                "X-Api-Key": `${os.hostname() + X_END}`,
                ...formData.getHeaders()
            }
        });
    }

    async downloadFile(destinationPath: string, applicationId: string, containerPath: string, containerId?: string) {
        const finished = promisify(stream.finished);
        const response = await axios({
            method: "get",
            url: API_BASE + `/api/files/download?applicationId=${applicationId}${containerId ? '&containerId=' + containerId : ''}&path=${containerPath}`,
            responseType: 'stream',
            headers: {
                authorization: `Bearer ${this._mesh.auth}`,
                "X-Api-Key": `${os.hostname() + X_END}`,
            }
        });

        const contentDisposition = response.headers['content-disposition'];
        const quoted = contentDisposition.split(";")[1].split("=")[1];
        const fileName = quoted.substring(1, quoted.length - 1);

        const writer = createWriteStream(require('path').join(destinationPath, fileName));
        response.data.pipe(writer);
        return finished(writer);
    }
}