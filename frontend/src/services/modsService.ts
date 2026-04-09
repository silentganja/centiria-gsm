import http from "./httpService";
import config from "../config";

const apiEndpoint = config.apiUrl + "/mod";

export function getMods(filterByServerType?: string) {
    const query = filterByServerType ? "?filter=" + filterByServerType : "";
    return http.get(apiEndpoint + query);
}

export function installMod(modId: number) {
    return http.post(apiEndpoint + "/" + modId);
}

export function updateMods(modIdsList: string) {
    return http.post(apiEndpoint + "?modIds=" + modIdsList);
}

export function uninstallMods(modIdsList: string) {
    return http.delete(apiEndpoint + "?modIds=" + modIdsList);
}

export function setModServerOnly(modId: number, isServerOnly: boolean) {
    return http.patch(apiEndpoint + "/" + modId, {serverOnly: isServerOnly});
}

/**
 * Fetch mod details from the Bohemia Workshop by hex GUID (live preview, no registration)
 */
export function getBohemiaModDetails(hexId: string) {
    return http.get(apiEndpoint + "/bohemia/" + hexId);
}

/**
 * Register a Reforger mod by its Bohemia hex GUID.
 * The backend will scrape metadata from reforger.armaplatform.com.
 */
export function registerReforgerMod(modId: string, name?: string) {
    const params = new URLSearchParams({modId});
    if (name) params.append("name", name);
    return http.post(apiEndpoint + "/reforger?" + params.toString());
}
