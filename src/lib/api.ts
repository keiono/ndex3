import useSWR from 'swr';
import { NetworkSearchResult, SearchParams } from '@/types/ndex';

const BASE_URL = 'https://www.ndexbio.org/v2';

const buildUrl = (baseUrl: string, params: SearchParams) => {
  const queryParams = new URLSearchParams({
    start: (params.start || 0).toString(),
    size: (params.size || 100).toString(), // default size updated to 100
  });
  
  return `${baseUrl}?${queryParams.toString()}`;
};

const fetcher = async (url: string, params: SearchParams) => {
  const fullUrl = buildUrl(url, params);

  // Build the POST payload using the provided search parameters.
  const body = {
    searchString: params.searchString || '',
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
  const { data, error, isLoading } = useSWR<NetworkSearchResult, Error, [string, SearchParams]>(
    [`${BASE_URL}/search/network`, params],
    ([url, searchParams]) => fetcher(url, searchParams),
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      fallbackData: EMPTY_RESULT,
      keepPreviousData: true,
      suspense: false
    }
  );

  return {
    networks: data?.networks || [],
    error,
    isLoading,
    total: data?.numFound || 0
  };
};
