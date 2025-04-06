const InputField = ({ label, name, type, icon: Icon, value, onChange }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
          size={18}
        />
        <input
          type={type}
          name={name}
          className="w-full rounded-md border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          value={value}
          required
          onChange={onChange}
        />
      </div>
    </div>
  );
};
export default InputField;
