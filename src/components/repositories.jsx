import { useRepos } from "../api/repos/hook.jsx";

import { useMemo, useState} from "react";
import { debounce } from "lodash";

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Repositories = () => {

    const [query, setQuery] = useState("");       // текущее значение input
    const [search, setSearch] = useState("");
    const { data, isLoading, isError, error    } = useRepos();
    const [page, setPage] = useState(1); // текущая страница
    const itemsPerPage = 10;


    const debouncedSetSearch = useMemo(
        () => debounce((val) => setSearch(val), 500),
        []
    );

    const handleChange = (e) => {
        setQuery(e.target.value);
        debouncedSetSearch(e.target.value);
        setPage(1);
    };

    const filteredRepos = useMemo(() => {
        if (!data?.items) return [];
        if (!search) return data.items;
        return data.items.filter((repo) =>
            repo.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);


    const paginatedRepos = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredRepos.slice(start, end);
    }, [filteredRepos, page]);

    return (
        <>
            {isLoading && 'loading...'}
            {isError && <div style={{ color: "red" }}>
                Ошибка: {error.message}
            </div>}

            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Введите запрос"
                style={{ padding: "5px", marginBottom: "10px", width: "300px" }}
            />

            {paginatedRepos.map((repo) => (
                <div key={repo.id} style={{ margin: 5, padding: 10, borderColor: "rgb(61, 68, 77)", borderWidth: 1,
                    borderStyle: "solid"}}>
                    <div style={{ fontWeight: "bold" }}>{repo.name}</div>
                    <div>{repo.description}</div>
                    <div>Stars: {repo.stargazers_count}</div>
                    <div>Language: {repo.language} </div>
                </div>
            ))}

            <Stack spacing={2} alignItems="center" marginTop={2}>
                <Pagination
                    count={Math.ceil(filteredRepos.length / itemsPerPage)}
                    page={page}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "white",
                            border: "1px solid white",
                        },
                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: "#333",
                        },
                    }}
                    onChange={(e, value) => setPage(value)}
                    renderItem={(item) => (
                        <PaginationItem
                            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                            {...item}
                        />
                    )}
                />
            </Stack>
        </>
    )
}

