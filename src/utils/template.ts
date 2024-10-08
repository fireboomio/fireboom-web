import { Eta } from "eta";
import { upperFirst } from "lodash";

import requests, { proxy } from "@/lib/fetchers";
import type { ApiDocuments } from "@/services/a2s.namespace";

const eta = new Eta();

export function getRawUrl(pathList: string[], ext: string) {
	// TODO，后续修改为mirror策略
	const _ext = ext.replace(/^\./, "");
		return `https://raw.git.fireboom.io/fireboomio/files/main/templates/${pathList.join(
			"/",
		)}.${_ext}`
}

export async function getHookTemplate(
	sdk: ApiDocuments.Sdk,
	hookFilePath: string[],
): Promise<string> {
	let content = "";
	try {
		content = await requests.get(
			`/vscode/readFile?uri=template/${sdk.name}/snippets/${hookFilePath.join(
				"/",
			)}${sdk.extension}.eta`,
			{
				// @ts-ignore
				ignoreError: true,
			},
		);
	} catch (error) {
		//
	}
	if (!content) {
		content = await proxy(
			getRawUrl([sdk.language === "go" ? "golang" : sdk.language, ...hookFilePath], sdk.extension),
		);
	}
	return content;
}

export function replaceFileTemplate(
	templateStr: string,
	variables?: Record<string, string | number | boolean>,
): string {
	// @ts-ignore
	return eta.renderString(templateStr, { ...variables, upperFirst });
}

export async function getDefaultCode(
	sdk: ApiDocuments.Sdk,
	hookFilePath: string[],
	variables?: Record<string, string | number | boolean>,
) {
	const templateStr = await getHookTemplate(sdk, hookFilePath);
	return replaceFileTemplate(templateStr, variables);
}

export async function resolveDefaultCode(
	path: string,
	sdk: ApiDocuments.Sdk,
): Promise<string> {
	const list = path.split("/");
	const name = list.pop()!.split(".")[0];
	const packageName = list[list.length - 1];
	let code = "";
	const variables = {
		packageName,
		name,
	};
	if (path.match(/custom[-_]\w+\/global\//)) {
		code = await getDefaultCode(sdk, ["global", name], variables);
	} else if (path.match(/custom[-_]\w+\/authentication\//)) {
		code = await getDefaultCode(
			sdk,
			["authentication", name],
			variables,
		);
	} else if (path.match(/custom[-_]\w+\/customize\//)) {
		code = await getDefaultCode(
			sdk,
			["custom", "customize"],
			variables,
		);
	} else if (path.match(/custom[-_]\w+\/function\//)) {
		code = await getDefaultCode(
			sdk,
			["custom", "function"],
			variables,
		);
	} else if (path.match(/custom[-_]\w+\/proxy\//)) {
		code = await getDefaultCode(sdk, ["custom", "proxy"], variables);
	} else if (path.match(/custom[-_]\w+\/storage/)) {
		const profileName = list.pop() as string;
		const providerName = list.pop() as string;
		code = await getDefaultCode(sdk, ["upload", name], {
			...variables,
			providerName,
			profileName,
		});
	} else {
		const operationPath = list.slice(2).join("/");
		const operationName = list.slice(2).join("__");
		code = await getDefaultCode(sdk, ["operation", name], {
			...variables,
			operationPath,
			operationName,
		});
	}
	return code;
}
