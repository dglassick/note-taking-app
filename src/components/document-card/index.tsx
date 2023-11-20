"use client";

import { buttonVariants } from "../ui/button";
import { DocumentType } from "../sidebar";
import { cn } from "@/lib/utils";
import { LuFileText as FileText } from "react-icons/lu";
import { usePathname } from "next/navigation";
import DocumentOperations from "../document-operations";
import Link from "next/link";

export default function DocumentCard({ document }: { document: DocumentType }) {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                buttonVariants({ variant: "outline" }),
                "h-8 w-full justify-between  rounded-none dark:bg-slate-800 dark:hover:bg-slate-600",
                pathname === `/app/${document.publicId}` && "bg-secondary dark:bg-slate-600"
            )}
        >
            <Link
                className="flex w-full items-center"
                href={`/app/${document.publicId}`}
            >
                <FileText className="mr-2 h-4 w-4" />
                <div className="w-52 overflow-hidden truncate text-ellipsis whitespace-nowrap">
                    {document.title}
                </div>
            </Link>
            <DocumentOperations publicId={document.publicId} title={document.title} />
        </div>
    );
}