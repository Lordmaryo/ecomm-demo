import { ComponentType, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ComponentType<{ className?: string }>;
}

const Input = ({ icon: Icon, ...props }: InputProps) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-opacity-50 rounded-lg border-gray-700 transition duration-200"
      />
    </div>
  );
};
export default Input;
