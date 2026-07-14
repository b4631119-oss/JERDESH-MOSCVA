"use client";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
};

export default function SearchInput({ value, onChange, onFocus }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      placeholder="Поиск в Москве"
      className="flex-1 px-4 py-3 text-sm text-gray-600 outline-none bg-transparent min-w-0 placeholder-gray-400"
    />
  );
}