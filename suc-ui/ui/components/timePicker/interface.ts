export interface TimePickerOptions {
    type?: string;
    format?: string;
    placement?: "top" | "bottom" | "top-start" | "bottom-start" | "top-end" | "bottom-end";
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    readonly?: boolean;
    confirm?: boolean;
}