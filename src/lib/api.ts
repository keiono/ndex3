import useSWR from 'swr';
import { NetworkSearchResult, SearchParams } from '@/types/ndex';

const BASE_URL = 'https://www.ndexbio.org/v2';

const buildUrl = (baseUrl: string, params: SearchParams) => {
  // Include all required parameters in the URL query params
  const queryParams = new URLSearchParams();
  queryParams.set('start', (params.start || 0).toString());
  queryParams.set('size', (params.size || 25).toString());
  if (params.searchString) {
    queryParams.set('searchString', params.searchString);
  }
  if (params.permission) {
    queryParams.set('permission', params.permission);
  }
  if (typeof params.includeGroups === 'boolean') {
    queryParams.set('includeGroups', params.includeGroups.toString());
  }
  if (params.accountName) {
    queryParams.set('accountName', params.accountName);
  }
  
  return `${baseUrl}?${queryParams.toString()}`;
};

const fetcher = async (url: string, params: SearchParams) => {
  const fullUrl = buildUrl(url, params);
  
  // Ensure the POST body matches exactly what the API expects
  const body: SearchParams = {
    searchString: params.searchString || '',
    start: params.start || 0,
    size: params.size || 25,
    ...(params.permission && { permission: params.permission }),
    ...(typeof params.includeGroups === 'boolean' && { includeGroups: params.includeGroups }),
    ...(params.accountName && { accountName: params.accountName })
  };

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};

const EMPTY_RESULT: NetworkSearchResult = {
  networks: [],
  numFound: 0,
  start: 0
};

export const useNetworkSearch = (params: SearchParams) => {
  // Create a cache key that changes when any relevant param changes
  const cacheKey = JSON.stringify({
    url: `${BASE_URL}/search/network`,
    searchString: params.searchString || '',
    start: params.start || 0,
    size: params.size || 25,
    permission: params.permission,
    includeGroups: params.includeGroups,
    accountName: params.accountName
  });

  const { data, error, isLoading } = useSWR<NetworkSearchResult, Error>(
    cacheKey,
    () => fetcher(`${BASE_URL}/search/network`, params),
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      fallbackData: EMPTY_RESULT,
      keepPreviousData: false, // Don't keep previous data to ensure fresh results
      suspense: false,
      revalidateOnMount: true, // Always fetch on mount
    }
  );

  return {
    networks: data?.networks || [],
    error,
    isLoading,
    total: data?.numFound || 0
  };
};
