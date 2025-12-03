function Switch() {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" className="peer sr-only" />
      <div
        className="w-12 h-[26px] rounded-full bg-gray-200 peer-checked:bg-[#c9dfff]
                 transition-colors duration-300"
      ></div>
      <div
        className="absolute left-0 top-1 w-[18px] h-[18px] bg-gray-400  peer-checked:bg-blue-500 rounded-full shadow
                 transition-transform duration-300
                 peer-checked:translate-x-[26px] translate-x-1"
      ></div>
    </label>
  );
}

export default Switch;
