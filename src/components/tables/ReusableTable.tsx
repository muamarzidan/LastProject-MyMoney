import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { ReactNode } from "react";

export interface TableColumn {
    key: string;
    header: string;
    render?: (row: any) => ReactNode;
}

interface Props {
    data: any[];
    columns: TableColumn[];
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    showActions?: boolean;
}

export default function ReusableTable({
    data,
    columns,
    onEdit,
    onDelete,
    showActions = false,
}: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.key}
                                    isHeader
                                    className="px-4 py-4 font-bold text-start text-md"
                                >
                                    {col.header}
                                </TableCell>
                            ))}
                            {showActions && (
                                <TableCell
                                    isHeader
                                    className="px-4 py-4 font-bold text-start text-md max-w-[150px] w-100"
                                >
                                    Aksi
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {data.map((row, idx) => (
                            <TableRow key={idx}>
                                {columns.map((col) => (
                                    <TableCell className="px-4 py-2 text-start text-sm" key={col.key}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </TableCell>
                                ))}
                                {showActions && (
                                    <TableCell className="px-4 py-2 flex justify-between max-w-[150px] w-100">
                                        <button
                                            onClick={() => onEdit?.(row)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(row)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};