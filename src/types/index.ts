export interface VoiceAgent {
  id: string;
  name: string;
  creatorEmail: string;
  lastEdited: string;
  voiceModel: string;
  language: string;
  appId: string;
  assignedNumber?: string;
  greetingPrompt?: string;
  status: 'active' | 'draft' | 'archived';
}

export interface PhoneNumberRecord {
  id: string;
  number: string;
  group: string;
  status: 'active' | 'unassigned' | 'archived';
  addedDate: string;
  updatedDate: string;
  renewsAt: string;
  assignedAgent?: string;
}

export interface InboundCallMetric {
  timeLabel: string;
  calls: number;
  concurrency: number;
}

export interface InboundCallRecord {
  id: string;
  agentName: string;
  status: 'active' | 'completed' | 'missed';
  appId: string;
  phoneNumber: string;
  createdAt: string;
  durationSeconds: number;
  transcript?: Array<{ speaker: 'caller' | 'agent'; text: string; time: string }>;
}

export interface OutboundCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  targetCount: number;
  completedCount: number;
  agentId: string;
  createdAt: string;
}
