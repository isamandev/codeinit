"use client";
import React from "react";
import books from "@/data/books.json";
import posts from "@/data/posts.json";
import users from "@/data/users.json";

const files = [
  { name: "books.json", data: books },
  { name: "posts.json", data: posts },
  { name: "users.json", data: users },
];

function downloadFile(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function uint8FromString(s: string) {
  return new TextEncoder().encode(s);
}

function crc32(buf: Uint8Array) {
  let table: number[] | undefined = (crc32 as any)._table;
  if (!table) {
    table = new Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    (crc32 as any)._table = table;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeZip(filesData: { name: string; content: string }[]) {
  const parts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const f of filesData) {
    const nameBuf = uint8FromString(f.name);
    const contentBuf = uint8FromString(f.content);
    const crc = crc32(contentBuf);
    const compSize = contentBuf.length;
    const uncompSize = contentBuf.length;

    const localHeader = new Uint8Array(30 + nameBuf.length);
    const dv = new DataView(localHeader.buffer);
    dv.setUint32(0, 0x04034b50, true); // local file header signature
    dv.setUint16(4, 20, true); // version needed
    dv.setUint16(6, 0, true); // flags
    dv.setUint16(8, 0, true); // compression (0 = store)
    dv.setUint16(10, 0, true); // mod time
    dv.setUint16(12, 0, true); // mod date
    dv.setUint32(14, crc, true);
    dv.setUint32(18, compSize, true);
    dv.setUint32(22, uncompSize, true);
    dv.setUint16(26, nameBuf.length, true);
    dv.setUint16(28, 0, true); // extra length
    localHeader.set(nameBuf, 30);

    parts.push(localHeader);
    parts.push(contentBuf);

    const centralHeader = new Uint8Array(46 + nameBuf.length);
    const cd = new DataView(centralHeader.buffer);
    cd.setUint32(0, 0x02014b50, true); // central file header signature
    cd.setUint16(4, 0x0314, true); // version made by (20)
    cd.setUint16(6, 20, true); // version needed
    cd.setUint16(8, 0, true); // flags
    cd.setUint16(10, 0, true); // compression
    cd.setUint16(12, 0, true); // mod time
    cd.setUint16(14, 0, true); // mod date
    cd.setUint32(16, crc, true);
    cd.setUint32(20, compSize, true);
    cd.setUint32(24, uncompSize, true);
    cd.setUint16(28, nameBuf.length, true);
    cd.setUint16(30, 0, true); // extra
    cd.setUint16(32, 0, true); // comment
    cd.setUint16(34, 0, true); // disk
    cd.setUint16(36, 0, true); // int attr
    cd.setUint32(38, 0, true); // ext attr
    cd.setUint32(42, offset, true); // relative offset of local header
    centralHeader.set(nameBuf, 46);

    centralParts.push(centralHeader);

    offset += localHeader.length + contentBuf.length;
  }

  // central directory size & offset
  const centralDirStart = offset;
  let centralSize = 0;
  for (const p of centralParts) {
    centralSize += p.length;
    parts.push(p);
  }
  offset += centralSize;

  const endRecord = new Uint8Array(22);
  const ed = new DataView(endRecord.buffer);
  ed.setUint32(0, 0x06054b50, true);
  ed.setUint16(4, 0, true); // disk
  ed.setUint16(6, 0, true); // disk with central
  ed.setUint16(8, centralParts.length, true); // entries on disk
  ed.setUint16(10, centralParts.length, true); // total entries
  ed.setUint32(12, centralSize, true); // size of central dir
  ed.setUint32(16, centralDirStart, true); // offset of central dir
  ed.setUint16(20, 0, true); // comment length

  parts.push(endRecord);

  // concat
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let ptr = 0;
  for (const p of parts) {
    out.set(p, ptr);
    ptr += p.length;
  }
  return new Blob([out], { type: "application/zip" });
}

export default function ExportJsonClient() {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">خروجی JSON</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {files.map((f) => (
          <button
            key={f.name}
            onClick={() => downloadFile(f.name, f.data)}
            className="px-3 py-1 border rounded text-sm"
            type="button"
          >
            دانلود {f.name}
          </button>
        ))}
      </div>

      <div>
        <button
          onClick={() => {
            const filesData = files.map((f) => ({
              name: f.name,
              content: JSON.stringify(f.data, null, 2),
            }));
            const zip = makeZip(filesData);
            const url = URL.createObjectURL(zip);
            const a = document.createElement("a");
            a.href = url;
            a.download = "all-json-files.zip";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 bg-sky-600 text-white rounded"
          type="button"
        >
          دانلود همه (ZIP)
        </button>
      </div>
    </div>
  );
}
