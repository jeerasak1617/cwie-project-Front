import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    variant?: 'standard' | 'underline';
}

const CustomDropdown = ({ value, onChange, options, placeholder = "Select option", variant = 'standard' }: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getButtonStyles = () => {
        if (variant === 'underline') {
            return `w-full py-2 border-b text-left flex items-center justify-between transition-all duration-300 ease-out group rounded-none
                ${isOpen
                    ? 'border-blue-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`;
        }
        return `w-full px-6 py-3.5 rounded-full border text-left flex items-center justify-between transition-all duration-300 ease-out group
            ${isOpen
                ? 'bg-white border-gray-300 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={getButtonStyles()}
            >
                <span className={`font-medium text-base transition-colors ${!value ? "text-gray-400" : "text-gray-900"}`}>
                    {value || placeholder}
                </span>
                <div className={`p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-gray-100 text-gray-600' : 'bg-transparent text-gray-400 group-hover:bg-gray-50 group-hover:text-gray-600'}`}>
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className={`absolute left-0 right-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white/50 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200 origin-top ${variant === 'underline' ? 'top-full mt-1' : 'top-full mt-3'}`}>
                    <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
                        {options.map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    onChange(item);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-5 py-3.5 text-left rounded-2xl transition-all duration-200 flex items-center justify-between group mb-1 last:mb-0
                                    ${value === item
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 font-medium shadow-sm'
                                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent hover:text-blue-600 hover:pl-6'
                                    }
                                `}
                            >
                                <span className="relative z-10">{item}</span>
                                {value === item && (
                                    <div className="bg-white p-1.5 rounded-full shadow-sm text-blue-600">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
