import type {
	AutoCompleteProps,
	FormItemProps,
	InputProps,
	SelectProps,
} from "antd";
import { AutoComplete, Form, Input, Select, Space } from "antd";
import clsx from "clsx";
import type { ChangeEvent, ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useIntl } from "react-intl";

import { VariableKind } from "@/interfaces/common";
import useEnvOptions from "@/lib/hooks/useEnvOptions";
import { useEnv } from "@/providers/env";
import type { ApiDocuments } from "@/services/a2s.namespace";

export interface InputOrFromEnvProps {
	className?: string;
	value?: ApiDocuments.ConfigurationVariable;
	inputProps?: Omit<InputProps, "value" | "onChange">;
	envProps?: Omit<AutoCompleteProps, "value" | "onChange">;
	inputRender?: (props: InputProps) => ReactNode;
	onChange?: (data?: ApiDocuments.ConfigurationVariable) => void;
}

const _InputOrFromEnv = ({
	className,
	value,
	onChange,
	inputProps,
	inputRender,
	envProps,
}: InputOrFromEnvProps) => {
	const intl = useIntl();
	const { kind, setKind } = useContext(InputOrFromEnvContext);
	const envs = useEnvOptions();
	const { envs: envMap } = useEnv();
	const modeOptions = useMemo<SelectProps["options"]>(
		() => [
			{
				value: VariableKind.Static,
				label: intl.formatMessage({ defaultMessage: "静态值" }),
			},
			{
				value: VariableKind.Env,
				label: intl.formatMessage({ defaultMessage: "环境变量" }),
			},
		],
		[intl],
	);

	const onSwitchMode = useCallback(
		(e: VariableKind) => {
			setKind(e);
			onChange?.(
				e === VariableKind.Env
					? { kind: e, environmentVariableName: "" }
					: { kind: e, staticVariableContent: "" },
			);
		},
		[onChange, setKind],
	);
	const onValueChange = useCallback(
		(e: ChangeEvent<HTMLInputElement> | string) => {
			var value: string = typeof e === "string" ? e : e.target.value;
			onChange?.(
				kind === VariableKind.Env
					? { kind: kind, environmentVariableName: value }
					: { kind: kind, staticVariableContent: value },
			);
		},
		[kind, onChange],
	);

	useEffect(() => {
		setKind((value?.kind as VariableKind) ?? VariableKind.Static);
	}, [setKind, value?.kind]);

	return (
		<Space.Compact className={clsx("!flex", className)}>
			<Select
				className="!w-30"
				value={kind}
				options={modeOptions}
				onChange={onSwitchMode}
			/>
			{kind === VariableKind.Env ? (
				<div className="relative flex-1">
					<AutoComplete
						{...envProps}
						className="w-full"
						value={value?.environmentVariableName}
						options={envs}
						onChange={onValueChange}
					/>
					{value?.environmentVariableName && (
						<div className="absolute right-2 top-0 bottom-0 leading-8 text-[#999] z-10">
							{envMap[value.environmentVariableName]}
						</div>
					)}
				</div>
			) : inputRender ? (
				inputRender({
					...inputProps,
					value: value?.staticVariableContent,
					onChange: onValueChange,
					className: "flex-1",
				})
			) : (
				<Input
					{...inputProps}
					className="flex-1"
					value={value?.staticVariableContent}
					onChange={onValueChange}
				/>
			)}
		</Space.Compact>
	);
};

export const InputOrFromEnv = (props: InputOrFromEnvProps) => {
	const [kind, setKind] = useState<VariableKind>(VariableKind.Static);
	return (
		<InputOrFromEnvContext.Provider value={{ kind, setKind }}>
			<_InputOrFromEnv {...props} />
		</InputOrFromEnvContext.Provider>
	);
};

export interface InputOrFromEnvWithItemProps
	extends Pick<
		InputOrFromEnvProps,
		"inputProps" | "envProps" | "inputRender" | "className"
	> {
	formItemProps?: Omit<FormItemProps, "rules">;
	required?: boolean;
	rules?: FormItemProps["rules"];
	onChange?: (data?: ApiDocuments.ConfigurationVariable) => void;
}

const InputOrFromEnvWithItem = ({
	formItemProps,
	rules,
	required,
	...rest
}: InputOrFromEnvWithItemProps) => {
	const [kind, setKind] = useState<VariableKind>(VariableKind.Static);
	return (
		<InputOrFromEnvContext.Provider value={{ kind, setKind }}>
			<Form.Item
				{...formItemProps}
				rules={
					kind === VariableKind.Env
						? required
							? [
									{
										required: true,
										message: "请选择一个环境变量或者手动输入",
									},
							  ]
							: undefined
						: required
						  ? [
									...(rules ?? []),
									{
										required: true,
										message: "请输入",
									},
							  ]
						  : rules
				}
			>
				<_InputOrFromEnv {...rest} />
			</Form.Item>
		</InputOrFromEnvContext.Provider>
	);
};

export default InputOrFromEnvWithItem;

interface InputOrFromEnvState {
	kind: VariableKind;
	setKind: (kind: VariableKind) => void;
}

const InputOrFromEnvContext = createContext<InputOrFromEnvState>(
	// @ts-ignore
	null,
);
