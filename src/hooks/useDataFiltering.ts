import { useState, useEffect, useMemo } from 'react';

interface UseDataFilteringProps<T> {
    data: T[];
    searchFields: (keyof T)[];
    filterFields: {
        [K in keyof T]?: {
            value: string;
            onChange: (value: string) => void;
            options: { value: string; label: string }[];
        };
    };
    sortField: keyof T;
    sortOrder: 'asc' | 'desc';
    onSortChange: (field: keyof T) => void;
    onSortOrderToggle: () => void;
    itemsPerPage?: number;
}

export function useDataFiltering<T extends Record<string, any>>({
    data,
    searchFields,
    filterFields,
    sortField,
    sortOrder,
    onSortChange,
    onSortOrderToggle,
    itemsPerPage = 10
}: UseDataFilteringProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFiltering, setIsFiltering] = useState(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let filtered = [...data];

        // Apply search filter
        if (debouncedSearchTerm) {
            filtered = filtered.filter(item =>
                searchFields.some(field => {
                    const value = item[field];
                    return value && value.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
                })
            );
        }

        // Apply field filters
        Object.entries(filterFields).forEach(([field, config]) => {
            if (config?.value) {
                filtered = filtered.filter(item => item[field] === config.value);
            }
        });

        // Apply sorting
        filtered.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

        return filtered;
    }, [data, debouncedSearchTerm, filterFields, sortField, sortOrder, searchFields]);

    // Handle filtering state
    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => {
            setIsFiltering(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [debouncedSearchTerm, filterFields, sortField, sortOrder]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);

    // Pagination info
    const pagination = useMemo(() => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        return {
            currentPage,
            totalPages,
            totalItems: filteredData.length,
            itemsPerPage,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        };
    }, [filteredData.length, currentPage, itemsPerPage]);

    // Update current page when filtered data changes
    useEffect(() => {
        if (currentPage > pagination.totalPages && pagination.totalPages > 0) {
            setCurrentPage(1);
        }
    }, [pagination.totalPages, currentPage]);

    // Check for active filters
    const hasActiveFilters = useMemo(() => {
        return searchTerm !== '' || Object.values(filterFields).some(config => config?.value !== '');
    }, [searchTerm, filterFields]);

    // Get filter count
    const getFilterCount = () => {
        let count = 0;
        if (searchTerm) count++;
        Object.values(filterFields).forEach(config => {
            if (config?.value) count++;
        });
        return count;
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setCurrentPage(1);
        Object.values(filterFields).forEach(config => {
            config?.onChange('');
        });
    };

    return {
        // Data
        filteredData,
        paginatedData,
        
        // Search
        searchTerm,
        setSearchTerm,
        debouncedSearchTerm,
        
        // Pagination
        pagination,
        setCurrentPage,
        
        // Status
        isFiltering,
        hasActiveFilters,
        getFilterCount,
        clearFilters
    };
}
