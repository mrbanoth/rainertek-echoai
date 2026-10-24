import { promises as fs } from 'fs';
import path from 'path';
import { CallSessionRecord } from '@/types';

const filePath = path.join(process.cwd(), 'data', 'calls.json');

async function readCalls(): Promise<CallSessionRecord[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CallSessionRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeCalls(calls: CallSessionRecord[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(calls, null, 2), 'utf8');
}

export async function listCalls() {
  return readCalls();
}

export async function upsertCall(call: CallSessionRecord) {
  const calls = await readCalls();
  const index = calls.findIndex((item) => item.id === call.id);
  if (index >= 0) calls[index] = call;
  else calls.unshift(call);
  await writeCalls(calls);
  return call;
}

export async function clearCalls() {
  await writeCalls([]);
}
