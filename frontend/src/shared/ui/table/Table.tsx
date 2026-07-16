import React from "react";

export type ColumnType<T> = {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
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
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowKey ? rowKey(row) : (rowIndex as React.Key)}>
              {columns.map((col) => {
                const cellValue = (row as unknown as Record<string, unknown>)[
                  String(col.dataIndex)
                ];
                return (
                  <td key={col.key} className="px-4 py-2 align-top">
                    {col.render
                      ? col.render(cellValue, row, rowIndex)
                      : String(cellValue ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
