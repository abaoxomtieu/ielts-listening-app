import React from 'react';

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
    title,
    children,
    collapsible = false,
    defaultCollapsed = false
}) => {
    const [isCollapsed, setIsCollapsed] = React.useState(collapsible ? defaultCollapsed : false);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div
                className={`flex justify-between items-center ${collapsible ? 'cursor-pointer select-none' : ''} ${!isCollapsed ? 'mb-4 border-b pb-2' : ''}`}
                onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
            >
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                {collapsible && (
                    <span className="text-gray-400">
                        {isCollapsed ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        )}
                    </span>
                )}
            </div>
            {!isCollapsed && (
                <div className="space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};

interface FormFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: 'text' | 'number' | 'select' | 'textarea';
    options?: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    onChange,
    type = 'text',
    options = [],
    placeholder = '',
    className = '',
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            {type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] text-black"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
            )}
        </div>
    );
};
