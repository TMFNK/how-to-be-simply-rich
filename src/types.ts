export interface TopicContent {
  title: string;
  domain: string;
  definition: string;
  why: string;
  notice: string;
  choose: string;
  practice: string;
  prompts: string[];
}

export interface Domain {
  name: string;
  description: string;
  topics: string[];
}
