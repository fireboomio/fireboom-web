import { useMutation } from "@apollo/client";
import type { SchemaField, SchemaModel } from "@paljs/types";

import { getGraphqlMutation } from "@/components/PrismaTable/libs/GetGraphqlQuery";
import useTableSchema from "@/lib/hooks/useTableSchema";

interface CustomGraphqlError {
	error?: string;
	message?: string;
	user_facing_error?: {
		errorCode: string;
		message: string;
	};
}

interface GetValueOptions {
	value: string;
	field?: SchemaField;
	useSet?: boolean;
}

export const getValueByType = ({
	value,
	field,
	useSet = true,
}: GetValueOptions): any => {
	if (!field) {
		return value;
	}
	let result;
	if (field.type === "Json") {
		result = value ? JSON.parse(value) : field.list ? [] : {};
	} else if (field.list) {
		if (!value) return [];
		result = value;
	} else {
		switch (field.type) {
			case "BigInt":
			case "Int":
				result = Number.parseInt(value);
				break;
			case "Float":
			case "Decimal":
				result = Number.parseFloat(value);
				break;
			case "Boolean":
				result = value;
				break;
			default:
				result = value;
		}
	}
	return useSet ? { set: result } : result;
};

const useActions = (
	model: SchemaModel,
	originalData: any,
	action: "update" | "view" | "create",
	onSave: () => Promise<void>,
	// namespace?: string
) => {
	const {
		schema: { models },
	} = useTableSchema();

	const [updateModel, { loading: updateLoading }] = useMutation(
		// getGraphqlMutation(models, model.id, 'update', namespace)
		getGraphqlMutation(models, model.id, "update"),
		{
			onError: (err) => {
				if (err.graphQLErrors.length) {
					const e = err.graphQLErrors[0] as unknown as CustomGraphqlError;
					throw new Error(
						e.message ?? e.error ?? e.user_facing_error?.message,
					);
				}
				throw err;
			},
		},
	);
	const [createModel, { loading: createLoading }] = useMutation(
		getGraphqlMutation(models, model.id, "create"),
		// getGraphqlMutation(models, model.id, 'create', namespace),
		{
			onError: (err) => {
				if (err.graphQLErrors.length) {
          const e = (err.graphQLErrors[0] as unknown as CustomGraphqlError)
					throw new Error(e.message ?? e.error ?? e.user_facing_error?.message);
				}
				throw err;
			},
		},
	);
	const getField = (name: string) => {
		return model.fields.find((item) => item.name === name);
	};

	const onUpdateHandler = async (newData: Record<string, any>) => {
		console.log("newData", JSON.stringify(newData));
		const updateData: Record<string, any> = {};

		Object.keys(newData).forEach((key) => {
			const field = getField(key);
			if (field?.update) {
				if (field.kind === "object") {
					const fieldModel = models.find((item) => item.id === field.type)!;
					if (
						(newData[key] && !originalData[key]) ||
						(newData[key] &&
							newData[key] !== originalData[key][fieldModel.idField])
					) {
						const editField = fieldModel.fields.find(
							(item) => item.name === fieldModel.idField,
						)!;
						updateData[key] = {
							connect: {
								[fieldModel.idField]: getValueByType({
									value: newData[key],
									field: editField,
									useSet: false,
								}),
							},
						};
					} else if (!newData[key] && originalData[key]) {
						updateData[key] = { disconnect: true };
					}
				} else if (newData[key] !== originalData[key]) {
					console.log(newData[key], field);
					updateData[key] = getValueByType({ value: newData[key], field });
				}
			}
		});
		if (Object.keys(updateData).length > 0) {
			await updateModel({
				variables: {
					where: {
						[model.idField]: originalData[model.idField],
					},
					data: updateData,
				},
			}).then(onSave);
		}
	};

	const onCreateHandler = async (newData: Record<string, any>) => {
		const createData: Record<string, any> = {};
		Object.keys(newData).forEach((key) => {
			const field = getField(key);
			if (field?.kind === "object") {
				const fieldModel = models.find((item) => item.id === field.type)!;
				const editField = fieldModel.fields.find(
					(item) => item.name === fieldModel.idField,
				)!;
				if (newData[key]) {
					createData[key] = {
						connect: {
							[fieldModel.idField]: getValueByType({
								value: newData[key],
								field: editField,
								useSet: false,
							}),
						},
					};
				}
			} else {
				createData[key] = getValueByType({
					value: newData[key],
					field,
					useSet: false,
				});
			}
		});
		await createModel({
			variables: {
				data: createData,
			},
		}).then(onSave);
	};

	const onSubmit = async (newData: Record<string, any>) => {
		action === "create"
			? await onCreateHandler(newData)
			: await onUpdateHandler(newData);
	};

	return {
		onSubmit,
		loading: updateLoading || createLoading,
	};
};
export default useActions;
