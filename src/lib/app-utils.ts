import {APIClient} from "./api-client";

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
}