import React from "react";

export type ColumnType<T> = {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
};

type TableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  rowKey?: (record: T) => React.Key;
};

const Table = <T,>({ columns, data, rowKey }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-right rtl:text-right">
        <thead className="bg-gray-50 text-gray-700 font-semibold">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default Table;
