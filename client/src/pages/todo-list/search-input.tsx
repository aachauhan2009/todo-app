import { BaseInput } from "../../components/input";

interface SearchInputProps {
    search: string;
    setSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, setSearch }) => {
    return (
        <BaseInput placeholder="Search Todo" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)} name="search" />
    );
};

export default SearchInput;
