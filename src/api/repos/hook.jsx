import { useQuery } from '@tanstack/react-query';
import { getRepos } from './api.jsx'

export const useRepos = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['repositories'],
        queryFn: () => getRepos(),

    });

    return {
        data,
        isLoading,
        isError,
        error
    };
};


