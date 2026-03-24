import { useRef, useEffect, TextareaHTMLAttributes } from 'react';

interface AutoResizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'standard' | 'underline';
}

const AutoResizeTextarea = ({ variant = 'standard', className = '', value, onChange, ...props }: AutoResizeTextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    const getStyles = () => {
        const baseStyles = "w-full focus:outline-none resize-none overflow-hidden transition-colors";

        if (variant === 'underline') {
            return `${baseStyles} bg-transparent border-b border-gray-300 py-2 rounded-none placeholder-gray-400 focus:border-[#4472c4] min-h-[40px]`;
        }

        return `${baseStyles} bg-white border border-gray-200 rounded-2xl p-4 text-gray-700 focus:border-blue-500`;
    };

    return (
        <textarea
            ref={textareaRef}
            className={`${getStyles()} ${className}`}
            onChange={(e) => {
                adjustHeight();
                if (onChange) onChange(e);
            }}
            value={value}
            {...props}
        />
    );
};

export default AutoResizeTextarea;
