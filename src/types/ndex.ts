export interface NetworkSummary {
  ownerUUID: string;
  isReadOnly: boolean;
  subnetworkIds: string[];
  nodeCount: number;
  edgeCount: number;
  visibility: string;
  name: string;
  description: string;
  version: string;
  creationTime: number;
  modificationTime: number;
  externalId: string;
  owner: string;
  properties: Array<{
    predicateString: string;
    value: string;
    dataType: string;
    subnetworkId: string | null;
  }>;
}

export interface NetworkSearchResult {
  numFound: number;
  start: number;
  networks: NetworkSummary[];
}

export interface SearchParams {
  searchString?: string;
  start?: number;
  size?: number;
  accountName?: string;
  permission?: string;
  includeGroups?: boolean;
}
