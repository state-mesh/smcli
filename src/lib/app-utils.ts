import {APIClient} from "./api-client";

export class AppUtils {
    private _mesh!: APIClient

    constructor(mesh: APIClient) {
        this._mesh = mesh;
    }

    async appInfo(id: string) {
        const {body: appList} = await this._mesh.get<any>('/api/applications', {retryAuth: true})
        return appList ? appList.filter((app: any) => app.id === id) : [];
    }
}